"use client";

import { useEffect, useState } from "react";
import { StudioEditor, StudioHelpButton, StudioHelpModal, markStudioHelpSeen, studioHelpUnseen } from "@/components/StudioEditor";
import { PackQuizScreen } from "@/components/PackQuizScreen";
import { PackFixWizard } from "@/components/PackFixWizard";
import { StudioChromeNav, WorldsBack } from "@/components/WorldsBack";
import {
  EASY_PACK_FORMATS,
  HARD_PACK_FORMATS,
  emptyPack,
  itemsForFormat,
  uniqueGroups,
  visibleItems,
  type Pack,
  type PackFormatId,
  type PackItem,
} from "@/data/pack";
import { STRINGS } from "@/i18n/strings";
import { deletePack, getPack, listPacks, savePack } from "@/lib/packStore";
import { createPackRound, isPackCorrect, packLevelGroups, type PackQuestion } from "@/lib/quiz/pack";
import { QUESTION_TIME_MS, ROUND_SIZES, type RoundSize } from "@/lib/quiz";
import { playSfx } from "@/lib/sfx";
import { EmpireLock } from "@/components/EmpireLock";
import { useEmpire } from "@/lib/empireStore";
import { access } from "@/lib/empire/gates";
import type { PlaySession } from "./session";

type View = "list" | "edit" | "home" | "learn" | "mistakes" | "levels" | "quiz" | "results";
type MixKind = "easy" | "hard" | "custom";

/** Studio stays closed until the pack editor is ready to ship again. */
const STUDIO_OPEN = false

export function StudioPlay({ play }: { play: PlaySession }) {
  if (STUDIO_OPEN) return <StudioPlayLive play={play} />
  const lang = play.quizSettings.lang
  const t = STRINGS[lang]
  return (
    <div className="screen home-screen pack-studio">
      <header className="home-header">
        <WorldsBack lang={lang} onClick={play.goToWorlds} />
        <h1>{t.studio}</h1>
        <p className="subtitle">{t.studioUnavailable}</p>
      </header>
    </div>
  )
}

