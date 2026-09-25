"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultLeadersMode } from "@/components/LeadersScreen";
import { defaultMathMode } from "@/components/MathScreen";
import { defaultAstroMode } from "@/components/AstroScreen";
import { defaultThemeMode } from "@/lib/quiz";
import { AppChrome } from "@/components/AppChrome";
import { type QuizSettings } from "@/components/HomeScreen";
import { geoOpts } from "@/components/ExtrasToggle";
import { type HubTab } from "@/components/HubNav";
import { WorldPickScreen, type World } from "@/components/WorldPickScreen";
import { footballLevelPlayerIds, footballLevelYears } from "@/data/footballLevels";
import { portraitFileForTerm } from "@/data/leaderPortraitFiles";
import { playerById } from "@/data/footballPlayers";
import { termById } from "@/data/leaders";
import { FINAL_LEVEL, isFinalLevel } from "@/data/levels";
import { COUNTRIES } from "@/data/countries";
import { STRINGS, isLang, langDir, localeTag, type Lang } from "@/i18n/strings";
import { SITE_LANG_KEY } from "@/i18n/lang";
import { persistLang } from "@/i18n/persistLang";
import { clearBests, clearHistory, loadBests, loadHistory, saveRound, type RoundRecord } from "@/lib/history";
import { loadLevelClears, saveLevelClear, findLevelClear, isLevelUnlocked, type LevelClear } from "@/lib/levelProgress";
import { addPlayMs, bumpFootballLifetime, bumpLifetime, bumpRecordBreaks, countLifetimeSeed, seedLifetimeIfEmpty } from "@/lib/lifetime";
import { campaignXpDelta, WORLD_RECORD_XP, xpForAnswers, xpForFreePlay } from "@/lib/xp";
import { submitRound } from "@/lib/leaderboard";
import { answerKey } from "@/lib/quizAnswers";
import {
  answerPauseMs,
  isScoredPlayPath,
  shuffle,
  QUESTION_TIME_MS,
  createMixedRound,
  createRound,
  LEADERS_MODES,
  FOOTBALL_MODES,
  campaignLevelCount,
  campaignLevelNumbers,
  createFootballRound,
  createFootballMixedRound,
  createLeadersRound,
  createMathRound,
  createMathLevelRound,
  createMathMixedRound,
  createAstroRound,
  createAstroLevelRound,
  createAstroMixedRound,
  createThemeRound,
  createThemeLevelRound,
  createThemeMixedRound,
  getLevelPool,
  getLearnPool,
  getPool,
  getRegionPool,
  isCorrect,
  footballHasDifficulty,
  footballPoolSize,
  isFactsToName,
  isFootballMode,
  isLeaderPhotoMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isThemeMode,
  isThemeWorld,
  themeWorldOf,
  mathHasCampaign,
  astroHasCampaign,
  themeHasCampaign,
  isManagerFootballMode,
  isPlayerFactsToName,
  isPlayerFootballMode,
  isPlayerPhotoMode,
  isRankingMode,
  isWaterMode,
  hasGeoFinale,
  livesFor,
  MAX_LIVES,
  modesForFootballMix,
  modesForMathMix,
  modesForAstroMix,
  modesForThemeMix,
  THEME_DEFAULT_MODE,
  modesForMix,
  poolForMode,
  questionLimitMs,
  worldOfMode,
  type PlayPath,
  type Question,
  type RoundAnswer,
  type RoundEnd,
} from "@/lib/quiz";
import { encodePlayHash, parsePlayHash } from "@/lib/playHash";
import { bumpTrainerComplete, clearMistakes, loadMistakes, recordMistakes, clearCorrected, type MistakeEntry } from "@/lib/mistakes";
import { awardRoundStamps, loadStamps, subscribeStamps, type StampAlbum } from "@/lib/stamps";
import { unlockedAchievementIds } from "@/lib/achievements";
import { playSfx } from "@/lib/sfx";
import { softNav } from "@/lib/softNav";
import { prefetchWikiPortraits } from "@/lib/wikiThumb";
import { collectionById, dailyPlayHref, type Collection } from "@/data/collections";
import { dailyCollection, dailyPickIds, saveDailyComplete } from "@/lib/dailyChallenge";
import { FootballPlay } from "./FootballPlay";
import { GeoPlay } from "./GeoPlay";
import { LeadersPlay } from "./LeadersPlay";
import { MathPlay } from "./MathPlay";
import { AstroPlay } from "./AstroPlay";
import { ThemePlay } from "./ThemePlay";
import { MultiplayerPlay } from "./MultiplayerPlay";
import { ProfilePlay } from "./ProfilePlay";
import { StudioPlay } from "./StudioPlay";
import { EmpirePlay } from "./EmpirePlay";
import { empireAccess, empireBuyPower, empireClaimAchievements, empireOnRound, empireStartMistakes, empireSyncAlbum, empireTimeBonusMs, empireXpMultiplier, startEmpireLoop, stopEmpireLoop } from "@/lib/empireStore";
import type { EmpireRoundReward } from "@/lib/empire/rules";
import { listGateOf } from "@/lib/empire/gates";

type Screen = "home" | "levels" | "level20" | "learn" | "map" | "quiz" | "results" | "mistakes" | "album" | "lists";
type ResultTone = "success" | "fail" | "gold";
type Hub = World | "multiplayer" | "studio" | "empire" | "profile";

function isMetaHub(hub: Hub | null | undefined): hub is "multiplayer" | "studio" | "empire" | "profile" {
  return (
    hub === "multiplayer" || hub === "studio" || hub === "empire" || hub === "profile"
  );
}

function questionMs(
  mode: Question["mode"] | QuizSettings["mode"],
  path: PlayPath,
  region: QuizSettings["region"],
) {
  const quizMode = mode ?? "flagToName";
  let ms = questionLimitMs(quizMode, { region, path });
  ms += empireTimeBonusMs(worldOfMode(quizMode));
  return ms;
}

const SKIP_ISO = "__skip__";

function choiceKeys(question: Question): { all: string[]; correct: string } {
  if (question.yearOptions && question.yearOptions.length > 0) {
    return { all: question.yearOptions.map(String), correct: String(question.year ?? "") };
  }
  if (question.waterOptions && question.waterOptions.length > 0 && question.waterId) {
    return { all: question.waterOptions, correct: question.waterId };
  }
  return { all: question.options.map((item) => item.iso), correct: question.country.iso };
}

export function worldFromPath(pathname: string): World | null {
  if (pathname === "/football" || pathname.startsWith("/football/")) return "football";
  if (pathname === "/codes" || pathname.startsWith("/codes/")) return "geo";
  if (pathname === "/leaders" || pathname.startsWith("/leaders/")) return "leaders";
  if (pathname === "/math" || pathname.startsWith("/math/")) return "math";
  if (pathname === "/astronomy" || pathname.startsWith("/astronomy/")) return "astronomy";
  if (pathname === "/biology" || pathname.startsWith("/biology/")) return "biology";
  if (pathname === "/olympics" || pathname.startsWith("/olympics/")) return "olympics";
  if (pathname === "/cs" || pathname.startsWith("/cs/")) return "cs";
  if (pathname === "/food" || pathname.startsWith("/food/")) return "food";
  if (pathname === "/geo" || pathname.startsWith("/geo/")) return "geo";
  return null;
}

