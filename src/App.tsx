"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HomeScreen, type QuizSettings } from "./components/HomeScreen";
import { LearnScreen } from "./components/LearnScreen";
import { MapScreen } from "./components/MapScreen";
import { Level20Screen } from "./components/Level20Screen";
import { LevelsScreen } from "./components/LevelsScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { FINAL_LEVEL, LEVEL_COUNT, isFinalLevel } from "./data/levels";
import { STRINGS, type Lang } from "./i18n/strings";
import { clearBests, clearHistory, loadBests, loadHistory, saveRound, type RoundRecord } from "./lib/history";
import { loadLevelClears, saveLevelClear, isLevelUnlocked, type LevelClear } from "./lib/levelProgress";
import { submitCampaign } from "./lib/leaderboard";
import { answerKey } from "./lib/quizAnswers";
import {
  ANSWER_PAUSE_MS,
  QUESTION_TIME_MS,
  createRound,
  getLevelPool,
  getLearnPool,
  getPool,
  isCorrect,
  livesFor,
  poolForMode,
  questionLimitMs,
  type Question,
  type RoundAnswer,
} from "./lib/quiz";

const LANG_KEY = "un-flag-quiz-lang";

type Screen = "home" | "levels" | "level20" | "learn" | "map" | "quiz" | "results";
type ResultTone = "success" | "fail" | "gold";

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
    path: "pool",
    level: 1,
    levelHardcore: false,
    levelLives: 3,
    levelLearn: false,
    learnFrom: "region",
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
  const [levelClears, setLevelClears] = useState<LevelClear[]>([]);
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
  const isLearn = quizSettings.path === "learn";
  const livesLimit = livesFor(
    quizSettings.path,
    quizSettings.difficulty,
    quizSettings.levelHardcore,
    quizSettings.level,
    quizSettings.levelLives,
  );
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
    setLevelClears(loadLevelClears());
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
    if (screen !== "quiz" || answered || isLearn) return;
    const started = Date.now();
    questionStartRef.current = started;
    const limitMs = questionLimitMs(quizSettings.mode);
    const id = window.setInterval(() => {
      const left = limitMs - (Date.now() - started);
      if (left <= 0) {
        window.clearInterval(id);
        setRemainingMs(0);
        setTimedOut(true);
        setAnswers((prev) => {
          if (prev.length > index) return prev;
          const question = questions[index];
          if (!question) return prev;
          return [...prev, { question, selectedIso: null, timeMs: limitMs }];
        });
        return;
      }
      setRemainingMs(left);
    }, 50);
    return () => window.clearInterval(id);
  }, [answered, index, isLearn, questions, quizSettings.mode, screen]);

  useEffect(() => {
    if (screen !== "quiz" || !answered || isLearn) return;
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
          if (quizSettings.path === "levels") {
            if (endedBy === "complete") {
              const nextClears = saveLevelClear({
                level: quizSettings.level,
                mode: quizSettings.mode,
                hardcore: quizSettings.levelHardcore,
                livesLimit: livesLimit,
                livesLeft,
                roundMs: finishedMs,
                at: Date.now(),
              });
              setLevelClears(nextClears);
              void submitCampaign(nextClears, quizSettings.mode);
            }
          } else {
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
        }
        const gold = endedBy === "complete" && quizSettings.path === "levels" && quizSettings.levelHardcore;
        setResultTone(endedBy !== "complete" ? "fail" : gold ? "gold" : "success");
        setScreen("results");
        return;
      }
      setIndex((prev) => prev + 1);
      setSelectedIso(null);
      setTimedOut(false);
      setRemainingMs(questionLimitMs(quizSettings.mode));
    }, ANSWER_PAUSE_MS);
    return () => window.clearTimeout(id);
  }, [
    answered,
    answers,
    endedBy,
    index,
    isLearn,
    livesLimit,
    mistakes,
    questions.length,
    quizSettings.difficulty,
    quizSettings.level,
    quizSettings.levelHardcore,
    quizSettings.levelLives,
    quizSettings.mode,
    quizSettings.path,
    livesLeft,
    screen,
    timedOut,
  ]);

  function questionTimeMs() {
    const started = questionStartRef.current;
    if (started === null) return 0;
    const elapsed = Math.max(0, Date.now() - started);
    return isLearn ? elapsed : Math.min(questionLimitMs(quizSettings.mode), elapsed);
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
      path: next.path,
      level: next.level,
      levelHardcore: next.levelHardcore,
      levelLives: next.levelLives,
      levelLearn: next.levelLearn,
      learnFrom: next.learnFrom,
    });
  }

  function beginRound(
    pool: ReturnType<typeof getPool>,
    size: number,
    path: QuizSettings["path"],
    level: number,
    extras?: Pick<QuizSettings, "levelHardcore" | "levelLives">,
  ) {
    const round = createRound(
      poolForMode(pool, quizSettings.mode),
      size,
      (country) => answerKey(country, quizSettings.mode),
    );
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
    setRemainingMs(questionLimitMs(quizSettings.mode));
    setRoundMs(0);
    setSettings((prev) => ({ ...prev, path, level, ...extras }));
    setScreen("quiz");
  }

  function startRound() {
    const pool = getPool(quizSettings.region, quizSettings.difficulty);
    beginRound(pool, quizSettings.roundSize, "pool", quizSettings.level);
  }

  function playLevel(level: number) {
    if (quizSettings.levelLearn) {
      openLearnLevel(level);
      return;
    }
    if (!isLevelUnlocked(levelClears, level, quizSettings.mode)) return;
    if (isFinalLevel(level)) {
      setSettings((prev) => ({ ...prev, path: "levels", level: FINAL_LEVEL }));
      setScreen("level20");
      return;
    }
    const pool = getLevelPool(level);
    beginRound(pool, pool.length, "levels", level, {
      levelHardcore: quizSettings.levelHardcore,
      levelLives: quizSettings.levelHardcore ? 1 : 3,
    });
  }

  function playFinalLevel(lives: number) {
    if (!isLevelUnlocked(levelClears, FINAL_LEVEL, quizSettings.mode)) return;
    const pool = getLevelPool(FINAL_LEVEL);
    beginRound(pool, pool.length, "levels", FINAL_LEVEL, {
      levelHardcore: lives === 1,
      levelLives: lives,
    });
  }

  function openLevels() {
    setSettings((prev) => ({
      ...prev,
      path: "levels",
      mode: prev.mode === "neighborsToName" ? "flagToName" : prev.mode,
    }));
    setScreen("levels");
  }

  function leaveLevels() {
    setSettings((prev) => ({ ...prev, path: "pool", levelLearn: false }));
    setScreen("home");
  }

  function openLearnRegion() {
    setSettings((prev) => ({ ...prev, path: "learn", learnFrom: "region", levelLearn: false }));
    setScreen("learn");
  }

  function openLearnLevel(level: number) {
    setSettings((prev) => ({
      ...prev,
      path: "learn",
      learnFrom: "level",
      level,
      levelLearn: true,
      mode: prev.mode === "neighborsToName" ? "flagToName" : prev.mode,
    }));
    setScreen("learn");
  }

  function leaveLearn() {
    roundStartRef.current = null;
    if (quizSettings.learnFrom === "level") {
      setSettings((prev) => ({ ...prev, path: "levels" }));
      setScreen("levels");
      return;
    }
    setSettings((prev) => ({ ...prev, path: "pool" }));
    setScreen("home");
  }

  function startPractice() {
    const pool = getLearnPool(quizSettings.learnFrom, quizSettings.region, quizSettings.level);
    beginRound(pool, pool.length, "learn", quizSettings.level);
  }

  function handlePracticeNext() {
    if (index >= questions.length - 1) {
      const finishedMs =
        roundStartRef.current !== null ? Date.now() - roundStartRef.current : 0;
      if (roundStartRef.current !== null) setRoundMs(finishedMs);
      const wrong = answers.filter((answer) => !isCorrect(answer)).length;
      setResultTone(wrong === 0 ? "success" : null);
      setScreen("results");
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedIso(null);
    setTimedOut(false);
    questionStartRef.current = Date.now();
  }

  function selectAnswer(iso: string) {
    if (answered) return;
    const question = questions[index];
    setSelectedIso(iso);
    setAnswers((prev) => [...prev, { question, selectedIso: iso, timeMs: questionTimeMs() }]);
  }

  function playAgain() {
    if (quizSettings.path === "learn") {
      startPractice();
      return;
    }
    if (quizSettings.path === "levels" && isFinalLevel(quizSettings.level)) {
      playFinalLevel(quizSettings.levelLives);
      return;
    }
    if (quizSettings.path === "levels") {
      playLevel(quizSettings.level);
      return;
    }
    startRound();
  }

  function playNextLevel() {
    playLevel(quizSettings.level + 1);
  }

  function goBackFromPlay() {
    roundStartRef.current = null;
    if (quizSettings.path === "learn") {
      setScreen("learn");
      return;
    }
    if (
      quizSettings.path === "levels" &&
      isFinalLevel(quizSettings.level) &&
      isLevelUnlocked(levelClears, FINAL_LEVEL, quizSettings.mode)
    ) {
      setScreen("level20");
      return;
    }
    setScreen(quizSettings.path === "levels" ? "levels" : "home");
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
          onOpenLevels={openLevels}
          onOpenLearn={openLearnRegion}
          onOpenMap={() => setScreen("map")}
          onClearHistory={handleClearHistory}
          onClearBests={handleClearBests}
        />
      )}
      {screen === "levels" && (
        <LevelsScreen
          settings={quizSettings}
          levelClears={levelClears}
          onChange={handleSettingsChange}
          onPlay={playLevel}
          onBack={leaveLevels}
        />
      )}
      {screen === "level20" && (
        <Level20Screen
          settings={quizSettings}
          levelClears={levelClears}
          onPlay={playFinalLevel}
          onBack={() => setScreen("levels")}
        />
      )}
      {screen === "learn" && (
        <LearnScreen
          settings={quizSettings}
          onChange={handleSettingsChange}
          onBack={leaveLearn}
          onPractice={startPractice}
        />
      )}
      {screen === "map" && (
        <MapScreen
          settings={quizSettings}
          onChange={handleSettingsChange}
          onBack={() => setScreen("home")}
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
          maxLives={isLearn ? 0 : livesLimit}
          practice={isLearn}
          onSelect={selectAnswer}
          onNext={isLearn ? handlePracticeNext : undefined}
          onBack={goBackFromPlay}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          hardcore={
            quizSettings.path === "levels"
              ? quizSettings.levelHardcore
              : quizSettings.difficulty === "hardcore"
          }
          answers={answers}
          roundMs={roundMs}
          endedBy={endedBy}
          isNewBest={isNewBest}
          saveNote={!isLearn}
          menuLabel={isLearn ? STRINGS[quizSettings.lang].backToCards : undefined}
          onAgain={playAgain}
          onNextLevel={
            endedBy === "complete" &&
            quizSettings.path === "levels" &&
            quizSettings.level < LEVEL_COUNT
              ? playNextLevel
              : undefined
          }
          onMenu={goBackFromPlay}
        />
      )}
      <p className="credit">{STRINGS[quizSettings.lang].credit}</p>
    </div>
  );
}
