"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { DuelLobby } from "@/components/DuelLobby";
import { DuelResults } from "@/components/DuelResults";
import { FactsScreen } from "@/components/FactsScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { WorldsBack } from "@/components/WorldsBack";
import { playerById } from "@/data/footballPlayers";
import { termById } from "@/data/leaders";
import { STRINGS, isLang, langDir, localeTag, type Lang } from "@/i18n/strings";
import { fetchAccount } from "@/lib/account";
import {
  advanceDuelFact,
  answerDuel,
  fetchDuel,
  joinDuel,
  leaveDuel,
  questionFromWire,
  rematchDuel,
} from "@/lib/duel";
import type { DuelView } from "@/lib/duelTypes";
import { isCorrect, isFactsToName, isLeaderPhotoMode, isPlayerPhotoMode, type QuizMode } from "@/lib/quiz";
import { playSfx } from "@/lib/sfx";
import { prefetchWikiPortraits } from "@/lib/wikiThumb";
import { duelIsFootball, duelWorldHref, normalizeDuelCode } from "./paths";

const LANG_KEY = "un-flag-quiz-lang";
const POLL_MS = 700;

type ResultTone = "success" | "fail";

function subscribeLang(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY);
  return isLang(stored) ? stored : "ru";
}

function errorMessage(lang: Lang, error: string) {
  const t = STRINGS[lang];
  if (error === "missing" || error === "forbidden") return t.duelNotFound;
  if (error === "full") return t.duelFull;
  return t.duelOffline;
}

async function duelName(lang: Lang) {
  const account = await fetchAccount();
  if (account?.name) return account.name;
  return lang === "ru" ? "Игрок" : "Player";
}

