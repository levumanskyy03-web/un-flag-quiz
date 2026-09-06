import type { Dispatch, SetStateAction } from "react";
import type { HubTab } from "@/components/HubNav";
import type { QuizSettings } from "@/components/HomeScreen";
import type { RoundRecord } from "@/lib/history";
import type { LevelClear } from "@/lib/levelProgress";
import type { MistakeEntry } from "@/lib/mistakes";
import type { StampAlbum } from "@/lib/stamps";
import type { PlayPath, Question, QuizMode, RoundAnswer, RoundEnd } from "@/lib/quiz";

export type PlayScreen =
  | "home"
  | "levels"
  | "level20"
  | "learn"
  | "map"
  | "quiz"
  | "results"
  | "mistakes"
  | "album";

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
  worldRecord: { previousName: string | null } | null;
  livesLeft: number;
  livesLimit: number;
  isPractice: boolean;
  answered: boolean;
  currentMode: QuizMode;
  stamps: StampAlbum;
  mistakeList: MistakeEntry[];
  handleSettingsChange: (next: QuizSettings) => void;
  startFootballRound: (path?: PlayPath, level?: number, years?: number[], playerIds?: string[]) => void;
  startCodesRound: (path?: PlayPath) => void;
  startLeadersRound: (path?: PlayPath, isos?: string[], level?: number) => void;
  startRound: () => void;
  goHub: (tab: HubTab) => void;
  goToWorlds: () => void;
  goBackFromPlay: () => void;
  handleClearFootballHistory: () => void;
  handleClearCodesHistory: () => void;
  handleClearLeadersHistory: () => void;
  handleClearHistory: () => void;
  handleClearBests: () => void;
  playLevel: (level: number) => void;
  playFinalLevel: (lives: number) => void;
  playAgain: () => void;
  playNextLevel: () => void;
  leaveLearn: () => void;
  startPractice: () => void;
  startMistakesPractice: () => void;
  handlePracticeNext: () => void;
  selectAnswer: (iso: string) => void;
  finishFacts: (iso: string | null, timeMs: number) => void;
  setMistakeList: Dispatch<SetStateAction<MistakeEntry[]>>;
  setWorldRecord: Dispatch<SetStateAction<{ previousName: string | null } | null>>;
};
