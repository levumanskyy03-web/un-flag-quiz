"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DuelLobby } from "./components/DuelLobby";
import { DuelResults } from "./components/DuelResults";
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
import { fetchAccount } from "./lib/account";
import { submitCampaign } from "./lib/leaderboard";
import {
  answerDuel,
  createDuel,
  fetchDuel,
  joinDuel,
  leaveDuel,
  questionFromWire,
} from "./lib/duel";
import type { DuelView } from "./lib/duelTypes";
import { answerKey } from "./lib/quizAnswers";
import {
  answerPauseMs,
  QUESTION_TIME_MS,
  createRound,
  getLevelPool,
  getLearnPool,
  getPool,
  isCorrect,
  livesFor,
  poolForMode,
  questionLimitMs,
  type PlayPath,
  type Question,
  type QuizMode,
  type RoundAnswer,
} from "./lib/quiz";

const LANG_KEY = "un-flag-quiz-lang";

type Screen = "home" | "levels" | "level20" | "learn" | "map" | "quiz" | "results" | "duel-lobby" | "duel-results";
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
  const [duelCode, setDuelCode] = useState<string | null>(null);
  const [duelView, setDuelView] = useState<DuelView | null>(null);
  const [duelError, setDuelError] = useState<string | null>(null);
  const [duelCopied, setDuelCopied] = useState(false);
  const roundStartRef = useRef<number | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const savedRoundRef = useRef(false);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };
  const answered = selectedIso !== null || timedOut;
  const isDuel = duelCode !== null;
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
  const currentMode =
    (isDuel ? duelView?.question?.mode : questions[index]?.mode) ?? quizSettings.mode;
  const currentRegion = isDuel && duelView ? duelView.region : quizSettings.region;
  const currentPath: PlayPath = isDuel ? "pool" : quizSettings.path;

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
    if (screen !== "quiz" || roundStartRef.current === null || isDuel) return;
    const started = roundStartRef.current;
    const id = window.setInterval(() => {
      setRoundMs(Date.now() - started);
    }, 200);
    return () => window.clearInterval(id);
  }, [screen]);

  useEffect(() => {
    if (screen !== "quiz" || answered || isLearn || isDuel) return;
    const started = Date.now();
    questionStartRef.current = started;
    const limitMs = questionLimitMs(currentMode, {
      region: currentRegion,
      path: currentPath,
    });
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
  }, [answered, index, isLearn, isDuel, questions, currentMode, currentPath, currentRegion, screen]);

  useEffect(() => {
    if (screen !== "quiz" || !answered || isLearn || isDuel) return;
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
      const nextMode = questions[index + 1]?.mode ?? currentMode;
      setRemainingMs(questionLimitMs(nextMode, { region: currentRegion, path: currentPath }));
    }, answerPauseMs(currentMode));
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
    quizSettings.levelLearn,
    quizSettings.levelLives,
    quizSettings.mode,
    quizSettings.path,
    quizSettings.region,
    currentMode,
    currentPath,
    currentRegion,
    livesLeft,
    screen,
    timedOut,
    isDuel,
  ]);

  useEffect(() => {
    if (!duelCode) return
    let live = true
    const pull = async () => {
      const result = await fetchDuel(duelCode)
      if (!live) return
      if (!result.ok) {
        if (result.error === 'missing') {
          setDuelError(STRINGS[quizSettings.lang].duelNotFound)
          clearDuel()
        }
        return
      }
      applyDuelView(result.room)
    }
    void pull()
    const id = window.setInterval(() => {
      void pull()
    }, 700)
    return () => {
      live = false
      window.clearInterval(id)
    }
  }, [duelCode, quizSettings.lang]);

  useEffect(() => {
    if (!duelView) return
    setSelectedIso(duelView.youAnswer ?? null)
    setTimedOut(duelView.youAnswer === null)
  }, [duelView?.index]);

  useEffect(() => {
    if (!duelCode || !duelView || duelView.phase !== "question") return;
    if (duelView.youAnswer !== undefined || selectedIso !== null) return;
    if (duelView.remainingMs > 0) return;
    void answerDuel(duelCode, null).then((result) => {
      if (result.ok) applyDuelView(result.room);
    });
  }, [duelCode, duelView, selectedIso]);

  function applyDuelView(view: DuelView) {
    setDuelView(view)
    setDuelCode(view.code)
    setSettings((prev) => ({
      ...prev,
      mode: view.mode,
      region: view.region,
      difficulty: view.difficulty,
      roundSize: view.roundSize as QuizSettings["roundSize"],
      path: "pool",
    }))
    if (view.phase === "waiting") {
      setScreen("duel-lobby")
      setResultTone(null)
      return
    }
    if (view.phase === "done") {
      setResultTone(view.youWon === false ? "fail" : "success")
      setScreen("duel-results")
      return
    }
    setRemainingMs(view.remainingMs)
    setRoundMs(view.roundMs)
    setTimedOut(view.youAnswer === null)
    if (view.youAnswer !== undefined) setSelectedIso(view.youAnswer)
    setResultTone(null)
    setScreen("quiz")
  }

  function clearDuel() {
    setDuelCode(null)
    setDuelView(null)
    setDuelCopied(false)
    setScreen("home")
  }

  function duelErrorMessage(error: string) {
    const t = STRINGS[quizSettings.lang]
    if (error === "missing") return t.duelNotFound
    if (error === "full") return t.duelFull
    return t.duelOffline
  }

  async function duelName() {
    const account = await fetchAccount()
    if (account?.name) return account.name
    return quizSettings.lang === "ru" ? "Игрок" : "Player"
  }

  async function handleCreateDuel(modes: QuizMode[]) {
    setDuelError(null)
    const nextModes = modes.length > 0 ? modes : [quizSettings.mode]
    const result = await createDuel({
      name: await duelName(),
      modes: nextModes,
      region: quizSettings.region,
      difficulty: quizSettings.difficulty,
      roundSize: quizSettings.roundSize,
    })
    if (!result.ok) {
      setDuelError(duelErrorMessage(result.error))
      return
    }
    applyDuelView(result.room)
  }

  async function handleJoinDuel(code: string) {
    setDuelError(null)
    const result = await joinDuel(code, await duelName())
    if (!result.ok) {
      setDuelError(duelErrorMessage(result.error))
      return
    }
    applyDuelView(result.room)
  }

  async function handleLeaveDuel() {
    if (duelCode) await leaveDuel(duelCode)
    setDuelError(null)
    clearDuel()
  }

  function questionTimeMs() {
    const started = questionStartRef.current;
    if (started === null) return 0;
    const elapsed = Math.max(0, Date.now() - started);
    return isLearn ? elapsed : Math.min(questionLimitMs(currentMode, { region: currentRegion, path: currentPath }), elapsed);
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
      quizSettings.mode,
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
    setRemainingMs(questionLimitMs(quizSettings.mode, { region: quizSettings.region, path }));
    setRoundMs(0);
    setSettings((prev) => ({ ...prev, path, level, ...extras }));
    setScreen("quiz");
  }

  function startRound() {
    const pool = getPool(quizSettings.region, quizSettings.difficulty, quizSettings.mode);
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
    const pool = getLevelPool(level, quizSettings.mode);
    beginRound(pool, pool.length, "levels", level, {
      levelHardcore: quizSettings.levelHardcore,
      levelLives: quizSettings.levelHardcore ? 1 : 3,
    });
  }

  function playFinalLevel(lives: number) {
    if (!isLevelUnlocked(levelClears, FINAL_LEVEL, quizSettings.mode)) return;
    const pool = getLevelPool(FINAL_LEVEL, quizSettings.mode);
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
    const pool = getLearnPool(
      quizSettings.learnFrom,
      quizSettings.region,
      quizSettings.level,
      quizSettings.mode,
    );
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
    if (duelCode) {
      setSelectedIso(iso);
      void answerDuel(duelCode, iso).then((result) => {
        if (result.ok) applyDuelView(result.room);
      });
      return;
    }
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
    if (isDuel) {
      void handleLeaveDuel()
      return
    }
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
          duelError={duelError}
          onChange={handleSettingsChange}
          onStart={startRound}
          onCreateDuel={(modes) => void handleCreateDuel(modes)}
          onJoinDuel={(code) => void handleJoinDuel(code)}
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
      {screen === "duel-lobby" && duelView && (
        <DuelLobby
          lang={quizSettings.lang}
          room={duelView}
          error={duelError}
          copied={duelCopied}
          onCopy={() => {
            void navigator.clipboard.writeText(duelView.code).then(() => {
              setDuelCopied(true)
              window.setTimeout(() => setDuelCopied(false), 1500)
            })
          }}
          onLeave={() => void handleLeaveDuel()}
        />
      )}
      {screen === "quiz" && (isDuel ? questionFromWire(duelView?.question ?? null) : questions[index]) && (
        <QuizScreen
          lang={quizSettings.lang}
          mode={isDuel && duelView ? duelView.mode : quizSettings.mode}
          region={isDuel && duelView ? duelView.region : quizSettings.region}
          path={isDuel ? "pool" : quizSettings.path}
          question={(isDuel ? questionFromWire(duelView?.question ?? null) : questions[index])!}
          index={isDuel && duelView ? duelView.index : index}
          total={isDuel && duelView ? duelView.total : questions.length}
          selectedIso={selectedIso}
          timedOut={timedOut}
          remainingMs={remainingMs}
          roundMs={roundMs}
          livesLeft={isDuel ? 0 : livesLeft}
          maxLives={isDuel || isLearn ? 0 : livesLimit}
          practice={isLearn && !isDuel}
          duel={
            isDuel && duelView
              ? {
                  opponentName: duelView.opponentName ?? STRINGS[quizSettings.lang].duelOpponent,
                  opponentReady: duelView.opponentReady,
                  opponentAnswer: duelView.opponentAnswer,
                  reveal: duelView.phase === "reveal",
                  youScore: duelView.youScore,
                  opponentScore: duelView.opponentScore ?? 0,
                }
              : undefined
          }
          onSelect={selectAnswer}
          onNext={isLearn ? handlePracticeNext : undefined}
          onBack={goBackFromPlay}
        />
      )}
      {screen === "duel-results" && duelView && (
        <DuelResults lang={quizSettings.lang} room={duelView} onMenu={() => void handleLeaveDuel()} />
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