export function DuelApp({ code: rawCode }: { code: string }) {
  const router = useRouter();
  const storedLang = useSyncExternalStore(subscribeLang, getStoredLang, (): Lang => "ru");
  const lang = storedLang;
  const code = normalizeDuelCode(rawCode);
  const [view, setView] = useState<DuelView | null>(null);
  const [fatal, setFatal] = useState<string | null>(code ? null : "missing");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);
  const [roundMs, setRoundMs] = useState(0);
  const [resultTone, setResultTone] = useState<ResultTone | null>(null);
  const indexRef = useRef(-1);
  const phaseRef = useRef<DuelView["phase"] | null>(null);
  const joinAttemptedRef = useRef(false);
  const stoppedRef = useRef(false);
  const t = STRINGS[lang];
  const football = duelIsFootball(view);
  const question = questionFromWire(view?.question ?? null);
  const currentMode: QuizMode = question?.mode ?? view?.mode ?? "flagToName";

  useEffect(() => {
    document.documentElement.lang = localeTag(lang);
    document.documentElement.dir = langDir(lang);
    document.title = t.duel;
  }, [lang, t.duel]);

  useEffect(() => {
    if (resultTone) {
      document.documentElement.dataset.result = resultTone;
    } else {
      delete document.documentElement.dataset.result;
    }
    return () => {
      delete document.documentElement.dataset.result;
    };
  }, [resultTone]);

  useEffect(() => {
    if (football) {
      document.documentElement.dataset.world = "football";
    } else {
      delete document.documentElement.dataset.world;
    }
    return () => {
      delete document.documentElement.dataset.world;
    };
  }, [football]);

  useEffect(() => {
    if (!question) return;
    const mode = question.mode ?? currentMode;
    if (!isLeaderPhotoMode(mode) && !isPlayerPhotoMode(mode)) return;
    const wiki = termById(question.country.iso)?.wiki ?? playerById(question.country.iso)?.wiki;
    if (wiki) prefetchWikiPortraits([wiki]);
  }, [question, currentMode]);

  useEffect(() => {
    if (!code || fatal) return;
    stoppedRef.current = false;
    let live = true;
    const pull = async () => {
      if (stoppedRef.current) return;
      const result = await fetchDuel(code);
      if (!live || stoppedRef.current) return;
      if (result.ok) {
        applyView(result.room);
        setError(null);
        return;
      }
      if (result.error === "forbidden" && !joinAttemptedRef.current) {
        joinAttemptedRef.current = true;
        const joined = await joinDuel(code, await duelName(lang));
        if (!live || stoppedRef.current) return;
        if (joined.ok) {
          applyView(joined.room);
          setError(null);
          return;
        }
        stoppedRef.current = true;
        setFatal(joined.error);
        return;
      }
      if (result.error === "missing" || result.error === "forbidden") {
        stoppedRef.current = true;
        setFatal(result.error);
        return;
      }
      setError(errorMessage(lang, result.error));
    };
    void pull();
    const id = window.setInterval(() => {
      void pull();
    }, POLL_MS);
    return () => {
      live = false;
      window.clearInterval(id);
    };
  }, [code, fatal, lang]);

  useEffect(() => {
    if (!view || view.phase === "waiting") return;
    if (view.phase === "done") {
      setRoundMs(view.roundMs);
      return;
    }
    const origin = Date.now() - view.roundMs;
    setRoundMs(view.roundMs);
    const id = window.setInterval(() => {
      setRoundMs(Date.now() - origin);
    }, 200);
    return () => window.clearInterval(id);
  }, [view]);

  useEffect(() => {
    if (!view || view.phase !== "question") return;
    const origin = Date.now();
    const start = view.remainingMs;
    setRemainingMs(start);
    const id = window.setInterval(() => {
      setRemainingMs(Math.max(0, start - (Date.now() - origin)));
    }, 50);
    return () => window.clearInterval(id);
  }, [view]);

  useEffect(() => {
    if (!code || !view || view.phase !== "question") return;
    if (view.youAnswer !== undefined || selectedIso !== null) return;
    if (view.remainingMs > 0) return;
    if (isFactsToName(view.question?.mode ?? view.mode)) return;
    void submitPick(null);
  }, [code, view, selectedIso]);

  function applyView(next: DuelView) {
    const prevPhase = phaseRef.current;
    const indexChanged = indexRef.current !== next.index;
    indexRef.current = next.index;
    phaseRef.current = next.phase;
    setView(next);
    if (next.youAnswer !== undefined) {
      setSelectedIso(next.youAnswer);
      setTimedOut(next.youAnswer === null);
    } else if (indexChanged || prevPhase === "done" || prevPhase === "waiting" || next.phase !== "question") {
      setSelectedIso(null);
      setTimedOut(false);
    }
    if (next.phase === "waiting") {
      setResultTone(null);
      return;
    }
    if (next.phase === "done") {
      setRoundMs(next.roundMs);
      setResultTone(next.youWon === false ? "fail" : "success");
      if (prevPhase !== "done") playSfx(next.youWon === false ? "fail" : "success");
      return;
    }
    setRemainingMs(next.remainingMs);
    setRoundMs(next.roundMs);
    setResultTone(null);
  }

  async function submitPick(iso: string | null) {
    if (!code) return;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const result = await answerDuel(code, iso);
      if (result.ok) {
        applyView(result.room);
        if (iso === null || result.room.youAnswer !== undefined || result.room.phase === "done") return;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50 + attempt * 40));
    }
    const latest = await fetchDuel(code);
    if (latest.ok) {
      applyView(latest.room);
      if (latest.room.youAnswer !== undefined) return;
    }
    if (iso !== null) setSelectedIso(null);
  }

  async function leaveTo(href: string) {
    if (code) await leaveDuel(code);
    router.push(href);
  }

  function selectAnswer(iso: string) {
    if (view?.youAnswer !== undefined) return;
    if (view && view.phase !== "question" && view.phase !== "reveal") return;
    if (question) playSfx(isCorrect({ question, selectedIso: iso, timeMs: 0 }) ? "correct" : "wrong");
    setSelectedIso(iso);
    void submitPick(iso);
  }

  const worldHref = duelWorldHref(view);

  if (!code || fatal) {
    return (
      <div className="app">
        <div className="screen duel-lobby">
          <WorldsBack lang={lang} onClick={() => router.push("/")} />
          <p className="account-error">{errorMessage(lang, fatal ?? "missing")}</p>
          <button type="button" className="btn-ghost" onClick={() => router.push("/")}>
            {t.backToMenu}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app${resultTone ? ` is-${resultTone}` : ""}${football ? " is-football" : ""}`}>
      {!view ? null : football ? (
        <div className="pitch-marks" aria-hidden="true">
          <span className="pitch-mid" />
          <span className="pitch-circle" />
          <span className="pitch-spot" />
          <span className="pitch-box is-top" />
          <span className="pitch-box is-bottom" />
        </div>
      ) : (
        <div className="map-marks" aria-hidden="true">
          <span className="map-marks-n">N</span>
          <span className="map-marks-e">E</span>
          <span className="map-marks-s">S</span>
          <span className="map-marks-w">W</span>
          <span className="map-tick is-nw" />
          <span className="map-tick is-ne" />
          <span className="map-tick is-sw" />
          <span className="map-tick is-se" />
        </div>
      )}
      {!view ? (
        <div className="screen duel-lobby">
          <WorldsBack lang={lang} onClick={() => void leaveTo("/")} />
          <p className="learn-copy">{t.duelWaiting}</p>
        </div>
      ) : null}
      {view?.phase === "waiting" ? (
        <DuelLobby
          lang={lang}
          room={view}
          error={error}
          copied={copied}
          onCopy={() => {
            void navigator.clipboard.writeText(view.code).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            });
          }}
          onLeave={() => void leaveTo(worldHref)}
          onWorlds={() => void leaveTo("/")}
        />
      ) : null}
      {view && (view.phase === "question" || view.phase === "reveal") && question ? (
        isFactsToName(currentMode) ? (
          <FactsScreen
            lang={lang}
            question={question}
            index={view.index}
            total={view.total}
            roundMs={roundMs}
            practice={false}
            selectedIso={view.youAnswer ?? selectedIso}
            finished={false}
            duel={{
              opponentName: view.opponentName ?? t.duelOpponent,
              opponentReady: view.opponentReady,
              youScore: view.youScore,
              opponentScore: view.opponentScore ?? 0,
              remainingMs: view.remainingMs,
              factIndex: view.factIndex ?? 0,
              facts: view.question?.facts ?? [],
              maxFacts: view.factsMax ?? 10,
              wrongs: view.youWrongs ?? 0,
              wrongLimit: view.factsWrongLimit ?? 3,
              hardcore: Boolean(view.facts?.hardcore),
              locked: view.youAnswer !== undefined,
            }}
            onFinish={(iso) => void submitPick(iso)}
            onGuess={(iso) => void submitPick(iso)}
            onAdvance={() => {
              void advanceDuelFact(code).then((result) => {
                if (result.ok) applyView(result.room);
              });
            }}
            onBack={() => void leaveTo(worldHref)}
            onWorlds={() => void leaveTo("/")}
          />
        ) : (
          <QuizScreen
            lang={lang}
            mode={currentMode}
            region={view.region}
            path="pool"
            question={question}
            index={view.index}
            total={view.total}
            selectedIso={selectedIso}
            timedOut={timedOut}
            remainingMs={remainingMs}
            roundMs={roundMs}
            livesLeft={0}
            maxLives={0}
            practice={false}
            mix={view.modes.length > 1}
            includeExtras={Boolean(view.includeExtras)}
            duel={{
              opponentName: view.opponentName ?? t.duelOpponent,
              opponentReady: view.opponentReady,
              opponentAnswer: view.opponentAnswer,
              reveal: view.phase === "reveal",
              youScore: view.youScore,
              opponentScore: view.opponentScore ?? 0,
            }}
            onSelect={selectAnswer}
            onBack={() => void leaveTo(worldHref)}
            onWorlds={() => void leaveTo("/")}
          />
        )
      ) : null}
      {view?.phase === "done" ? (
        <DuelResults
          lang={lang}
          room={view}
          roundMs={roundMs}
          onRematch={() => {
            void rematchDuel(code).then((result) => {
              if (result.ok) applyView(result.room);
            });
          }}
          onMenu={() => void leaveTo(worldHref)}
          onWorlds={() => void leaveTo("/")}
        />
      ) : null}
      <nav className="catalog-links">
        <a href="/countries">{t.legalCountries}</a>
        <a href="/languages">{t.legalLanguages}</a>
        <a href="/today">{t.legalToday}</a>
      </nav>
      <footer className="legal-footer">
        <nav className="legal-links">
          <a href="/about">{t.legalAbout}</a>
          <a href="/privacy">{t.legalPrivacy}</a>
          <a href="/contacts">{t.legalContacts}</a>
        </nav>
        <p className="credit">{t.credit}</p>
      </footer>
    </div>
  );
}
