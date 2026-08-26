"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DuelLobby } from "./components/DuelLobby";
import { DuelResults } from "./components/DuelResults";
import { FactsScreen } from "./components/FactsScreen";
import { FootballScreen } from "./components/FootballScreen";
import { HomeScreen, type QuizSettings } from "./components/HomeScreen";
import { type HubTab } from "./components/HubNav";
import { LearnScreen } from "./components/LearnScreen";
import { MapScreen } from "./components/MapScreen";
import { Level20Screen } from "./components/Level20Screen";
import { LevelsScreen } from "./components/LevelsScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { RecordModal } from "./components/RecordModal";
import { WorldPickScreen, type World } from "./components/WorldPickScreen";
import { FINAL_LEVEL, LEVEL_COUNT, isFinalLevel } from "./data/levels";
import { STRINGS, isLang, langDir, localeTag, type Lang } from "./i18n/strings";
import { clearBests, clearHistory, loadBests, loadHistory, saveRound, type RoundRecord } from "./lib/history";
import { loadLevelClears, saveLevelClear, findLevelClear, isLevelUnlocked, type LevelClear } from "./lib/levelProgress";
import { addPlayMs, bumpFootballLifetime, bumpLifetime, bumpRecordBreaks, countLifetimeSeed, seedLifetimeIfEmpty } from "./lib/lifetime";
import { campaignXpDelta, WORLD_RECORD_XP, xpForAnswers, xpForFreePlay } from "./lib/xp";
import { fetchAccount } from "./lib/account";
import { unlockedAchievementIds } from "./lib/achievements";
import { submitLevelBest, submitRatings } from "./lib/leaderboard";
import {
  answerDuel,
  advanceDuelFact,
  createDuel,
  fetchDuel,
  joinDuel,
  leaveDuel,
  questionFromWire,
  rematchDuel,
} from "./lib/duel";
import type { DuelView } from "./lib/duelTypes";
import { answerKey } from "./lib/quizAnswers";
import {
  answerPauseMs,
  QUESTION_TIME_MS,
  createMixedRound,
  createRound,
  createFootballRound,
  getLevelPool,
  getLearnPool,
  getPool,
  getRegionPool,
  isCorrect,
  footballHasDifficulty,
  isFactsToName,
  isFootballMode,
  isRoundSize,
  livesFor,
  MAX_LIVES,
  modesForMix,
  poolForMode,
  questionLimitMs,
  type PlayPath,
  type Question,
  type QuizMode,
  type RoundAnswer,
} from "./lib/quiz";
import type { FactsDuelConfig } from "./lib/factsRules";

const LANG_KEY = "un-flag-quiz-lang";

type Screen = "home" | "levels" | "level20" | "learn" | "map" | "quiz" | "results" | "duel-lobby" | "duel-results";
type ResultTone = "success" | "fail" | "gold";

function subscribeLang(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY);
  return isLang(stored) ? stored : "ru";
}

function publishRatings(clears: LevelClear[], xp: number, createdAt?: number) {
  return submitRatings(clears, xp, unlockedAchievementIds(loadHistory(), loadBests(), clears, createdAt))
}

