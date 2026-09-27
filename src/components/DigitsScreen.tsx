"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MATH_DIGIT_IDS,
  MATH_DIGIT_MILESTONES,
  mathDigitById,
  type MathDigitId,
  type MathDigitMilestone,
} from "../data/mathDigits";
import { STRINGS, type Lang } from "../i18n/strings";
import { HelpTip } from "./HelpTip";
import { EMPTY_DIGIT_BESTS, loadDigitBests, saveDigitBest, type DigitBests } from "../lib/digitProgress";
import {
  DIGITS_PER_ROW,
  DIGIT_GROUP,
  digitGroupAt,
  digitGroupCount,
  digitRunStatus,
  digitTruth,
  matchedDigits,
  normalizeTypedDigits,
} from "../lib/quiz/mathDigits";
import { FitGroup, FitText } from "./FitText";
import { HubNav, MATH_HUB_TABS, type HubTab } from "./HubNav";
import { WorldsBack } from "./WorldsBack";

interface DigitsScreenProps {
  lang: Lang;
  onBack: () => void;
  onHub: (tab: HubTab) => void;
  onWorlds: () => void;
}

function digitLabel(id: MathDigitId, lang: Lang): string {
  const t = STRINGS[lang];
  if (id === "pi") return t.digitsPi;
  if (id === "phi") return t.digitsPhi;
  if (id === "e") return t.digitsE;
  return t.digitsSqrt2;
}

function fillMiss(template: string, n: number, digit: string): string {
  return template.replace("{n}", String(n)).replace("{d}", digit);
}

function DigitRows({ length, renderGroup }: { length: number; renderGroup: (index: number) => ReactNode }) {
  const groups = digitGroupCount(length);
  if (groups === 0) return null;
  const perRow = DIGITS_PER_ROW / DIGIT_GROUP;
  return (
    <>
      {Array.from({ length: Math.ceil(groups / perRow) }, (_, row) => (
        <div key={row} className="digits-row">
          <span className="digits-index">{row * DIGITS_PER_ROW + 1}</span>
          {Array.from({ length: perRow }, (_, col) => {
            const index = row * perRow + col;
            if (index >= groups) return null;
            return renderGroup(index);
          })}
        </div>
      ))}
    </>
  );
}

function TypedHalves({ text, start, matched, caretAt }: { text: string; start: number; matched: number; caretAt: number | null }) {
  return (
    <>
      {[0, 1].map((half) => (
        <span key={half}>
          {Array.from({ length: 5 }, (_, offset) => {
            const local = half * 5 + offset;
            const at = start + local;
            const char = text[local];
            if (char) {
              return (
                <span key={at} className="digits-slot">
                  <span className={at < matched ? "digits-ok" : "digits-bad"}>{char}</span>
                </span>
              );
            }
            if (caretAt === at) {
              return (
                <span key={at} className="digits-slot" aria-hidden="true">
                  <span className="digits-caret" />
                </span>
              );
            }
            return <span key={at} className="digits-slot" aria-hidden="true" />;
          })}
        </span>
      ))}
    </>
  );
}

function WatchHalves({ text }: { text: string }) {
  return (
    <>
      <span>{text.slice(0, 5)}</span>
      {text.length > 5 ? <span>{text.slice(5)}</span> : null}
    </>
  );
}