function StudioPlayLive({ play }: { play: PlaySession }) {
  const lang = play.quizSettings.lang;
  const t = STRINGS[lang];
  const studioLocked = access(useEmpire(), { kind: "studio" }) === "locked";
  const [view, setView] = useState<View>("list");
  const [packs, setPacks] = useState<Pack[]>([]);
  const [pack, setPack] = useState<Pack | null>(null);
  const [mix, setMix] = useState<MixKind>("easy");
  const [roundSize, setRoundSize] = useState<RoundSize>(10);
  const [group, setGroup] = useState<string | "all">("all");
  const [questions, setQuestions] = useState<PackQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [remainingMs, setRemainingMs] = useState(QUESTION_TIME_MS + 5000);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [livesLeft, setLivesLeft] = useState(3);
  const [practice, setPractice] = useState(false);
  const [fixItem, setFixItem] = useState<PackItem | null>(null);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    void listPacks().then(setPacks);
  }, []);

  useEffect(() => {
    setHelp(studioHelpUnseen());
  }, []);

  const liveFormats = formatsForMix(pack, mix);

  async function persist(next: Pack) {
    setPack(next);
    await savePack(next);
    setPacks(await listPacks());
  }

  function startRound(opts?: { ids?: string[]; group?: string; practice?: boolean; formats?: PackFormatId[] }) {
    if (!pack) return;
    const formats = opts?.formats ?? liveFormats;
    const size = Math.min(roundSize, Math.max(2, visiblePlayable(pack, formats)));
    const qs = createPackRound(pack, formats, size, opts?.group === "all" ? undefined : opts?.group ?? (group === "all" ? undefined : group), opts?.ids);
    if (qs.length === 0) return;
    setQuestions(qs);
    setIndex(0);
    setSelectedId(null);
    setTimedOut(false);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setLivesLeft(3);
    setPractice(Boolean(opts?.practice));
    setRemainingMs(QUESTION_TIME_MS + 5000);
    setView("quiz");
  }

  useEffect(() => {
    if (view !== "quiz" || selectedId !== null || timedOut || practice) return;
    const limit = QUESTION_TIME_MS + 5000;
    setRemainingMs(limit);
    const tick = window.setTimeout(() => {
      setRemainingMs(0);
      setTimedOut(true);
      playSfx("wrong");
      setStreak(0);
      setLivesLeft((n) => Math.max(0, n - 1));
    }, limit);
    return () => window.clearTimeout(tick);
  }, [view, index, selectedId, timedOut, practice]);

  const question = questions[index];

  function selectAnswer(id: string) {
    if (!pack || !question || selectedId) return;
    setSelectedId(id);
    const ok = isPackCorrect(question, id);
    if (ok) {
      playSfx("correct");
      setCorrectCount((n) => n + 1);
      setStreak((n) => {
        const next = n + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      playSfx("wrong");
      setStreak(0);
      const mistakes = [...(pack.mistakes ?? []), { itemId: question.itemId, format: question.format, at: Date.now() }].slice(0, 200);
      void persist({ ...pack, mistakes });
      if (!practice) setLivesLeft((n) => Math.max(0, n - 1));
    }
  }

  function nextQuestion() {
    const last = index + 1 >= questions.length;
    const dead = !practice && livesLeft <= 0 && selectedId !== question?.answerId;
    if (last || dead || (timedOut && !practice)) {
      setView("results");
      return;
    }
    setIndex((n) => n + 1);
    setSelectedId(null);
    setTimedOut(false);
    setRemainingMs(QUESTION_TIME_MS + 5000);
  }

  function dropPack(id: string) {
    void deletePack(id).then(async () => {
      setPacks(await listPacks());
      if (pack?.id === id) {
        setPack(null);
        setView("list");
      }
    });
  }

  if (view === "list") {
    return (
      <div className="screen home-screen pack-studio">
        <header className="home-header">
          <WorldsBack lang={lang} onClick={play.goToWorlds} />
          <h1>{t.studio}</h1>
          <p className="subtitle">{t.studioSubtitle}</p>
          <StudioHelpButton lang={lang} onClick={() => setHelp(true)} />
        </header>
        {studioLocked ? (
          <EmpireLock lang={lang} feature={{ kind: "studio" }} title={t.gateStudio} note={t.gateStudioWhy} />
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPack(emptyPack());
              setView("edit");
            }}
          >
            {t.studioNew}
          </button>
        )}
        {packs.length === 0 && !studioLocked ? <p className="setting-hint">{t.studioEmpty}</p> : null}
        <ul className="pack-list">
          {packs.map((row) => (
            <li key={row.id} className="pack-list-row">
              <button
                type="button"
                className="choice has-note"
                onClick={() => {
                  void getPack(row.id).then((loaded) => {
                    if (!loaded) return;
                    setPack(loaded);
                    setView(loaded.accepted || studioLocked ? "home" : "edit");
                  });
                }}
              >
                {row.title || t.studioNew}
                <span className="choice-note">{t.studioNCards(visibleItems(row).length)}</span>
              </button>
              <button type="button" className="btn-ghost pack-delete-quiz" onClick={() => dropPack(row.id)}>
                {t.studioDelete}
              </button>
            </li>
          ))}
        </ul>
        {help ? (
          <StudioHelpModal
            lang={lang}
            onClose={() => {
              markStudioHelpSeen();
              setHelp(false);
            }}
          />
        ) : null}
      </div>
    );
  }

  if (!pack) return null;

  if (view === "edit") {
    return (
      <StudioEditor
        lang={lang}
        pack={pack}
        onPack={(next) => void persist(next)}
        onBack={() => {
          setPack(null);
          setView("list");
        }}
        onWorlds={play.goToWorlds}
        onAccept={(next) => {
          void persist(next).then(() => setView("home"));
        }}
        onDelete={() => dropPack(pack.id)}
      />
    );
  }

  if (view === "quiz" && question) {
    const item = pack.items.find((row) => row.id === question.itemId) ?? null;
    return (
      <>
        <PackQuizScreen
          lang={lang}
          title={pack.title || t.studio}
          question={question}
          index={index}
          total={questions.length}
          selectedId={selectedId}
          timedOut={timedOut}
          remainingMs={remainingMs}
          livesLeft={livesLeft}
          practice={practice}
          streak={streak}
          onSelect={selectAnswer}
          onNext={nextQuestion}
          onBack={() => setView("home")}
          onWorlds={play.goToWorlds}
          onFix={() => item && setFixItem(item)}
        />
        {fixItem ? (
          <PackFixWizard lang={lang} pack={pack} item={fixItem} question={question} onClose={() => setFixItem(null)} onPack={(next) => void persist(next)} />
        ) : null}
      </>
    );
  }

  if (view === "results") {
    return (
      <div className="screen results-screen">
        <header className="home-header">
          <StudioChromeNav lang={lang} onBack={() => setView("home")} onWorlds={play.goToWorlds} />
          <h1>
            {correctCount}/{questions.length}
          </h1>
          {bestStreak >= 2 ? <p className="quiz-streak">{t.longestStreak(bestStreak)}</p> : null}
        </header>
        <button type="button" className="btn-primary" onClick={() => startRound({ practice })}>
          {t.playAgain}
        </button>
      </div>
    );
  }

  if (view === "learn") {
    return (
      <div className="screen pack-studio">
        <header className="home-header">
          <StudioChromeNav lang={lang} onBack={() => setView("home")} onWorlds={play.goToWorlds} />
          <h1>{t.learn}</h1>
        </header>
        <ul className="pack-learn-list">
          {pack.items.filter((item) => !item.hidden).map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              {item.definition ? <p>{item.definition}</p> : null}
              <button type="button" className="btn-ghost" onClick={() => setFixItem(item)}>
                {t.studioFix}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn-primary" onClick={() => startRound({ practice: true })}>
          {t.studioPlay}
        </button>
        {fixItem ? <PackFixWizard lang={lang} pack={pack} item={fixItem} onClose={() => setFixItem(null)} onPack={(next) => void persist(next)} /> : null}
      </div>
    );
  }

  if (view === "mistakes") {
    const ids = [...new Set((pack.mistakes ?? []).map((row) => row.itemId))];
    return (
      <div className="screen pack-studio">
        <header className="home-header">
          <StudioChromeNav lang={lang} onBack={() => setView("home")} onWorlds={play.goToWorlds} />
          <h1>{t.mistakes}</h1>
        </header>
        <button type="button" className="btn-primary" disabled={ids.length < 2} onClick={() => startRound({ ids, practice: true })}>
          {t.studioPlay}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => void persist({ ...pack, mistakes: [] })}
        >
          {t.studioDelete}
        </button>
      </div>
    );
  }

  if (view === "levels") {
    const levels = packLevelGroups(pack);
    return (
      <div className="screen pack-studio">
        <header className="home-header">
          <StudioChromeNav lang={lang} onBack={() => setView("home")} onWorlds={play.goToWorlds} />
          <h1>{t.levels}</h1>
        </header>
        <div className="choice-grid is-3">
          {levels.map((row) => (
            <button
              key={row.level}
              type="button"
              className="choice"
              onClick={() => startRound({ ids: row.ids, group: row.group, practice: false })}
            >
              {row.level}
              {row.group ? <span className="choice-note">{row.group}</span> : null}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const groups = uniqueGroups(pack);
  const canPlay = liveFormats.some((format) => itemsForFormat(pack, format).length >= 2);

  return (
    <div className="screen home-screen pack-studio">
        <header className="home-header">
          <StudioChromeNav lang={lang} onBack={() => setView("list")} onWorlds={play.goToWorlds} />
          <h1>{pack.title || t.studio}</h1>
        </header>
      <div className="settings-card">
        <div className="choice-grid is-3">
          <button type="button" className={`choice ${mix === "easy" ? "is-active" : ""}`} onClick={() => setMix("easy")}>
            {t.packEasyMix}
          </button>
          <button type="button" className={`choice ${mix === "hard" ? "is-active" : ""}`} onClick={() => setMix("hard")}>
            {t.packHardMix}
          </button>
          <button type="button" className={`choice ${mix === "custom" ? "is-active" : ""}`} onClick={() => setMix("custom")}>
            {t.packCustomMix}
          </button>
        </div>
        {mix === "custom" ? (
          <p className="setting-hint">{t.studioFormatsHint}</p>
        ) : null}
        <h2>{t.roundSize}</h2>
        <div className="choice-grid is-3">
          {ROUND_SIZES.map((size) => (
            <button key={size} type="button" className={`choice ${roundSize === size ? "is-active" : ""}`} onClick={() => setRoundSize(size)}>
              {size}
            </button>
          ))}
        </div>
        {groups.length > 0 ? (
          <>
            <h2>{t.packChapters}</h2>
            <div className="choice-wrap">
              <button type="button" className={`chip ${group === "all" ? "is-active" : ""}`} onClick={() => setGroup("all")}>
                {t.packAllChapters}
              </button>
              {groups.map((id) => (
                <button key={id} type="button" className={`chip ${group === id ? "is-active" : ""}`} onClick={() => setGroup(id)}>
                  {id}
                </button>
              ))}
            </div>
          </>
        ) : null}
        {!canPlay ? <p className="setting-hint">{t.studioNoPlay}</p> : null}
        <button type="button" className="btn-primary" disabled={!canPlay} onClick={() => startRound()}>
          {t.studioPlay}
        </button>
        <div className="choice-grid is-3">
          <button type="button" className="choice" onClick={() => setView("learn")}>
            {t.learn}
          </button>
          <button type="button" className="choice" onClick={() => setView("levels")}>
            {t.levels}
          </button>
          <button type="button" className="choice" onClick={() => setView("mistakes")}>
            {t.mistakes}
          </button>
        </div>
        {studioLocked ? null : (
          <button type="button" className="btn-ghost" onClick={() => setView("edit")}>
            {t.studioDraft}
          </button>
        )}
        <button type="button" className="btn-ghost pack-delete-quiz" onClick={() => dropPack(pack.id)}>
          {t.studioDelete}
        </button>
      </div>
    </div>
  );
}

function formatsForMix(pack: Pack | null, mix: MixKind): PackFormatId[] {
  if (!pack) return [];
  if (mix === "custom") return pack.formats.length ? pack.formats : EASY_PACK_FORMATS;
  const wanted = mix === "easy" ? EASY_PACK_FORMATS : HARD_PACK_FORMATS;
  const hit = wanted.filter((format) => pack.formats.includes(format) && itemsForFormat(pack, format).length >= 2);
  if (hit.length) return hit;
  return pack.formats.filter((format) => itemsForFormat(pack, format).length >= 2);
}

function visiblePlayable(pack: Pack, formats: PackFormatId[]): number {
  const ids = new Set<string>();
  for (const format of formats) {
    for (const item of itemsForFormat(pack, format)) ids.add(item.id);
  }
  return ids.size;
}
