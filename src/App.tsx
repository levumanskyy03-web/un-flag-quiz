"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { HomeScreen, type QuizSettings } from "./components/HomeScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { STRINGS, type Lang } from "./i18n/strings";
import { createRound, getPool, type Question, type RoundAnswer } from "./lib/quiz";

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
  const [answers, setAnswers] = useState<RoundAnswer[]>([]);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };

  useEffect(() => {
    document.documentElement.lang = quizSettings.lang;
    document.title = STRINGS[quizSettings.lang].title;
  }, [quizSettings.lang]);

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
    setQuestions(round);
    setIndex(0);
    setSelectedIso(null);
    setAnswers([]);
    setScreen("quiz");
  }

  function selectAnswer(iso: string) {
    if (selectedIso !== null) return;
    const question = questions[index];
    setSelectedIso(iso);
    setAnswers((prev) => [...prev, { question, selectedIso: iso }]);
  }

  function goNext() {
    if (index >= questions.length - 1) {
      setScreen("results");
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedIso(null);
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
          onSelect={selectAnswer}
          onNext={goNext}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          answers={answers}
          onAgain={() => setScreen("home")}
        />
      )}
    </div>
  );
}