export function DigitsScreen({ lang, onBack, onHub, onWorlds }: DigitsScreenProps) {
  const t = STRINGS[lang];
  const [id, setId] = useState<MathDigitId>("pi");
  const [milestone, setMilestone] = useState<MathDigitMilestone>(50);
  const [lane, setLane] = useState<"watch" | "type">("watch");
  const [hidden, setHidden] = useState<Set<number>>(() => new Set());
  const [typed, setTyped] = useState("");
  const [locked, setLocked] = useState(false);
  const [bests, setBests] = useState<DigitBests>(EMPTY_DIGIT_BESTS);
  const inputRef = useRef<HTMLInputElement>(null);

  const item = mathDigitById(id);
  const truth = digitTruth(item, milestone);
  const matched = matchedDigits(typed, truth);
  const status = digitRunStatus(typed, truth);

  useEffect(() => {
    setBests(loadDigitBests());
  }, []);

  useEffect(() => {
    if (lane === "type") inputRef.current?.focus();
  }, [lane, id, milestone, locked]);

  function resetRun() {
    setTyped("");
    setLocked(false);
    setHidden(new Set());
  }

  function chooseConstant(next: MathDigitId) {
    setId(next);
    resetRun();
  }

  function chooseMilestone(next: MathDigitMilestone) {
    setMilestone(next);
    resetRun();
  }

  function onType(raw: string) {
    if (locked) return;
    const next = normalizeTypedDigits(raw, item.head).slice(0, milestone);
    const chain = matchedDigits(next, truth);
    const nextStatus = digitRunStatus(next, truth);
    if (nextStatus === "miss") {
      setTyped(next.slice(0, chain + 1));
      setLocked(true);
    } else {
      setTyped(next);
    }
    if (chain > bests[id]) setBests(saveDigitBest(id, chain));
  }

  const showCaret = status === "typing";
  const boardLength = showCaret ? Math.max(typed.length + 1, 1) : Math.max(typed.length, 1);
  const caretAt = showCaret ? typed.length : null;

  return (
    <div className="screen digits-screen">
      <header className="home-header">
        <div className="pack-chrome-nav">
          <WorldsBack lang={lang} label={t.back} onClick={onBack} />
          <button type="button" className="btn-ghost pack-worlds-link" onClick={onWorlds}>
            {t.worldsBack}
          </button>
        </div>
        <h1 className="football-title">
          {t.mathFamilyDigits}
          <HelpTip text={t.digitsPrompt} />
        </h1>
      </header>

      <HubNav lang={lang} active="free" tabs={MATH_HUB_TABS} onSelect={onHub} />

      <div className="choice-grid is-modes">
        <FitGroup wrap minPx={8}>
          {MATH_DIGIT_IDS.map((digitId) => {
            const digit = mathDigitById(digitId);
            const best = bests[digitId];
            return (
              <button
                key={digitId}
                type="button"
                className={`choice ${id === digitId ? "is-active" : ""}`}
                aria-pressed={id === digitId}
                onClick={() => chooseConstant(digitId)}
              >
                <FitText>{`${digit.symbol}${best > 0 ? ` · ${best}` : ""}`}</FitText>
              </button>
            );
          })}
        </FitGroup>
      </div>

      <p className="digits-name">
        {item.symbol} · {digitLabel(id, lang)}
        {bests[id] > 0 ? ` · ${t.digitsBest} ${bests[id]}` : ""}
      </p>

      <div className="choice-grid digits-milestones">
        {MATH_DIGIT_MILESTONES.map((goal) => (
          <button
            key={goal}
            type="button"
            className={`choice ${milestone === goal ? "is-active" : ""}`}
            aria-pressed={milestone === goal}
            onClick={() => chooseMilestone(goal)}
          >
            {goal}
          </button>
        ))}
      </div>

      <div className="choice-grid is-2 digits-lanes">
        <button
          type="button"
          className={`choice ${lane === "watch" ? "is-active" : ""}`}
          aria-pressed={lane === "watch"}
          onClick={() => setLane("watch")}
        >
          {t.digitsWatch}
        </button>
        <button
          type="button"
          className={`choice ${lane === "type" ? "is-active" : ""}`}
          aria-pressed={lane === "type"}
          onClick={() => setLane("type")}
        >
          {t.digitsType}
        </button>
      </div>

      {lane === "watch" ? (
        <>
          <div className="digits-watch-bar">
            <HelpTip text={t.digitsHideHint} />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setHidden(new Set(Array.from({ length: digitGroupCount(truth.length) }, (_, index) => index)))}
            >
              {t.digitsHideAll}
            </button>
            <button type="button" className="btn-ghost" onClick={() => setHidden(new Set())}>
              {t.digitsShowAll}
            </button>
          </div>
          <div className="digits-board" dir="ltr">
            <span className="digits-head">{item.head}</span>
            <DigitRows
              length={truth.length}
              renderGroup={(index) => {
                const text = digitGroupAt(truth, index);
                const isHidden = hidden.has(index);
                const last = index === digitGroupCount(truth.length) - 1;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`digits-group${last ? " is-goal" : ""}${isHidden ? " is-hidden" : ""}`}
                    aria-pressed={isHidden}
                    aria-label={isHidden ? String(index * DIGIT_GROUP + 1) : undefined}
                    onClick={() => {
                      setHidden((current) => {
                        const next = new Set(current);
                        if (next.has(index)) next.delete(index);
                        else next.add(index);
                        return next;
                      });
                    }}
                  >
                    {isHidden ? null : <WatchHalves text={text} />}
                  </button>
                );
              }}
            />
          </div>
        </>
      ) : (
        <div className="digits-type">
          <div
            className="digits-board is-typed"
            dir="ltr"
            onClick={() => inputRef.current?.focus()}
          >
            <span className="digits-head">{item.head}</span>
            <DigitRows
              length={boardLength}
              renderGroup={(index) => (
                <span key={index} className="digits-group is-static">
                  <TypedHalves
                    text={digitGroupAt(typed, index)}
                    start={index * DIGIT_GROUP}
                    matched={matched}
                    caretAt={caretAt}
                  />
                </span>
              )}
            />
            <input
              ref={inputRef}
              className="digits-input"
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={typed}
              readOnly={locked}
              aria-label={t.digitsType}
              onChange={(event) => onType(event.target.value)}
            />
          </div>
          <p className="digits-score">
            {matched} / {milestone}
          </p>
          {status === "miss" ? (
            <p className="digits-note is-miss">{fillMiss(t.digitsMiss, matched + 1, truth[matched] ?? "")}</p>
          ) : null}
          {status === "done" ? <p className="digits-note is-done">{t.digitsDone}</p> : null}
          {locked || status === "done" ? (
            <button type="button" className="btn-primary" onClick={resetRun}>
              {t.digitsAgain}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
