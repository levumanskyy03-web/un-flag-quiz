"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HomeScreen, type QuizSettings } from "./components/HomeScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { STRINGS, type Lang } from "./i18n/strings";
import {
  QUESTION_TIME_MS,
  createRound,
  getPool,
  type Question,
  type RoundAnswer,
} from "./lib/quiz";

const LANG_KEY = "un-flag-quiz-lang";

type Screen = "home" | "quiz" | "results";

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
  });
  const [screen, setScreen] = useState<Screen>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);
  const [remainingMs, setRemainingMs] = useState(QUESTION_TIME_MS);
  const [roundMs, setRoundMs] = useState(0);
  const roundStartRef = useRef<number | null>(null);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };
  const answered = selectedIso !== null || timedOut;

  useEffect(() => {
    document.documentElement.lang = quizSettings.lang;
    document.title = STRINGS[quizSettings.lang].title;
  }, [quizSettings.lang]);

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
          return [...prev, { question, selectedIso: null }];
        });
        return;
      }
      setRemainingMs(left);
    }, 50);
    return () => window.clearInterval(id);
  }, [answered, index, questions, screen]);

  function handleSettingsChange(next: QuizSettings) {
    if (next.lang !== quizSettings.lang) {
      localStorage.setItem(LANG_KEY, next.lang);
    }
    setLang(next.lang);
    setSettings({
      mode: next.mode,
      region: next.region,
      difficulty: next.difficulty,
    });
  }

  function startRound() {
    const pool = getPool(quizSettings.region, quizSettings.difficulty);
    const round = createRound(pool);
    if (round.length === 0) return;
    roundStartRef.current = Date.now();
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
    setAnswers((prev) => [...prev, { question, selectedIso: iso }]);
  }

  function goNext() {
    if (index >= questions.length - 1) {
      if (roundStartRef.current !== null) {
        setRoundMs(Date.now() - roundStartRef.current);
      }
      setScreen("results");
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedIso(null);
    setTimedOut(false);
    setRemainingMs(QUESTION_TIME_MS);
  }

  function goHome() {
    roundStartRef.current = null;
    setScreen("home");
  }

  return (
    <div className="app">
      {screen === "home" && (
        <HomeScreen
          settings={quizSettings}
          onChange={handleSettingsChange}
          onStart={startRound}
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
          onSelect={selectAnswer}
          onNext={goNext}
          onBack={goHome}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          answers={answers}
          roundMs={roundMs}
          onAgain={goHome}
        />
      )}
    </div>
  );
}
