import type { Dispatch, SetStateAction } from "react";
import type { HubTab } from "@/components/HubNav";
import type { QuizSettings } from "@/components/HomeScreen";
import type { RoundRecord } from "@/lib/history";
import type { LevelClear } from "@/lib/levelProgress";
import type { MistakeEntry } from "@/lib/mistakes";
import type { StampAlbum } from "@/lib/stamps";
import type { Collection } from "@/data/collections";
import type { PlayPath, Question, QuizMode, RoundAnswer, RoundEnd } from "@/lib/quiz";
import type { EmpireRoundReward } from "@/lib/empire/rules";

export type PlayScreen =
  | "home"
  | "levels"
  | "level20"
  | "learn"
  | "map"
  | "quiz"
  | "results"
  | "mistakes"
  | "album"
  | "lists";

export type PlaySession = {
  screen: PlayScreen;
  quizSettings: QuizSettings;
  history: RoundRecord[];
  bests: RoundRecord[];
  levelClears: LevelClear[];
  xp: number;
  xpReady: boolean;
  questions: Question[];
  index: number;
  selectedIso: string | null;
  timedOut: boolean;
  remainingMs: number;
  roundMs: number;
  answers: RoundAnswer[];
  endedBy: RoundEnd;
  isNewBest: boolean;
  earnedXp: number;
  empireReward: EmpireRoundReward | null;
  worldRecord: { previousName: string | null } | null;
  livesLeft: number;
  livesLimit: number;
  isPractice: boolean;
  answered: boolean;
  currentMode: QuizMode;
  stamps: StampAlbum;
  mistakeList: MistakeEntry[];
  quizPower: {
    enabled: boolean;
    hiddenKeys: string[];
    extraLifeUsed: boolean;
    hintReady: boolean;
    onHint: () => void;
    onSkip: () => void;
    onLife: () => void;
  };
  handleSettingsChange: (next: QuizSettings) => void;
  startFootballRound: (path?: PlayPath, level?: number, years?: number[], playerIds?: string[]) => void;
  startLeadersRound: (path?: PlayPath, isos?: string[], level?: number) => void;
  startMathRound: (path?: PlayPath, isos?: string[], level?: number) => void;
  startAstroRound: (path?: PlayPath, isos?: string[], level?: number) => void;
  startThemeRound: (path?: PlayPath, isos?: string[], level?: number) => void;
  startCollectionRound: (collection: Collection, path: "list" | "daily") => void;
  startRound: () => void;
  goHub: (tab: HubTab) => void;
  goToWorlds: () => void;
  goBackFromPlay: () => void;
  handleClearFootballHistory: () => void;
  handleClearLeadersHistory: () => void;
  handleClearMathHistory: () => void;
  handleClearAstroHistory: () => void;
  handleClearThemeHistory: () => void;
  handleClearHistory: () => void;
  handleClearBests: () => void;
  playLevel: (level: number) => void;
  playFinalLevel: (lives: number) => void;
  playAgain: () => void;
  playNextLevel: () => void;
  leaveLearn: () => void;
  startPractice: (isos?: string[]) => void;
  startMistakesPractice: () => void;
  handlePracticeNext: () => void;
  selectAnswer: (iso: string) => void;
  finishFacts: (iso: string | null, timeMs: number) => void;
  setMistakeList: Dispatch<SetStateAction<MistakeEntry[]>>;
  setWorldRecord: Dispatch<SetStateAction<{ previousName: string | null } | null>>;
};
