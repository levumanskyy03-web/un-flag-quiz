"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HomeScreen, type QuizSettings } from "./components/HomeScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { STRINGS, type Lang } from "./i18n/strings";
import { clearBests, clearHistory, loadBests, loadHistory, saveRound, type RoundRecord } from "./lib/history";
import {
  ANSWER_PAUSE_MS,
  QUESTION_TIME_MS,
  createRound,
  getPool,
  isCorrect,
  maxLives,
  type Question,
  type RoundAnswer,
} from "./lib/quiz";

const LANG_KEY = "un-flag-quiz-lang";

type Screen = "home" | "quiz" | "results";
type ResultTone = "success" | "fail";

function subscribeLang(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY);
  return stored === "en" || stored === "ru" ? stored : "ru";
}

export default function App() {
  const storedLang = useSyncExternalStore(subscribeLang, getStoredLang, (): Lang => "ru");
  const [lang, setLang] = useState<Lang | null>(null);
  const [settings, setSettings] = useState<Omit<QuizSettings, "lang">>({
    mode: "flagToName",
    region: "all",
    difficulty: "easy",
    roundSize: 10,
  });
  const [screen, setScreen] = useState<Screen>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [remainingMs, setRemainingMs] = useState(QUESTION_TIME_MS);
  const [roundMs, setRoundMs] = useState(0);
  const [history, setHistory] = useState<RoundRecord[]>([]);
  const [bests, setBests] = useState<RoundRecord[]>([]);
  const [isNewBest, setIsNewBest] = useState(false);
  const [resultTone, setResultTone] = useState<ResultTone | null>(null);
  const roundStartRef = useRef<number | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const savedRoundRef = useRef(false);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };
  const answered = selectedIso !== null || timedOut;
  const livesLimit = maxLives(quizSettings.difficulty);
  const mistakes = answers.filter((answer) => !isCorrect(answer)).length;
  const livesLeft = Math.max(0, livesLimit - mistakes);
  const endedBy = timedOut ? "timeout" : mistakes >= livesLimit ? "lives" : "complete";

  useEffect(() => {
    document.documentElement.lang = quizSettings.lang;
    document.title = STRINGS[quizSettings.lang].title;
  }, [quizSettings.lang]);

  useEffect(() => {
    if (resultTone) {
      document.documentElement.dataset.result = resultTone;
    } else {
      delete document.documentElement.dataset.result;
    }
  }, [resultTone]);

  useEffect(() => {
    setHistory(loadHistory());
    setBests(loadBests());
  }, []);

  useEffect(() => {
    if (screen !== "quiz" || roundStartRef.current === null) return;
    const started = roundStartRef.current;
    const id = window.setInterval(() => {
      setRoundMs(Date.now() - started);
    }, 200);
    return () => window.clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || answered) return;
    const started = Date.now();
    questionStartRef.current = started;
    const id = window.setInterval(() => {
      const left = QUESTION_TIME_MS - (Date.now() - started);
      if (left <= 0) {
        window.clearInterval(id);
        setRemainingMs(0);
        setTimedOut(true);
        setAnswers((prev) => {
          if (prev.length > index) return prev;
          const question = questions[index];
          if (!question) return prev;
          return [...prev, { question, selectedIso: null, timeMs: QUESTION_TIME_MS }];
        });
        return;
      }
      setRemainingMs(left);
    }, 50);
    return () => window.clearInterval(id);
  }, [answered, index, questions, screen]);

  useEffect(() => {
    if (screen !== "quiz" || !answered) return;
    const last = index >= questions.length - 1;
    const roundOver = timedOut || mistakes >= livesLimit || last;
    const id = window.setTimeout(() => {
      if (roundOver) {
        const finishedMs =
          roundStartRef.current !== null ? Date.now() - roundStartRef.current : 0;
        if (roundStartRef.current !== null) {
          setRoundMs(finishedMs);
        }
        if (!savedRoundRef.current && answers.length > 0) {
          savedRoundRef.current = true;
          const saved = saveRound({
            at: Date.now(),
            correct: answers.filter(isCorrect).length,
            total: answers.length,
            roundMs: finishedMs,
            mode: quizSettings.mode,
            region: quizSettings.region,
            difficulty: quizSettings.difficulty,
            roundSize: questions.length,
            endedBy,
          });
          setHistory(saved.history);
          setBests(saved.bests);
          setIsNewBest(saved.isNewBest);
        }
        setResultTone(endedBy === "complete" ? "success" : "fail");
        setScreen("results");
        return;
      }
      setIndex((prev) => prev + 1);
      setSelectedIso(null);
      setTimedOut(false);
      setRemainingMs(QUESTION_TIME_MS);
    }, ANSWER_PAUSE_MS);
    return () => window.clearTimeout(id);
  }, [
    answered,
    answers,
    endedBy,
    index,
    livesLimit,
    mistakes,
    questions.length,
    quizSettings.difficulty,
    quizSettings.mode,
    quizSettings.region,
    screen,
    timedOut,
  ]);

  function questionTimeMs() {
    const started = questionStartRef.current;
    if (started === null) return QUESTION_TIME_MS;
    return Math.min(QUESTION_TIME_MS, Math.max(0, Date.now() - started));
  }

  function handleSettingsChange(next: QuizSettings) {
    if (next.lang !== quizSettings.lang) {
      localStorage.setItem(LANG_KEY, next.lang);
    }
    setLang(next.lang);
    setSettings({
      mode: next.mode,
      region: next.region,
      difficulty: next.difficulty,
      roundSize: next.roundSize,
    });
  }

  function startRound() {
    const pool = getPool(quizSettings.region, quizSettings.difficulty);
    const round = createRound(pool, quizSettings.roundSize);
    if (round.length === 0) return;
    roundStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    savedRoundRef.current = false;
    setIsNewBest(false);
    setResultTone(null);
    setQuestions(round);
    setIndex(0);
    setSelectedIso(null);
    setTimedOut(false);
    setAnswers([]);
    setRemainingMs(QUESTION_TIME_MS);
    setRoundMs(0);
    setScreen("quiz");
  }

  function selectAnswer(iso: string) {
    if (answered) return;
    const question = questions[index];
    setSelectedIso(iso);
    setAnswers((prev) => [...prev, { question, selectedIso: iso, timeMs: questionTimeMs() }]);
  }

  function goHome() {
    roundStartRef.current = null;
    setScreen("home");
  }

  function handleClearHistory() {
    setHistory(clearHistory());
  }

  function handleClearBests() {
    setBests(clearBests());
  }

  return (
    <div className={`app${resultTone ? ` is-${resultTone}` : ""}`}>
      {screen === "home" && (
        <HomeScreen
          settings={quizSettings}
          history={history}
          bests={bests}
          onChange={handleSettingsChange}
          onStart={startRound}
          onClearHistory={handleClearHistory}
          onClearBests={handleClearBests}
        />
      )}
      {screen === "quiz" && questions[index] && (
        <QuizScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          question={questions[index]}
          index={index}
          total={questions.length}
          selectedIso={selectedIso}
          timedOut={timedOut}
          remainingMs={remainingMs}
          roundMs={roundMs}
          livesLeft={livesLeft}
          maxLives={livesLimit}
          onSelect={selectAnswer}
          onBack={goHome}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          difficulty={quizSettings.difficulty}
          answers={answers}
          roundMs={roundMs}
          endedBy={endedBy}
          isNewBest={isNewBest}
          onAgain={goHome}
        />
      )}
      <p className="credit">{STRINGS[quizSettings.lang].credit}</p>
    </div>
  );
}