export function hubFromPath(pathname: string): Hub | null {
  if (pathname === "/multiplayer" || pathname.startsWith("/multiplayer/")) return "multiplayer";
  if (pathname === "/profile" || pathname.startsWith("/profile/")) return "profile";
  if (pathname === "/studio" || pathname.startsWith("/studio/")) return "studio";
  if (pathname === "/empire" || pathname.startsWith("/empire/")) return "empire";
  return worldFromPath(pathname);
}

export function worldHref(world: World): string {
  return `/${world}`;
}

function syncWorldAttr(next: World | null) {
  if (next === "football") {
    document.documentElement.dataset.world = "football";
  } else if (next === "leaders") {
    document.documentElement.dataset.world = "leaders";
  } else if (next === "math") {
    document.documentElement.dataset.world = "math";
  } else if (next === "astronomy") {
    document.documentElement.dataset.world = "astronomy";
  } else if (next && isThemeWorld(next)) {
    document.documentElement.dataset.world = next;
  } else {
    delete document.documentElement.dataset.world;
  }
}

function subscribeLang(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getStoredLang(): Lang {
  const stored = localStorage.getItem(SITE_LANG_KEY);
  return isLang(stored) ? stored : "ru";
}

export default function PlayApp() {
  const router = useRouter();
  const pathname = usePathname();
  const pathHub = hubFromPath(pathname);
  const [worldNav, setWorldNav] = useState<Hub | null | undefined>(undefined);
  const hub = worldNav !== undefined ? worldNav : pathHub;
  const world: World | null = isMetaHub(hub) ? null : hub;
  const storedLang = useSyncExternalStore(subscribeLang, getStoredLang, (): Lang => "ru");
  const [lang, setLang] = useState<Lang | null>(null);
  const [settings, setSettings] = useState<Omit<QuizSettings, "lang">>({
    mode: "flagToName",
    mix: null,
    mixModes: [],
    region: "all",
    difficulty: "easy",
    roundSize: 10,
    path: "levels",
    level: 1,
    levelHardcore: false,
    levelLives: 3,
    levelLearn: false,
    learnFrom: "region",
    includeExtras: false,
    includeEraStates: false,
    eraYear: new Date().getFullYear(),
  });
  const [screen, setScreenState] = useState<Screen>("levels");
  const screenRef = useRef(screen);
  screenRef.current = screen;

  function setScreen(next: Screen) {
    if (screenRef.current === next) return;
    softNav(() => {
      screenRef.current = next;
      setScreenState(next);
    });
  }
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
  const [empireReward, setEmpireReward] = useState<EmpireRoundReward | null>(null);
  const [extraLifeBought, setExtraLifeBought] = useState(false);
  const [hintHidden, setHintHidden] = useState<Record<number, string[]>>({});
  const [worldRecord, setWorldRecord] = useState<{ previousName: string | null } | null>(null);
  const [xp, setXp] = useState(0);
  const [xpReady, setXpReady] = useState(false);
  const [resultTone, setResultTone] = useState<ResultTone | null>(null);
  const [stamps, setStamps] = useState<StampAlbum>({});
  const [mistakeList, setMistakeList] = useState<MistakeEntry[]>([]);
  const roundStartRef = useRef<number | null>(null);
  const collectionRef = useRef<Collection | null>(null);
  const questionStartRef = useRef<number | null>(null);
  const savedRoundRef = useRef(false);

  const quizSettings: QuizSettings = {
    ...settings,
    lang: lang ?? storedLang,
  };
  const answered = selectedIso !== null || timedOut;
  const isLearn = quizSettings.path === "learn";
  const isPractice = isLearn || quizSettings.path === "mistakes";
  const livesLimit =
    (isFootballMode(quizSettings.mode) && !footballHasDifficulty(quizSettings.mode)
      ? MAX_LIVES
      : livesFor(
          quizSettings.path,
          quizSettings.difficulty,
          quizSettings.levelHardcore,
          quizSettings.level,
          quizSettings.levelLives,
          quizSettings.mode,
        )) + (extraLifeBought ? 1 : 0);
  const mistakes = answers.filter((answer) => !isCorrect(answer) && !answer.skipped).length;
  const livesLeft = Math.max(0, livesLimit - mistakes);
  const endedBy: RoundEnd = timedOut ? "timeout" : mistakes >= livesLimit ? "lives" : "complete";
  const currentMode = questions[index]?.mode ?? quizSettings.mode;
  const currentRegion = quizSettings.region;
  const currentPath: PlayPath = quizSettings.path;

  useEffect(() => {
    document.documentElement.lang = localeTag(quizSettings.lang);
    document.documentElement.dir = langDir(quizSettings.lang);
    document.title =
      hub === "multiplayer"
        ? STRINGS[quizSettings.lang].multiplayer
        : hub === "profile"
          ? STRINGS[quizSettings.lang].profile
        : hub === "studio"
          ? STRINGS[quizSettings.lang].studio
          : hub === "empire"
              ? STRINGS[quizSettings.lang].empire
            : STRINGS[quizSettings.lang].title;
  }, [quizSettings.lang, hub]);

  useEffect(() => {
    if (resultTone) {
      document.documentElement.dataset.result = resultTone;
    } else {
      delete document.documentElement.dataset.result;
    }
  }, [resultTone]);

  useEffect(() => {
    setWorldNav(undefined);
  }, [pathname]);

  useEffect(() => {
    startEmpireLoop();
    return () => {
      stopEmpireLoop();
    };
  }, []);

  useEffect(() => {
    syncWorldAttr(world);
    return () => {
      delete document.documentElement.dataset.world;
    };
  }, [world]);

  useEffect(() => {
    if (settings.path === "daily" || settings.path === "list") return;
    if (typeof window !== "undefined") {
      const pending = new URLSearchParams(window.location.search);
      if (pending.get("daily") || pending.get("list")) return;
    }
    if (world === "football" && !isFootballMode(settings.mode)) {
      const mode = "playerPhotoToName" as const;
      const difficulty =
        settings.difficulty === "hardcore" || settings.difficulty === "medium" ? "hard" : settings.difficulty
      setSettings((prev) => ({
        ...prev,
        mode,
        mix: null,
        path: "levels",
        region: "all",
        difficulty,
        levelHardcore: prev.levelHardcore || prev.difficulty === "hardcore",
      }));
    } else if (world === "leaders" && !isLeadersMode(settings.mode)) {
      setSettings((prev) => ({
        ...prev,
        mode: defaultLeadersMode(prev.mode),
        mix: null,
        path: "levels",
        region: "all",
      }));
    } else if (world === "math" && !isMathMode(settings.mode)) {
      setSettings((prev) => ({
        ...prev,
        mode: defaultMathMode(prev.mode),
        mix: null,
        path: "levels",
        region: "all",
      }));
    } else if (world === "astronomy" && !isAstroMode(settings.mode)) {
      setSettings((prev) => ({
        ...prev,
        mode: defaultAstroMode(prev.mode),
        mix: null,
        path: "levels",
        region: "all",
      }));
    } else if (world && isThemeWorld(world) && (!isThemeMode(settings.mode) || worldOfMode(settings.mode) !== world)) {
      setSettings((prev) => ({
        ...prev,
        mode: defaultThemeMode(world, prev.mode),
        mix: null,
        path: "levels",
        region: "all",
      }));
    } else if (
      world === "geo" &&
      (isFootballMode(settings.mode) || isLeadersMode(settings.mode) || isMathMode(settings.mode) || isAstroMode(settings.mode) || isThemeMode(settings.mode))
    ) {
      setSettings((prev) => ({
        ...prev,
        mode: "flagToName",
        mix: null,
        path: "levels",
        difficulty: prev.difficulty === "medium" || prev.difficulty === "hardcore" ? "hard" : prev.difficulty,
        levelHardcore: prev.levelHardcore || prev.difficulty === "hardcore",
      }));
    }
  }, [world, settings.mode, settings.difficulty, settings.path]);

  useEffect(() => {
    function applyHash() {
      if (screenRef.current === "quiz" || screenRef.current === "results") return;
      const parsed = parsePlayHash(window.location.hash);
      if (!parsed) return;
      const pathWorld = worldFromPath(window.location.pathname);
      if (!parsed.mix) {
        const want = worldOfMode(parsed.mode);
        if (pathWorld !== want) {
          window.history.replaceState(null, "", `/${want}#${parsed.mode}`);
          setWorldNav(want);
          return;
        }
        setSettings((prev) =>
          prev.mode === parsed.mode && prev.mix === null
            ? prev
            : {
                ...prev,
                mode: parsed.mode,
                mix: null,
                mixModes: [],
                ...(isFactsToName(parsed.mode) ? { path: "pool" as const } : {}),
              },
        );
        if (isFactsToName(parsed.mode)) setScreen("home");
        return;
      }
      if (parsed.mix === "custom") {
        const want = worldOfMode(parsed.mixModes[0] ?? parsed.mode);
        const hash = encodePlayHash(parsed);
        if (pathWorld !== want) {
          window.history.replaceState(null, "", `/${want}#${hash}`);
          setWorldNav(want);
          return;
        }
        const mixModes = parsed.mixModes.filter((item) => worldOfMode(item) === want);
        setSettings((prev) => ({
          ...prev,
          mode: mixModes[0] ?? parsed.mode,
          mix: "custom",
          mixModes,
          path: "pool",
        }));
        setScreen("home");
        return;
      }
      setSettings((prev) => ({
        ...prev,
        mix: parsed.mix,
        mixModes: [],
        path: "pool",
      }));
      setScreen("home");
    }

    applyHash();
    const frame = window.requestAnimationFrame(applyHash);
    window.addEventListener("hashchange", applyHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", applyHash);
    };
  }, [pathname]);

  useEffect(() => {
    const nextHistory = loadHistory();
    const nextClears = loadLevelClears();
    setHistory(nextHistory);
    setBests(loadBests());
    setLevelClears(nextClears);
    setStamps(loadStamps());
    const unsubStamps = subscribeStamps(() => setStamps(loadStamps()));
    setMistakeList(loadMistakes());
    setXp(seedLifetimeIfEmpty(countLifetimeSeed(nextHistory, nextClears)).xp);
    setXpReady(true);
    return unsubStamps
  }, []);

  useEffect(() => {
    const titles: Array<{ title: string; file?: string }> = [];
    const add = (question: Question | null | undefined) => {
      if (!question) return;
      const mode = question.mode ?? quizSettings.mode;
      if (!isLeaderPhotoMode(mode) && !isPlayerPhotoMode(mode)) return;
      const player = playerById(question.country.iso);
      const term = termById(question.country.iso);
      const wiki = term?.wiki ?? player?.wiki;
      if (wiki) titles.push({ title: wiki, file: player?.wikiFile ?? (term ? portraitFileForTerm(term.id) : undefined) });
    };
    for (const question of questions) add(question);
    if (titles.length > 0) prefetchWikiPortraits(titles);
  }, [questions, quizSettings.mode]);

  useEffect(() => {
    if (screen !== "quiz" || answered || isPractice) return;
    if (isFactsToName(currentMode)) return;
    const started = Date.now();
    questionStartRef.current = started;
    const limitMs = questionMs(currentMode, currentPath, currentRegion);
    setRemainingMs(limitMs);
    const id = window.setTimeout(() => {
      setRemainingMs(0);
      setTimedOut(true);
      playSfx("wrong");
      setAnswers((prev) => {
        if (prev.length > index) return prev;
        const question = questions[index];
        if (!question) return prev;
        return [...prev, { question, selectedIso: null, timeMs: limitMs }];
      });
    }, limitMs);
    return () => window.clearTimeout(id);
  }, [answered, index, isPractice, questions, currentMode, currentPath, currentRegion, screen]);

  useEffect(() => {
    if (screen !== "quiz" || !answered || isPractice) return;
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
                const record = await submitRound({
                  path: "levels",
                  mode: quizSettings.mode,
                  questions: answers.length,
                  correct: answers.filter(isCorrect).length,
                  roundMs: finishedMs,
                  level: quizSettings.level,
                  hardcore: quizSettings.levelHardcore,
                  livesLeft,
                  livesLimit,
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
                const lifetime = bumpLifetime(true, seed, award, finishedMs, worldOfMode(quizSettings.mode));
                setEmpireReward(empireOnRound({
                  world: worldOfMode(quizSettings.mode),
                  path: "levels",
                  endedBy: "complete",
                  correct: answers.filter(isCorrect).length,
                  total: answers.length,
                  difficulty: quizSettings.levelHardcore ? "hardcore" : "hard",
                  hardcore: quizSettings.levelHardcore,
                  perfect: answers.length > 0 && answers.every(isCorrect),
                  deltaXp: baseAward,
                  worldRecord: Boolean(record.beat),
                }, {
                  mode: quizSettings.mode,
                  roundMs: finishedMs,
                  level: quizSettings.level,
                  livesLeft,
                  livesLimit,
                }));
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
                rememberRound(answers);
                const gold = quizSettings.levelHardcore || record.beat;
                setResultTone(gold ? "gold" : "success");
                playSfx(record.beat || !previousClear || baseAward > 0 ? "record" : "success");
                setScreen("results");
              })();
              return;
            } else {
              setEarnedXp(0);
              setWorldRecord(null);
              addPlayMs(finishedMs, countLifetimeSeed(loadHistory(), loadLevelClears()));
              setEmpireReward(empireOnRound({
                world: worldOfMode(quizSettings.mode),
                path: "levels",
                endedBy,
                correct: answers.filter(isCorrect).length,
                total: answers.length,
                difficulty: quizSettings.levelHardcore ? "hardcore" : "hard",
                hardcore: quizSettings.levelHardcore,
                perfect: false,
              }, { mode: quizSettings.mode, roundMs: finishedMs }));
            }
          } else {
            const footballDifficulty =
              isFootballMode(quizSettings.mode) && !footballHasDifficulty(quizSettings.mode)
                ? "easy"
                : quizSettings.difficulty;
            let gained =
              isScoredPlayPath(quizSettings.path)
                ? xpForFreePlay(answers, footballDifficulty, quizSettings.mode, endedBy)
                : 0;
            if (gained > 0) gained = Math.round(gained * empireXpMultiplier());
            setEarnedXp(gained);
            const seed = countLifetimeSeed(loadHistory(), loadLevelClears());
            let lifetime = bumpLifetime(
              endedBy === "complete",
              seed,
              gained,
              finishedMs,
              worldOfMode(quizSettings.mode),
            );
            setEmpireReward(empireOnRound({
              world: worldOfMode(quizSettings.mode),
              path: quizSettings.path,
              endedBy,
              correct: answers.filter(isCorrect).length,
              total: answers.length,
              difficulty: footballDifficulty,
              perfect: endedBy === "complete" && answers.length > 0 && answers.every(isCorrect),
            }, {
              mode: quizSettings.mode,
              roundMs: finishedMs,
              listId: quizSettings.path === "list" ? collectionRef.current?.id : undefined,
            }));
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
              mixModes:
                quizSettings.path === "pool" && quizSettings.mix === "custom" ? quizSettings.mixModes : undefined,
              region: isFootballMode(quizSettings.mode) || isLeadersMode(quizSettings.mode) || isMathMode(quizSettings.mode) || isAstroMode(quizSettings.mode) || isThemeMode(quizSettings.mode) ? "all" : quizSettings.region,
              difficulty: footballDifficulty === "hardcore" ? "hard" : footballDifficulty,
              roundSize: questions.length,
              endedBy,
              hardcore: quizSettings.levelHardcore || quizSettings.difficulty === "hardcore",
              includeExtras:
                quizSettings.path === "pool" && !isFootballMode(quizSettings.mode) && !isLeadersMode(quizSettings.mode) && !isMathMode(quizSettings.mode) && !isAstroMode(quizSettings.mode) && !isThemeMode(quizSettings.mode)
                  ? quizSettings.includeExtras
                  : undefined,
            });
            setHistory(saved.history);
            setBests(saved.bests);
            setIsNewBest(saved.isNewBest);
            empireClaimAchievements(unlockedAchievementIds(saved.history, saved.bests, loadLevelClears()));
            if (quizSettings.path === "daily" && collectionRef.current && world) {
              saveDailyComplete({
                world: collectionRef.current.world,
                id: collectionRef.current.id,
                correct: answers.filter(isCorrect).length,
                total: answers.length,
              });
            }
            rememberRound(answers);
            if (gained > 0) {
              void submitRound({
                path: "pool",
                mode: quizSettings.mode,
                questions: answers.length,
                correct: answers.filter(isCorrect).length,
                roundMs: finishedMs,
                difficulty: footballDifficulty,
                endedBy,
              });
            }
            playSfx(saved.isNewBest ? "record" : endedBy === "complete" ? "success" : "fail");
          }
        }
        if (quizSettings.path === "levels" && endedBy !== "complete") {
          playSfx("fail");
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
      setRemainingMs(questionMs(nextMode, currentPath, currentRegion));
    }, answerPauseMs(currentMode));
    return () => window.clearTimeout(id);
  }, [
    answered,
    answers,
    endedBy,
    index,
    isPractice,
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
  ]);

  function questionTimeMs() {
    const started = questionStartRef.current;
    if (started === null) return 0;
    const elapsed = Math.max(0, Date.now() - started);
    return isPractice ? elapsed : Math.min(questionMs(currentMode, currentPath, currentRegion), elapsed);
  }

  function rememberRound(roundAnswers: RoundAnswer[]) {
    setStamps(
      awardRoundStamps(roundAnswers, {
        path: quizSettings.path,
        modeFallback: quizSettings.mode,
        difficulty:
          quizSettings.path === "levels"
            ? "hard"
            : quizSettings.difficulty === "hardcore"
              ? "hard"
              : quizSettings.difficulty,
        hardcore: quizSettings.levelHardcore || quizSettings.difficulty === "hardcore",
        endedBy,
      }),
    );
    const wrong = roundAnswers
      .filter((answer) => !isCorrect(answer))
      .map((answer) => ({
        iso: answer.question.country.iso,
        mode: answer.question.mode ?? quizSettings.mode,
        year: answer.question.year,
      }));
    const right = roundAnswers
      .filter(isCorrect)
      .map((answer) => ({
        iso: answer.question.country.iso,
        mode: answer.question.mode ?? quizSettings.mode,
        year: answer.question.year,
      }));
    if (wrong.length > 0) recordMistakes(wrong);
    if (right.length > 0) clearCorrected(right);
    setMistakeList(loadMistakes());
    empireSyncAlbum();
  }

  function handleSettingsChange(next: QuizSettings) {
    if (next.lang !== quizSettings.lang) {
      persistLang(next.lang);
    }
    setLang(next.lang);
    setSettings({
      mode: isRankingMode(next.mode) ? "flagToName" : next.mode,
      mix: next.mix,
      mixModes: next.mixModes,
      region: next.region,
      difficulty: next.difficulty,
      roundSize: next.roundSize,
      path: next.path,
      level: next.level,
      levelHardcore: next.levelHardcore,
      levelLives: next.levelLives,
      levelLearn: next.levelLearn,
      learnFrom: next.learnFrom,
      includeExtras: next.includeExtras,
      includeEraStates: next.includeEraStates,
      eraYear: next.eraYear,
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
          modesForMix(mix, "geo", quizSettings.mixModes),
          getRegionPool(quizSettings.region, geoOpts(quizSettings)),
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
    setEmpireReward(null);
    setExtraLifeBought(false);
    setHintHidden({});
    setWorldRecord(null);
    setResultTone(null);
    setQuestions(round);
    setIndex(0);
    setSelectedIso(null);
    setTimedOut(false);
    setAnswers([]);
    setRemainingMs(questionMs(round[0]?.mode ?? quizSettings.mode, path, quizSettings.region));
    setRoundMs(0);
    setSettings((prev) => ({ ...prev, path, level, ...extras }));
    setScreen("quiz");
  }

  function poolDifficultyLocked() {
    if (quizSettings.levelHardcore || quizSettings.difficulty === "hardcore") {
      return empireAccess({ kind: "difficulty", difficulty: "hardcore" }) === "locked";
    }
    return quizSettings.difficulty === "hard" && empireAccess({ kind: "difficulty", difficulty: "hard" }) === "locked";
  }

  function startRound() {
    if (poolDifficultyLocked()) return;
    if (isRankingMode(quizSettings.mode)) {
      setSettings((prev) => ({ ...prev, mode: "flagToName" }));
      return;
    }
    if (world === "leaders" || isLeadersMode(quizSettings.mode)) {
      startLeadersRound();
      return;
    }
    if (world === "math" || isMathMode(quizSettings.mode)) {
      startMathRound();
      return;
    }
    if (world === "astronomy" || isAstroMode(quizSettings.mode)) {
      startAstroRound();
      return;
    }
    if ((world && isThemeWorld(world)) || isThemeMode(quizSettings.mode)) {
      startThemeRound();
      return;
    }
    if (world === "football" || isFootballMode(quizSettings.mode)) {
      startFootballRound();
      return;
    }
    if (quizSettings.mix) {
      beginRound(getRegionPool(quizSettings.region, geoOpts(quizSettings)), quizSettings.roundSize, "pool", quizSettings.level)
      return
    }
    const pool = getPool(quizSettings.region, quizSettings.difficulty, quizSettings.mode, geoOpts(quizSettings));
    beginRound(
      pool,
      isFactsToName(quizSettings.mode) ? 1 : quizSettings.roundSize,
      "pool",
      quizSettings.level,
    );
  }

  function startFootballRound(path: PlayPath = "pool", level = quizSettings.level, years?: number[], playerIds?: string[]) {
    const mix = path === "levels" ? null : quizSettings.mix;
    const difficulty = quizSettings.difficulty;
    if (mix) {
      const modes = modesForFootballMix(mix, quizSettings.mixModes);
      const round = createFootballMixedRound(modes, years ? years.length : quizSettings.roundSize, difficulty);
      if (round.length === 0) return;
      beginPreparedRound(round, path, level, {
        mode: modes[0],
        mix,
        region: "all",
        difficulty,
      });
      return;
    }
    const mode = isFootballMode(quizSettings.mode) ? quizSettings.mode : "playerPhotoToName";
    const facts = isPlayerFactsToName(mode);
    const count =
      facts && path === "pool"
        ? 1
        : playerIds?.length
          ? playerIds.length
          : years
            ? years.length
            : facts && (path === "learn" || path === "mistakes")
              ? footballPoolSize(mode, difficulty)
              : quizSettings.roundSize;
    const round = createFootballRound(mode, count, difficulty, years, undefined, playerIds);
    if (round.length === 0) return;
    beginPreparedRound(round, path, level, {
      mode,
      mix: null,
      region: "all",
      difficulty,
    });
  }

  function startLeadersRound(path: PlayPath = "pool", isos?: string[], level = quizSettings.level) {
    const mode = defaultLeadersMode(quizSettings.mode);
    const round = createLeadersRound(
      mode,
      isos ? isos.length : quizSettings.roundSize,
      path === "pool" ? quizSettings.difficulty : undefined,
      isos,
    );
    if (round.length === 0) return;
    beginPreparedRound(round, path, level, {
      mode,
      mix: null,
      region: "all",
    });
  }

  function startMathRound(path: PlayPath = "pool", isos?: string[], level = quizSettings.level) {
    const mix = path === "levels" ? null : quizSettings.mix;
    if (mix) {
      const modes = modesForMathMix(mix, quizSettings.mixModes);
      const round = createMathMixedRound(modes, isos ? isos.length : quizSettings.roundSize, quizSettings.difficulty);
      if (round.length === 0) return;
      beginPreparedRound(round, path, level, {
        mode: modes[0] ?? "exprToValue",
        mix,
        region: "all",
      });
      return;
    }
    const mode = defaultMathMode(quizSettings.mode);
    if (!isMathMode(mode)) return;
    const round = createMathRound(
      mode,
      isos ? isos.length : quizSettings.roundSize,
      path === "pool" ? quizSettings.difficulty : undefined,
      isos,
    );
    if (round.length === 0) return;
    beginPreparedRound(round, path, level, {
      mode,
      mix: null,
      region: "all",
    });
  }

  function startAstroRound(path: PlayPath = "pool", isos?: string[], level = quizSettings.level) {
    const mix = path === "levels" ? null : quizSettings.mix;
    if (mix) {
      const modes = modesForAstroMix(mix, quizSettings.mixModes);
      const round = createAstroMixedRound(modes, isos ? isos.length : quizSettings.roundSize, quizSettings.difficulty);
      if (round.length === 0) return;
      beginPreparedRound(round, path, level, {
        mode: modes[0] ?? "planetToOrder",
        mix,
        region: "all",
      });
      return;
    }
    const mode = defaultAstroMode(quizSettings.mode);
    if (!isAstroMode(mode)) return;
    const round = createAstroRound(
      mode,
      isos ? isos.length : quizSettings.roundSize,
      path === "pool" ? quizSettings.difficulty : undefined,
      isos,
    );
    if (round.length === 0) return;
    beginPreparedRound(round, path, level, {
      mode,
      mix: null,
      region: "all",
    });
  }

  function startCollectionRound(collection: Collection, path: "list" | "daily") {
    if (path === "list") {
      const gate = listGateOf(collection.world, collection.id);
      if (gate && empireAccess(gate) === "locked") return;
    }
    collectionRef.current = collection;
    const picked =
      path === "daily"
        ? dailyPickIds(collection)
        : shuffle([...collection.ids]).slice(0, Math.min(10, collection.ids.length));
    const mode = collection.mode;
    const count = picked.length;
    let round: Question[] = [];
    if (collection.world === "geo") {
      const pool = COUNTRIES.filter((country) => picked.includes(country.iso));
      round = createRound(pool, count, (country) => answerKey(country, mode), mode);
    } else if (collection.world === "football" && isFootballMode(mode)) {
      round = collection.idsAreYears
        ? createFootballRound(mode, count, "easy", picked.map(Number), undefined, undefined)
        : createFootballRound(mode, count, "easy", undefined, undefined, picked);
    } else if (collection.world === "leaders" && isLeadersMode(mode)) {
      round = createLeadersRound(mode, count, undefined, picked);
    } else if (collection.world === "math" && isMathMode(mode)) {
      round = createMathRound(mode, count, undefined, picked);
    } else if (collection.world === "astronomy" && isAstroMode(mode)) {
      round = createAstroRound(mode, count, undefined, picked);
    } else if (isThemeMode(mode)) {
      round = createThemeRound(mode, count, undefined, picked);
    }
    if (round.length === 0) return;
    beginPreparedRound(round, path, quizSettings.level, {
      mode,
      mix: null,
      region: "all",
    });
  }

  useEffect(() => {
    if (!world || typeof window === "undefined") return;
    const query = new URLSearchParams(window.location.search);
    const daily = query.get("daily");
    const list = query.get("list");
    if (!daily && !list) return;
    if (daily) {
      const col = dailyCollection();
      if (col.world !== world) {
        router.replace(dailyPlayHref(col.world));
        return;
      }
      startCollectionRound(col, "daily");
    } else if (list) {
      const col = collectionById(world, list);
      if (col) startCollectionRound(col, "list");
    }
    router.replace(pathname);
  }, [world, pathname, router]);

  function startThemeRound(path: PlayPath = "pool", isos?: string[], level = quizSettings.level) {
    const themeWorld: import("@/lib/quiz").ThemeWorld =
      world && isThemeWorld(world)
        ? world
        : isThemeMode(quizSettings.mode)
          ? (worldOfMode(quizSettings.mode) as import("@/lib/quiz").ThemeWorld)
          : "biology";
    const mix = path === "levels" ? null : quizSettings.mix;
    if (mix) {
      const modes = modesForThemeMix(themeWorld, mix, quizSettings.mixModes);
      const round = createThemeMixedRound(modes, isos ? isos.length : quizSettings.roundSize, quizSettings.difficulty);
      if (round.length === 0) return;
      beginPreparedRound(round, path, level, {
        mode: modes[0] ?? THEME_DEFAULT_MODE[themeWorld],
        mix,
        region: "all",
      });
      return;
    }
    const mode = defaultThemeMode(themeWorld, quizSettings.mode);
    if (!isThemeMode(mode)) return;
    const round = createThemeRound(
      mode,
      isos ? isos.length : quizSettings.roundSize,
      path === "pool" ? quizSettings.difficulty : undefined,
      isos,
    );
    if (round.length === 0) return;
    beginPreparedRound(round, path, level, {
      mode,
      mix: null,
      region: "all",
    });
  }

  function beginPreparedRound(
    round: Question[],
    path: PlayPath,
    level: number,
    extras?: Partial<QuizSettings>,
  ) {
    if (round.length === 0) return;
    roundStartRef.current = Date.now();
    questionStartRef.current = Date.now();
    savedRoundRef.current = false;
    setIsNewBest(false);
    setEarnedXp(0);
    setEmpireReward(null);
    setExtraLifeBought(false);
    setHintHidden({});
    setWorldRecord(null);
    setResultTone(null);
    setQuestions(round);
    setIndex(0);
    setSelectedIso(null);
    setTimedOut(false);
    setAnswers([]);
    setRemainingMs(questionMs(round[0]?.mode ?? quizSettings.mode, path, quizSettings.region));
    setRoundMs(0);
    setSettings((prev) => ({ ...prev, path, level, ...extras }));
    setScreen("quiz");
  }

  function playLevel(level: number) {
    if (quizSettings.levelLearn) {
      openLearnLevel(level);
      return;
    }
    if (quizSettings.levelHardcore && empireAccess({ kind: "levelHardcore" }) === "locked") return;
    if (empireAccess({ kind: "levels", world: worldOfMode(quizSettings.mode), level }) === "locked") return;
    if (!isLevelUnlocked(levelClears, level, quizSettings.mode)) return;
    if (isFootballMode(quizSettings.mode)) {
      if (
        isPlayerFootballMode(quizSettings.mode) ||
        isManagerFootballMode(quizSettings.mode) ||
        quizSettings.mode === "clubCrestToName" ||
        quizSettings.mode === "stadiumToClub"
      ) {
        const ids = footballLevelPlayerIds(quizSettings.mode, level);
        startFootballRound("levels", level, undefined, ids);
        return;
      }
      const years = footballLevelYears(quizSettings.mode, level);
      startFootballRound("levels", level, years);
      return;
    }
    if (isLeadersMode(quizSettings.mode)) {
      const pool = getLevelPool(level, quizSettings.mode);
      if (pool.length === 0) return;
      startLeadersRound(
        "levels",
        pool.map((country) => country.iso),
        level,
      );
      return;
    }
    if (isMathMode(quizSettings.mode)) {
      const round = createMathLevelRound(quizSettings.mode, level);
      if (round.length === 0) return;
      beginPreparedRound(round, "levels", level, {
        mode: quizSettings.mode,
        mix: null,
        region: "all",
      });
      return;
    }
    if (isAstroMode(quizSettings.mode)) {
      const round = createAstroLevelRound(quizSettings.mode, level);
      if (round.length === 0) return;
      beginPreparedRound(round, "levels", level, {
        mode: quizSettings.mode,
        mix: null,
        region: "all",
      });
      return;
    }
    if (isThemeMode(quizSettings.mode)) {
      const round = createThemeLevelRound(quizSettings.mode, level);
      if (round.length === 0) return;
      beginPreparedRound(round, "levels", level, {
        mode: quizSettings.mode,
        mix: null,
        region: "all",
      });
      return;
    }
    if (isFinalLevel(level) && hasGeoFinale(quizSettings.mode)) {
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
    if (empireAccess({ kind: "levels", world: worldOfMode(quizSettings.mode), level: FINAL_LEVEL }) === "locked") return;
    if (lives === 1 && empireAccess({ kind: "levelHardcore" }) === "locked") return;
    const pool = getLevelPool(FINAL_LEVEL, quizSettings.mode);
    beginRound(pool, pool.length, "levels", FINAL_LEVEL, {
      levelHardcore: lives === 1,
      levelLives: lives,
    });
  }

  function goHub(tab: HubTab) {
    if (tab === "album") {
      setScreen("album");
      return;
    }
    if (tab === "mistakes") {
      setSettings((prev) => ({ ...prev, path: "mistakes", mix: null }));
      setScreen("mistakes");
      return;
    }
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
    if (tab === "lists") {
      setScreen("lists");
      return;
    }
    setScreen("map");
  }

  function campaignModeForLevels(mode: QuizSettings["mode"]): QuizSettings["mode"] {
    if (mode === "playerFactsToName") return "playerPhotoToName";
    if (
      mode === "neighborsToName" ||
      mode === "factsToName" ||
      mode === "nameToLanguage" ||
      mode === "languageToName" ||
      mode === "nameToDriving" ||
      mode === "drivingToName" ||
      mode === "nameToGov" ||
      isRankingMode(mode)
    ) {
      return "flagToName";
    }
    if (isMathMode(mode) && !mathHasCampaign(mode)) return "exprToValue";
    if (isAstroMode(mode) && !astroHasCampaign(mode)) return "planetToOrder";
    if (isThemeMode(mode) && !themeHasCampaign(mode)) {
      const themeWorld = world && isThemeWorld(world) ? world : (worldOfMode(mode) as import("@/lib/quiz").ThemeWorld);
      return THEME_DEFAULT_MODE[themeWorld];
    }
    return mode;
  }

  function openLevels() {
    setSettings((prev) => ({
      ...prev,
      path: "levels",
      mix: null,
      mode: campaignModeForLevels(prev.mode),
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
      mode:
        prev.mode === "neighborsToName" || prev.mode === "factsToName" || isRankingMode(prev.mode)
          ? "flagToName"
          : prev.mode,
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

  function startPractice(isos?: string[]) {
    if (isFootballMode(quizSettings.mode)) {
      startFootballRound("learn", quizSettings.level);
      return;
    }
    if (isLeadersMode(quizSettings.mode)) {
      const ids =
        isos?.length
          ? isos
          : quizSettings.learnFrom === "level"
            ? getLearnPool(
                quizSettings.learnFrom,
                quizSettings.region,
                quizSettings.level,
                quizSettings.mode,
                quizSettings.includeExtras,
              ).map((country) => country.iso)
            : undefined;
      startLeadersRound("learn", ids);
      return;
    }
    if (isMathMode(quizSettings.mode)) {
      const ids =
        isos?.length
          ? isos
          : getLearnPool(
              quizSettings.learnFrom,
              quizSettings.region,
              quizSettings.level,
              quizSettings.mode,
              quizSettings.includeExtras,
            ).map((country) => country.iso);
      startMathRound("learn", ids);
      return;
    }
    if (isAstroMode(quizSettings.mode)) {
      const ids =
        isos?.length
          ? isos
          : getLearnPool(
              quizSettings.learnFrom,
              quizSettings.region,
              quizSettings.level,
              quizSettings.mode,
              quizSettings.includeExtras,
            ).map((country) => country.iso);
      startAstroRound("learn", ids);
      return;
    }
    if (isThemeMode(quizSettings.mode)) {
      const ids =
        isos?.length
          ? isos
          : getLearnPool(
              quizSettings.learnFrom,
              quizSettings.region,
              quizSettings.level,
              quizSettings.mode,
              quizSettings.includeExtras,
            ).map((country) => country.iso);
      startThemeRound("learn", ids);
      return;
    }
    const pool = getLearnPool(
      quizSettings.learnFrom,
      quizSettings.region,
      quizSettings.level,
      quizSettings.mode,
      quizSettings.includeExtras,
    );
    beginRound(pool, pool.length, "learn", quizSettings.level);
  }

  function startMistakesPractice() {
    if (!empireStartMistakes()) return;
    if (isFootballMode(quizSettings.mode)) {
      if (isPlayerFootballMode(quizSettings.mode)) {
        const isos = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.iso);
        if (isos.length === 0) return;
        startFootballRound("mistakes", quizSettings.level, undefined, isos);
        return;
      }
      const years = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.year).filter((year): year is number => year !== undefined);
      if (years.length === 0) return;
      startFootballRound("mistakes", quizSettings.level, years);
      return;
    }
    if (isLeadersMode(quizSettings.mode)) {
      const isos = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.iso);
      if (isos.length === 0) return;
      startLeadersRound("mistakes", isos);
      return;
    }
    if (isMathMode(quizSettings.mode)) {
      const isos = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.iso);
      if (isos.length === 0) return;
      startMathRound("mistakes", isos);
      return;
    }
    if (isAstroMode(quizSettings.mode)) {
      const isos = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.iso);
      if (isos.length === 0) return;
      startAstroRound("mistakes", isos);
      return;
    }
    if (isThemeMode(quizSettings.mode)) {
      const isos = mistakeList.filter((item) => item.mode === quizSettings.mode).map((item) => item.iso);
      if (isos.length === 0) return;
      startThemeRound("mistakes", isos);
      return;
    }
    const pool = getRegionPool(quizSettings.region, true).filter((country) =>
      mistakeList.some((item) => item.iso === country.iso && worldOfMode(item.mode) === "geo"),
    );
    if (pool.length === 0) return;
    beginRound(poolForMode(pool, quizSettings.mode), Math.min(quizSettings.roundSize, pool.length), "mistakes", quizSettings.level);
  }

  function handlePracticeNext() {
    if (index >= questions.length - 1) {
      const finishedMs =
        roundStartRef.current !== null ? Date.now() - roundStartRef.current : 0;
      if (roundStartRef.current !== null) setRoundMs(finishedMs);
      const wrong = answers.filter((answer) => !isCorrect(answer)).length;
      if (quizSettings.path === "mistakes") {
        bumpTrainerComplete(wrong === 0 && answers.length > 0);
      }
      rememberRound(answers);
      setResultTone(wrong === 0 ? "success" : null);
      playSfx(wrong === 0 ? "success" : "fail");
      setScreen("results");
      return;
    }
    setIndex((prev) => prev + 1);
    setSelectedIso(null);
    setTimedOut(false);
    questionStartRef.current = Date.now();
  }

  function powerEnabled() {
    return quizSettings.path === "pool" && !isPractice && screen === "quiz" && !answered;
  }

  function spendHint() {
    if (!powerEnabled()) return;
    const question = questions[index];
    if (!question) return;
    const { all, correct } = choiceKeys(question);
    const hidden = new Set(hintHidden[index] ?? []);
    const wrong = all.filter((key) => key !== correct && !hidden.has(key));
    if (wrong.length < 2) return;
    if (!empireBuyPower("hint").ok) return;
    const pick = [...wrong].sort(() => Math.random() - 0.5).slice(0, 2);
    setHintHidden((prev) => ({ ...prev, [index]: [...(prev[index] ?? []), ...pick] }));
  }

  function spendSkip() {
    if (!powerEnabled()) return;
    const question = questions[index];
    if (!question) return;
    if (!empireBuyPower("skip").ok) return;
    setSelectedIso(SKIP_ISO);
    const next: RoundAnswer = { question, selectedIso: SKIP_ISO, timeMs: questionTimeMs(), skipped: true };
    playSfx("wrong");
    setAnswers((prev) => [...prev, next]);
  }

  function spendLife() {
    if (!powerEnabled() || extraLifeBought) return;
    if (!empireBuyPower("life").ok) return;
    setExtraLifeBought(true);
  }

  function finishFacts(iso: string | null, timeMs: number) {
    if (answered) return;
    const question = questions[index];
    if (!question) return;
    setSelectedIso(iso);
    setTimedOut(iso === null);
    const next = { question, selectedIso: iso, timeMs };
    playSfx(isCorrect(next) ? "correct" : "wrong");
    setAnswers((prev) => (prev.length > index ? prev : [...prev, next]));
  }

  function selectAnswer(iso: string) {
    if (answered) return;
    const question = questions[index];
    setSelectedIso(iso);
    const next = { question, selectedIso: iso, timeMs: questionTimeMs() };
    playSfx(isCorrect(next) ? "correct" : "wrong");
    setAnswers((prev) => [...prev, next]);
  }

  function playAgain() {
    if (quizSettings.path === "learn" || quizSettings.path === "mistakes") {
      if (quizSettings.path === "mistakes") {
        startMistakesPractice();
        return;
      }
      startPractice();
      return;
    }
    if (quizSettings.path === "levels" && isFinalLevel(quizSettings.level) && hasGeoFinale(quizSettings.mode)) {
      playFinalLevel(quizSettings.levelLives);
      return;
    }
    if (quizSettings.path === "levels") {
      playLevel(quizSettings.level);
      return;
    }
    if (quizSettings.path === "list" || quizSettings.path === "daily") {
      const col = collectionRef.current ?? (quizSettings.path === "daily" ? dailyCollection() : undefined);
      if (col) startCollectionRound(col, quizSettings.path);
      return;
    }
    startRound();
  }

  function playNextLevel() {
    playLevel(quizSettings.level + 1);
  }

  function goToWorlds() {
    roundStartRef.current = null;
    softNav(() => {
      syncWorldAttr(null);
      setWorldNav(null);
      screenRef.current = "home";
      setScreenState("home");
      router.push("/");
    });
  }

  function goBackFromPlay() {
    roundStartRef.current = null;
    if (quizSettings.path === "daily") {
      goToWorlds();
      return;
    }
    if (quizSettings.path === "list") {
      setScreen("lists");
      return;
    }
    if (world === "football") {
      if (quizSettings.path === "learn") {
        setScreen("learn");
        return;
      }
      if (quizSettings.path === "levels") {
        setScreen("levels");
        return;
      }
      if (quizSettings.path === "mistakes") {
        setScreen("mistakes");
        return;
      }
      setScreen("home");
      return;
    }
    if (world === "leaders") {
      if (quizSettings.path === "learn") {
        setScreen("learn");
        return;
      }
      if (quizSettings.path === "levels") {
        setScreen("levels");
        return;
      }
      if (quizSettings.path === "mistakes") {
        setScreen("mistakes");
        return;
      }
      setScreen("home");
      return;
    }
    if (world === "math") {
      if (quizSettings.path === "learn") {
        setScreen("learn");
        return;
      }
      if (quizSettings.path === "levels") {
        setScreen("levels");
        return;
      }
      if (quizSettings.path === "mistakes") {
        setScreen("mistakes");
        return;
      }
      setScreen("home");
      return;
    }
    if (world === "astronomy") {
      if (quizSettings.path === "learn") {
        setScreen("learn");
        return;
      }
      if (quizSettings.path === "levels") {
        setScreen("levels");
        return;
      }
      if (quizSettings.path === "mistakes") {
        setScreen("mistakes");
        return;
      }
      setScreen("home");
      return;
    }
    if (world && isThemeWorld(world)) {
      if (quizSettings.path === "learn") {
        setScreen("learn");
        return;
      }
      if (quizSettings.path === "levels") {
        setScreen("levels");
        return;
      }
      if (quizSettings.path === "mistakes") {
        setScreen("mistakes");
        return;
      }
      setScreen("home");
      return;
    }
    if (quizSettings.path === "learn") {
      setScreen("learn");
      return;
    }
    if (quizSettings.path === "mistakes") {
      setScreen("mistakes");
      return;
    }
    if (
      quizSettings.path === "levels" &&
      isFinalLevel(quizSettings.level) &&
      hasGeoFinale(quizSettings.mode) &&
      isLevelUnlocked(levelClears, FINAL_LEVEL, quizSettings.mode)
    ) {
      setScreen("level20");
      return;
    }
    setScreen(quizSettings.path === "levels" ? "levels" : "home");
  }

  function handleClearHistory() {
    setHistory(clearHistory((item) => isFootballMode(item.mode) || isLeadersMode(item.mode) || isMathMode(item.mode) || isAstroMode(item.mode) || isThemeMode(item.mode)));
  }

  function handleClearBests() {
    setBests(clearBests());
  }

  function handleClearFootballHistory() {
    setHistory(clearHistory((item) => !isFootballMode(item.mode)));
  }

  function handleClearLeadersHistory() {
    setHistory(clearHistory((item) => !isLeadersMode(item.mode)));
  }

  function handleClearMathHistory() {
    setHistory(clearHistory((item) => !isMathMode(item.mode)));
  }

  function handleClearAstroHistory() {
    setHistory(clearHistory((item) => !isAstroMode(item.mode)));
  }

  function handleClearThemeHistory() {
    const current = world
    setHistory(
      clearHistory((item) =>
        current && isThemeWorld(current)
          ? !(isThemeMode(item.mode) && themeWorldOf(item.mode) === current)
          : !isThemeMode(item.mode),
      ),
    )
  }

  const hiddenKeys = hintHidden[index] ?? [];
  const currentQuestion = questions[index];
  const hintReady = currentQuestion
    ? choiceKeys(currentQuestion).all.filter(
        (key) => key !== choiceKeys(currentQuestion).correct && !hiddenKeys.includes(key),
      ).length >= 2
    : false;

  const play = {
    screen,
    quizSettings,
    history,
    bests,
    levelClears,
    xp,
    xpReady,
    questions,
    index,
    selectedIso,
    timedOut,
    remainingMs,
    roundMs,
    answers,
    endedBy,
    isNewBest,
    earnedXp,
    empireReward,
    worldRecord,
    livesLeft,
    livesLimit,
    isPractice,
    answered,
    currentMode,
    stamps,
    mistakeList,
    quizPower: {
      enabled: quizSettings.path === "pool" && !isPractice,
      hiddenKeys,
      extraLifeUsed: extraLifeBought,
      hintReady,
      onHint: spendHint,
      onSkip: spendSkip,
      onLife: spendLife,
    },
    handleSettingsChange,
    startFootballRound,
    startLeadersRound,
    startMathRound,
    startAstroRound,
    startThemeRound,
    startCollectionRound,
    startRound,
    goHub,
    goToWorlds,
    goBackFromPlay,
    handleClearFootballHistory,
    handleClearLeadersHistory,
    handleClearMathHistory,
    handleClearAstroHistory,
    handleClearThemeHistory,
    handleClearHistory,
    handleClearBests,
    playLevel,
    playFinalLevel,
    playAgain,
    playNextLevel,
    leaveLearn,
    startPractice,
    startMistakesPractice,
    handlePracticeNext,
    selectAnswer,
    finishFacts,
    setMistakeList,
    setWorldRecord,
  };

  return (
    <div className={`app${resultTone ? ` is-${resultTone}` : ""}${world === "football" ? " is-football" : ""}${world === "leaders" ? " is-leaders" : ""}${world === "math" ? " is-math" : ""}${world === "astronomy" ? " is-astronomy" : ""}${world && isThemeWorld(world) ? ` is-${world}` : ""}${hub === null ? " is-worlds" : ""}${hub === "empire" ? " is-empire" : ""}`}>
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
      <AppChrome
        settings={quizSettings}
        history={history}
        bests={bests}
        levelClears={levelClears}
        xp={xp}
        xpReady={xpReady}
        geoCatalog={world === "geo"}
        onChange={handleSettingsChange}
        onClearBests={handleClearBests}
      />
      {hub === null && (
        <WorldPickScreen
          settings={quizSettings}
          onDaily={() => {
            const col = dailyCollection();
            router.push(dailyPlayHref(col.world));
          }}
          onStudio={() => {
            softNav(() => {
              syncWorldAttr(null);
              setWorldNav("studio");
              screenRef.current = "home";
              setScreenState("home");
              router.push("/studio");
            });
          }}
          onEmpire={() => {
            softNav(() => {
              syncWorldAttr(null);
              setWorldNav("empire");
              screenRef.current = "home";
              setScreenState("home");
              router.push("/empire");
            });
          }}
          onProfile={() => {
            softNav(() => {
              syncWorldAttr(null);
              setWorldNav("profile");
              screenRef.current = "home";
              setScreenState("home");
              router.push("/profile");
            });
          }}
          onMultiplayer={() => {
            softNav(() => {
              syncWorldAttr(null);
              setWorldNav("multiplayer");
              screenRef.current = "home";
              setScreenState("home");
              router.push("/multiplayer");
            });
          }}
          onPick={(next) => {
            softNav(() => {
              setSettings((prev) => {
                let nextSettings = prev;
                if (next === "football") {
                  const mode = isFootballMode(prev.mode) ? prev.mode : "playerPhotoToName";
                  const difficulty =
                    prev.difficulty === "medium" || prev.difficulty === "hardcore" ? "hard" : prev.difficulty;
                  nextSettings = {
                    ...prev,
                    mode,
                    mix: null,
                    region: "all",
                    difficulty,
                    levelHardcore: prev.levelHardcore || prev.difficulty === "hardcore",
                  };
                } else if (next === "leaders") {
                  nextSettings = {
                    ...prev,
                    mode: defaultLeadersMode(prev.mode),
                    mix: null,
                    region: "all",
                  };
                } else if (next === "math") {
                  nextSettings = {
                    ...prev,
                    mode: defaultMathMode(prev.mode),
                    mix: null,
                    region: "all",
                  };
                } else if (next === "astronomy") {
                  nextSettings = {
                    ...prev,
                    mode: defaultAstroMode(prev.mode),
                    mix: null,
                    region: "all",
                  };
                } else if (isThemeWorld(next)) {
                  nextSettings = {
                    ...prev,
                    mode: defaultThemeMode(next, prev.mode),
                    mix: null,
                    region: "all",
                  };
                } else if (next === "geo" && (isFootballMode(prev.mode) || isLeadersMode(prev.mode) || isMathMode(prev.mode) || isAstroMode(prev.mode) || isThemeMode(prev.mode))) {
                  nextSettings = {
                    ...prev,
                    mode: "flagToName",
                    mix: null,
                    difficulty:
                      prev.difficulty === "medium" || prev.difficulty === "hardcore" ? "hard" : prev.difficulty,
                    levelHardcore: prev.levelHardcore || prev.difficulty === "hardcore",
                  };
                }
                return {
                  ...nextSettings,
                  path: "levels",
                  mode: campaignModeForLevels(nextSettings.mode),
                };
              });
              syncWorldAttr(next);
              setWorldNav(next);
              screenRef.current = "levels";
              setScreenState("levels");
              router.push(worldHref(next));
            });
          }}
        />
      )}
      {hub === "multiplayer" ? <MultiplayerPlay play={play} /> : null}
      {hub === "profile" ? <ProfilePlay play={play} /> : null}
      {hub === "studio" ? <StudioPlay play={play} /> : null}
      {hub === "empire" ? <EmpirePlay play={play} /> : null}
      {world === "football" ? <FootballPlay play={play} /> : null}
      {world === "leaders" ? <LeadersPlay play={play} /> : null}
      {world === "math" ? <MathPlay play={play} /> : null}
      {world === "astronomy" ? <AstroPlay play={play} /> : null}
      {world && isThemeWorld(world) ? <ThemePlay world={world} play={play} /> : null}
      {world === "geo" ? <GeoPlay play={play} /> : null}
      <footer className="legal-footer">
        {world === "geo" ? (
          <nav className="legal-links">
            <a href="/countries">{STRINGS[quizSettings.lang].legalCountries}</a>
            <a href="/languages">{STRINGS[quizSettings.lang].legalLanguages}</a>
            <a href="/lists">{STRINGS[quizSettings.lang].legalLists}</a>
            <a href="/today">{STRINGS[quizSettings.lang].legalToday}</a>
          </nav>
        ) : null}
        <nav className="legal-links">
          <a href="/about">{STRINGS[quizSettings.lang].legalAbout}</a>
          <a href="/privacy">{STRINGS[quizSettings.lang].legalPrivacy}</a>
          <a href="/cookies">{STRINGS[quizSettings.lang].legalCookies}</a>
          <a href="/terms">{STRINGS[quizSettings.lang].legalTerms}</a>
          <a href="/contacts">{STRINGS[quizSettings.lang].legalContacts}</a>
        </nav>
        <p className="credit">{STRINGS[quizSettings.lang].credit}</p>
      </footer>
    </div>
  );
}