export default function App() {
  const storedLang = useSyncExternalStore(subscribeLang, getStoredLang, (): Lang => "ru");
  const [lang, setLang] = useState<Lang | null>(null);
  const [settings, setSettings] = useState<Omit<QuizSettings, "lang">>({
    mode: "flagToName",
    mix: null,
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
  const [world, setWorld] = useState<World | null>(null);
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
  const [earnedXp, setEarnedXp] = useState(0);
  const [worldRecord, setWorldRecord] = useState<{ previousName: string | null } | null>(null);
  const [xp, setXp] = useState(0);
  const [xpReady, setXpReady] = useState(false);
  const [resultTone, setResultTone] = useState<ResultTone | null>(null);
  const [duelCode, setDuelCode] = useState<string | null>(null);
  const [duelView, setDuelView] = useState<DuelView | null>(null);
  const [duelError, setDuelError] = useState<string | null>(null);
  const [duelCopied, setDuelCopied] = useState(false);
  const roundStartRef = useRef<number | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const savedRoundRef = useRef(false);
  const duelIndexRef = useRef(-1);
  const duelPhaseRef = useRef<DuelView["phase"] | null>(null);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };
  const answered = selectedIso !== null || timedOut;
  const isDuel = duelCode !== null;
  const isLearn = quizSettings.path === "learn";
  const livesLimit =
    isFootballMode(quizSettings.mode) && !footballHasDifficulty(quizSettings.mode)
      ? MAX_LIVES
      : livesFor(
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
    document.documentElement.lang = localeTag(quizSettings.lang);
    document.documentElement.dir = langDir(quizSettings.lang);
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
    if (world === "football") {
      document.documentElement.dataset.world = "football";
    } else {
      delete document.documentElement.dataset.world;
    }
    return () => {
      delete document.documentElement.dataset.world;
    };
  }, [world]);

  useEffect(() => {
    const nextHistory = loadHistory();
    const nextClears = loadLevelClears();
    setHistory(nextHistory);
    setBests(loadBests());
    setLevelClears(nextClears);
    setXp(seedLifetimeIfEmpty(countLifetimeSeed(nextHistory, nextClears)).xp);
    setXpReady(true);
    void fetchAccount().then((user) => {
      if (!user) return
      const lifetime = seedLifetimeIfEmpty(countLifetimeSeed(nextHistory, nextClears))
      void publishRatings(nextClears, lifetime.xp, user.createdAt)
    })
  }, []);

  useEffect(() => {
    if (screen !== "quiz" || roundStartRef.current === null || isDuel) return;
    const started = roundStartRef.current;
    const id = window.setInterval(() => {
      setRoundMs(Date.now() - started);
    }, 200);
    return () => window.clearInterval(id);
  }, [screen, isDuel]);

  useEffect(() => {
    if (!isDuel || !duelView) return;
    if (screen !== "quiz" && screen !== "duel-results") return;
    if (duelView.phase === "waiting") return;
    if (duelView.phase === "done") {
      setRoundMs(duelView.roundMs);
      return;
    }
    const origin = Date.now() - duelView.roundMs;
    setRoundMs(duelView.roundMs);
    const id = window.setInterval(() => {
      setRoundMs(Date.now() - origin);
    }, 200);
    return () => window.clearInterval(id);
  }, [isDuel, duelView, screen]);

  useEffect(() => {
    if (!isDuel || !duelView || screen !== "quiz" || duelView.phase !== "question") return;
    const origin = Date.now();
    const start = duelView.remainingMs;
    setRemainingMs(start);
    const id = window.setInterval(() => {
      setRemainingMs(Math.max(0, start - (Date.now() - origin)));
    }, 50);
    return () => window.clearInterval(id);
  }, [isDuel, duelView, screen]);

  useEffect(() => {
    if (screen !== "quiz" || answered || isLearn || isDuel) return;
    if (isFactsToName(currentMode)) return;
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
              const runXp = xpForAnswers(answers, finishedMs, {
                mode: quizSettings.mode,
                path: "levels",
                difficulty: quizSettings.levelHardcore ? "hardcore" : "hard",
                level: quizSettings.level,
                hardcore: quizSettings.levelHardcore,
                livesLimit,
                region: quizSettings.region,
              });
              const previousClear = findLevelClear(
                loadLevelClears(),
                quizSettings.level,
                quizSettings.mode,
              );
              const { award: baseAward, bestXp } = campaignXpDelta(runXp, previousClear);
              void (async () => {
                const record = await submitLevelBest({
                  mode: quizSettings.mode,
                  level: quizSettings.level,
                  hardcore: quizSettings.levelHardcore,
                  roundMs: finishedMs,
                  livesLeft,
                });
                const seed = countLifetimeSeed(loadHistory(), loadLevelClears());
                let award = baseAward;
                if (record.beat) {
                  award += WORLD_RECORD_XP;
                  bumpRecordBreaks(seed);
                  setWorldRecord({ previousName: record.previousName });
                } else {
                  setWorldRecord(null);
                }
                setEarnedXp(award);
                const lifetime = bumpLifetime(true, seed, award, finishedMs);
                setXp(lifetime.xp);
                const nextClears = saveLevelClear({
                  level: quizSettings.level,
                  mode: quizSettings.mode,
                  hardcore: quizSettings.levelHardcore,
                  livesLimit: livesLimit,
                  livesLeft,
                  roundMs: finishedMs,
                  at: Date.now(),
                  xp: bestXp,
                });
                setLevelClears(nextClears);
                void publishRatings(nextClears, lifetime.xp);
                const gold = quizSettings.levelHardcore || record.beat;
                setResultTone(gold ? "gold" : "success");
                setScreen("results");
              })();
              return;
            } else {
              setEarnedXp(0);
              setWorldRecord(null);
              addPlayMs(finishedMs, countLifetimeSeed(loadHistory(), loadLevelClears()));
            }
          } else {
            const footballDifficulty =
              isFootballMode(quizSettings.mode) && !footballHasDifficulty(quizSettings.mode)
                ? "easy"
                : quizSettings.difficulty;
            const gained =
              quizSettings.path === "pool"
                ? xpForFreePlay(answers, footballDifficulty, quizSettings.mode, endedBy)
                : 0;
            setEarnedXp(gained);
            const seed = countLifetimeSeed(loadHistory(), loadLevelClears());
            let lifetime = bumpLifetime(
              endedBy === "complete",
              seed,
              gained,
              finishedMs,
            );
            if (isFootballMode(quizSettings.mode)) {
              lifetime = bumpFootballLifetime(seed, {
                complete: endedBy === "complete",
                perfect: endedBy === "complete" && answers.length > 0 && answers.every(isCorrect),
                playMs: finishedMs,
                mode: quizSettings.mode,
              });
            }
            setXp(lifetime.xp);
            const saved = saveRound({
              at: Date.now(),
              correct: answers.filter(isCorrect).length,
              total: answers.length,
              roundMs: finishedMs,
              mode: quizSettings.mode,
              mix: quizSettings.path === "pool" ? quizSettings.mix ?? undefined : undefined,
              region: isFootballMode(quizSettings.mode) ? "all" : quizSettings.region,
              difficulty: footballDifficulty,
              roundSize: questions.length,
              endedBy,
            });
            setHistory(saved.history);
            setBests(saved.bests);
            setIsNewBest(saved.isNewBest);
            if (gained > 0) {
              void publishRatings(loadLevelClears(), lifetime.xp);
            }
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
    quizSettings.mix,
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
    if (!duelCode || !duelView || duelView.phase !== "question") return;
    if (duelView.youAnswer !== undefined || selectedIso !== null) return;
    if (duelView.remainingMs > 0) return;
    if (isFactsToName(duelView.question?.mode ?? duelView.mode)) return;
    void submitDuelPick(null);
  }, [duelCode, duelView, selectedIso]);

  function applyDuelView(view: DuelView) {
    const prevPhase = duelPhaseRef.current
    const indexChanged = duelIndexRef.current !== view.index
    duelIndexRef.current = view.index
    duelPhaseRef.current = view.phase
    setDuelView(view)
    setDuelCode(view.code)
    setSettings((prev) => ({
      ...prev,
      mode: view.mode,
      region: view.region,
      difficulty: view.difficulty,
      roundSize: isRoundSize(view.roundSize) ? view.roundSize : prev.roundSize,
      path: "pool",
    }))
    if (view.youAnswer !== undefined) {
      setSelectedIso(view.youAnswer)
      setTimedOut(view.youAnswer === null)
    } else if (indexChanged || prevPhase === "done" || prevPhase === "waiting" || view.phase !== "question") {
      setSelectedIso(null)
      setTimedOut(false)
    }
    if (view.phase === "waiting") {
      setScreen("duel-lobby")
      setResultTone(null)
      return
    }
    if (view.phase === "done") {
      setRoundMs(view.roundMs)
      setResultTone(view.youWon === false ? "fail" : "success")
      setScreen("duel-results")
      return
    }
    setRemainingMs(view.remainingMs)
    setRoundMs(view.roundMs)
    setResultTone(null)
    setScreen("quiz")
  }

  function clearDuel() {
    duelIndexRef.current = -1
    duelPhaseRef.current = null
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

  async function handleCreateDuel(modes: QuizMode[], facts?: FactsDuelConfig) {
    setDuelError(null)
    const nextModes = modes.length > 0 ? modes : [quizSettings.mode]
    const result = await createDuel({
      name: await duelName(),
      modes: nextModes,
      region: facts?.region ?? quizSettings.region,
      difficulty: facts ? "hard" : quizSettings.difficulty,
      roundSize: facts ? facts.series : quizSettings.roundSize,
      facts,
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
      mix: next.mix,
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
    const mix = path === "pool" ? quizSettings.mix : null;
    const round = mix
      ? createMixedRound(
          modesForMix(mix),
          getRegionPool(quizSettings.region),
          size,
          (country, mode) => answerKey(country, mode),
          quizSettings.difficulty,
        )
      : createRound(
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
    setEarnedXp(0);
    setWorldRecord(null);
    setResultTone(null);
    setQuestions(round);
    setIndex(0);
    setSelectedIso(null);
    setTimedOut(false);
    setAnswers([]);
    setRemainingMs(questionLimitMs(round[0]?.mode ?? quizSettings.mode, { region: quizSettings.region, path }));
    setRoundMs(0);
    setSettings((prev) => ({ ...prev, path, level, ...extras }));
    setScreen("quiz");
  }

  function startRound() {
    if (world === "football" || isFootballMode(quizSettings.mode)) {
      startFootballRound()
      return
    }
    if (quizSettings.mix) {
      beginRound(getRegionPool(quizSettings.region), quizSettings.roundSize, "pool", quizSettings.level)
      return
    }
    const pool = getPool(quizSettings.region, quizSettings.difficulty, quizSettings.mode);
    beginRound(
      pool,
      isFactsToName(quizSettings.mode) ? 1 : quizSettings.roundSize,
      "pool",
      quizSettings.level,
    );
  }

  function startFootballRound() {
    const mode = isFootballMode(quizSettings.mode) ? quizSettings.mode : "wcWinners"
    const difficulty = footballHasDifficulty(mode) ? quizSettings.difficulty : "easy"
    const round = createFootballRound(mode, quizSettings.roundSize, difficulty)
    if (round.length === 0) return
    roundStartRef.current = Date.now()
    questionStartRef.current = Date.now()
    savedRoundRef.current = false
    setIsNewBest(false)
    setEarnedXp(0)
    setWorldRecord(null)
    setResultTone(null)
    setQuestions(round)
    setIndex(0)
    setSelectedIso(null)
    setTimedOut(false)
    setAnswers([])
    setRemainingMs(
      questionLimitMs(round[0]?.mode ?? mode, { region: quizSettings.region, path: "pool" }),
    )
    setRoundMs(0)
    setSettings((prev) => ({
      ...prev,
      mode,
      mix: null,
      path: "pool",
      region: "all",
      difficulty,
    }))
    setScreen("quiz")
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

  function goHub(tab: HubTab) {
    if (tab === "free") {
      leaveLevels();
      return;
    }
    if (tab === "levels") {
      openLevels();
      return;
    }
    if (tab === "learn") {
      openLearnRegion();
      return;
    }
    setScreen("map");
  }

  function openLevels() {
    setSettings((prev) => ({
      ...prev,
      path: "levels",
      mode: prev.mode === "neighborsToName" || prev.mode === "factsToName" ? "flagToName" : prev.mode,
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
      mode: prev.mode === "neighborsToName" || prev.mode === "factsToName" ? "flagToName" : prev.mode,
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

  async function submitDuelPick(iso: string | null) {
    if (!duelCode) return;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const result = await answerDuel(duelCode, iso);
      if (result.ok) {
        applyDuelView(result.room);
        if (iso === null || result.room.youAnswer !== undefined || result.room.phase === "done") return;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50 + attempt * 40));
    }
    const latest = await fetchDuel(duelCode);
    if (latest.ok) {
      applyDuelView(latest.room);
      if (latest.room.youAnswer !== undefined) return;
    }
    if (iso !== null) setSelectedIso(null);
  }

  async function handleRematch() {
    if (!duelCode) return;
    const result = await rematchDuel(duelCode);
    if (result.ok) applyDuelView(result.room);
  }

  function finishFacts(iso: string | null, timeMs: number) {
    if (duelCode) return;
    if (answered) return;
    const question = questions[index];
    if (!question) return;
    setSelectedIso(iso);
    setTimedOut(iso === null);
    setAnswers((prev) => (prev.length > index ? prev : [...prev, { question, selectedIso: iso, timeMs }]));
  }

  async function handleAdvanceFact() {
    if (!duelCode) return;
    const result = await advanceDuelFact(duelCode);
    if (result.ok) applyDuelView(result.room);
  }

  function selectAnswer(iso: string) {
    if (duelCode) {
      if (duelView?.youAnswer !== undefined) return;
      if (duelView && duelView.phase !== "question" && duelView.phase !== "reveal") return;
      setSelectedIso(iso);
      void submitDuelPick(iso);
      return;
    }
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
    if (isDuel) {
      void handleLeaveDuel()
      return
    }
    roundStartRef.current = null;
    if (world === "football") {
      setScreen("home");
      return;
    }
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
    setHistory(clearHistory((item) => isFootballMode(item.mode)));
  }

  function handleClearBests() {
    setBests(clearBests((item) => isFootballMode(item.mode)));
  }

  function handleClearFootballHistory() {
    setHistory(clearHistory((item) => !isFootballMode(item.mode)));
  }

  function handleClearFootballBests() {
    setBests(clearBests((item) => !isFootballMode(item.mode)));
  }

  return (
    <div className={`app${resultTone ? ` is-${resultTone}` : ""}${world === "football" ? " is-football" : ""}`}>
      {world === "geo" ? (
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
      ) : null}
      {world === "football" ? (
        <div className="pitch-marks" aria-hidden="true">
          <span className="pitch-mid" />
          <span className="pitch-circle" />
          <span className="pitch-spot" />
          <span className="pitch-box is-top" />
          <span className="pitch-box is-bottom" />
        </div>
      ) : null}
      {world === null && (
        <WorldPickScreen
          settings={quizSettings}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onChange={handleSettingsChange}
          onPick={(next) => {
            if (next === "football") {
              const mode = isFootballMode(quizSettings.mode) ? quizSettings.mode : "wcWinners"
              handleSettingsChange({
                ...quizSettings,
                mode,
                mix: null,
                path: "pool",
                region: "all",
                difficulty: footballHasDifficulty(mode) ? quizSettings.difficulty : "easy",
              })
            } else if (next === "geo" && isFootballMode(quizSettings.mode)) {
              handleSettingsChange({
                ...quizSettings,
                mode: "flagToName",
                mix: null,
                path: "pool",
              })
            }
            setWorld(next);
            setScreen("home");
          }}
        />
      )}
      {world === "football" && screen === "home" && (
        <FootballScreen
          settings={quizSettings}
          history={history.filter((item) => isFootballMode(item.mode))}
          bests={bests.filter((item) => isFootballMode(item.mode))}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          onChange={handleSettingsChange}
          onStart={startFootballRound}
          onWorlds={() => setWorld(null)}
          onClearHistory={handleClearFootballHistory}
          onClearBests={handleClearFootballBests}
        />
      )}
      {world === "football" && screen === "quiz" && questions[index] && (
        <QuizScreen
          lang={quizSettings.lang}
          mode={currentMode}
          region={quizSettings.region}
          path="pool"
          question={questions[index]}
          index={index}
          total={questions.length}
          selectedIso={selectedIso}
          timedOut={timedOut}
          remainingMs={remainingMs}
          roundMs={roundMs}
          livesLeft={livesLeft}
          maxLives={livesLimit}
          practice={false}
          onSelect={selectAnswer}
          onBack={goBackFromPlay}
        />
      )}
      {world === "football" && screen === "results" && (
        <ResultsScreen
          lang={quizSettings.lang}
          mode={quizSettings.mode}
          hardcore={footballHasDifficulty(quizSettings.mode) && quizSettings.difficulty === "hardcore"}
          answers={answers}
          roundMs={roundMs}
          endedBy={endedBy}
          isNewBest={isNewBest}
          earnedXp={earnedXp}
          totalXp={xp}
          saveNote
          onAgain={playAgain}
          onMenu={goBackFromPlay}
        />
      )}
      {world === "geo" && screen === "home" && (
        <HomeScreen
          settings={quizSettings}
          history={history}
          bests={bests}
          levelClears={levelClears}
          xp={xp}
          xpReady={xpReady}
          duelError={duelError}
          onChange={handleSettingsChange}
          onStart={startRound}
          onCreateDuel={(modes, facts) => void handleCreateDuel(modes, facts)}
          onJoinDuel={(code) => void handleJoinDuel(code)}
          onHub={goHub}
          onWorlds={() => setWorld(null)}
          onClearHistory={handleClearHistory}
          onClearBests={handleClearBests}
        />
      )}
      {world === "geo" && screen === "levels" && (
        <LevelsScreen
          settings={quizSettings}
          levelClears={levelClears}
          history={history}
          bests={bests}
          xp={xp}
          xpReady={xpReady}
          onChange={handleSettingsChange}
          onPlay={playLevel}
          onHub={goHub}
        />
      )}
      {world === "geo" && screen === "level20" && (
        <Level20Screen
          settings={quizSettings}
          levelClears={levelClears}
          onPlay={playFinalLevel}
          onBack={() => setScreen("levels")}
        />
      )}
      {world === "geo" && screen === "learn" && (
        <LearnScreen
          settings={quizSettings}
          onChange={handleSettingsChange}
          onBack={leaveLearn}
          onHub={goHub}
          onPractice={startPractice}
        />
      )}
      {world === "geo" && screen === "map" && (
        <MapScreen
          settings={quizSettings}
          onChange={handleSettingsChange}
          onHub={goHub}
        />
      )}
      {world === "geo" && screen === "duel-lobby" && duelView && (
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
      {world === "geo" && screen === "quiz" && (isDuel ? questionFromWire(duelView?.question ?? null) : questions[index]) && (
        isFactsToName(currentMode) ? (
        <FactsScreen
          lang={quizSettings.lang}
          question={(isDuel ? questionFromWire(duelView?.question ?? null) : questions[index])!}
          index={isDuel && duelView ? duelView.index : index}
          total={isDuel && duelView ? duelView.total : questions.length}
          roundMs={roundMs}
          practice={isLearn && !isDuel}
          selectedIso={isDuel ? duelView?.youAnswer ?? selectedIso : selectedIso}
          finished={answered && !isDuel}
          duel={
            isDuel && duelView
              ? {
                  opponentName: duelView.opponentName ?? STRINGS[quizSettings.lang].duelOpponent,
                  opponentReady: duelView.opponentReady,
                  youScore: duelView.youScore,
                  opponentScore: duelView.opponentScore ?? 0,
                  remainingMs: duelView.remainingMs,
                  factIndex: duelView.factIndex ?? 0,
                  facts: duelView.question?.facts ?? [],
                  maxFacts: duelView.factsMax ?? 10,
                  wrongs: duelView.youWrongs ?? 0,
                  wrongLimit: duelView.factsWrongLimit ?? 3,
                  hardcore: Boolean(duelView.facts?.hardcore),
                  locked: duelView.youAnswer !== undefined,
                }
              : undefined
          }
          onFinish={(iso, timeMs) => finishFacts(iso, timeMs)}
          onGuess={isDuel ? (iso) => void submitDuelPick(iso) : undefined}
          onAdvance={isDuel ? () => void handleAdvanceFact() : undefined}
          onCountryNext={isLearn ? handlePracticeNext : undefined}
          onBack={goBackFromPlay}
        />
        ) : (
        <QuizScreen
          lang={quizSettings.lang}
          mode={currentMode}
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
        )
      )}
      {world === "geo" && screen === "duel-results" && duelView && (
        <DuelResults
          lang={quizSettings.lang}
          room={duelView}
          roundMs={roundMs}
          onRematch={() => void handleRematch()}
          onMenu={() => void handleLeaveDuel()}
        />
      )}
      {world === "geo" && screen === "results" && (
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
          earnedXp={earnedXp}
          totalXp={xp}
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
      {world === "geo" && screen === "results" && worldRecord ? (
        <RecordModal
          lang={quizSettings.lang}
          previousName={worldRecord.previousName}
          bonusXp={WORLD_RECORD_XP}
          onClose={() => setWorldRecord(null)}
        />
      ) : null}
      <nav className="legal-links">
        <a href="/about">{STRINGS[quizSettings.lang].legalAbout}</a>
        <a href="/privacy">{STRINGS[quizSettings.lang].legalPrivacy}</a>
        <a href="/contacts">{STRINGS[quizSettings.lang].legalContacts}</a>
      </nav>
      <p className="credit">{STRINGS[quizSettings.lang].credit}</p>
    </div>
  );
}
