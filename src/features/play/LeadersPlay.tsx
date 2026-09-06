"use client";

import { defaultLeadersMode, LeadersScreen } from "@/components/LeadersScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { LevelsScreen } from "@/components/LevelsScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { clearMistakes } from "@/lib/mistakes";
import {
  campaignLevelCount,
  campaignLevelNumbers,
  isLeadersMode,
  LEADERS_MODES,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function LeadersPlay({ play }: { play: PlaySession }) {
  return (
    <>
      {play.screen === "home" && (
        <LeadersScreen
          settings={play.quizSettings}
          history={play.history.filter((item) => isLeadersMode(item.mode))}
          bests={play.bests.filter((item) => isLeadersMode(item.mode))}
          levelClears={play.levelClears}
          xp={play.xp}
          xpReady={play.xpReady}
          onChange={play.handleSettingsChange}
          onStart={() => play.startLeadersRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearLeadersHistory}
          onClearBests={play.handleClearBests}
        />
      )}
      {play.screen === "levels" && (
        <LevelsScreen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          history={play.history}
          bests={play.bests}
          xp={play.xp}
          xpReady={play.xpReady}
          modes={LEADERS_MODES}
          levels={campaignLevelNumbers(defaultLeadersMode(play.quizSettings.mode))}
          tabs={["free", "levels", "learn", "mistakes"]}
          onChange={play.handleSettingsChange}
          onPlay={play.playLevel}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearBests={play.handleClearBests}
        />
      )}
      {play.screen === "learn" && (
        <LearnScreen
          settings={play.quizSettings}
          onChange={play.handleSettingsChange}
          onBack={play.leaveLearn}
          onHub={play.goHub}
          onPractice={play.startPractice}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "mistakes" && (
        <MistakesScreen
          settings={play.quizSettings}
          mistakes={play.mistakeList}
          modes={LEADERS_MODES}
          tabs={["free", "levels", "learn", "mistakes"]}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !isLeadersMode(item.mode)))}
        />
      )}
      {play.screen === "quiz" && play.questions[play.index] && (
        <QuizScreen
          lang={play.quizSettings.lang}
          mode={play.currentMode}
          region={play.quizSettings.region}
          path={play.quizSettings.path}
          question={play.questions[play.index]}
          index={play.index}
          total={play.questions.length}
          selectedIso={play.selectedIso}
          timedOut={play.timedOut}
          remainingMs={play.remainingMs}
          roundMs={play.roundMs}
          livesLeft={play.livesLeft}
          maxLives={play.isPractice ? 0 : play.livesLimit}
          practice={play.isPractice}
          onSelect={play.selectAnswer}
          onNext={play.isPractice ? play.handlePracticeNext : undefined}
          onBack={play.goBackFromPlay}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "results" && (
        <ResultsScreen
          lang={play.quizSettings.lang}
          mode={play.quizSettings.mode}
          hardcore={
            play.quizSettings.path === "levels"
              ? play.quizSettings.levelHardcore
              : play.quizSettings.difficulty === "hardcore"
          }
          answers={play.answers}
          roundMs={play.roundMs}
          endedBy={play.endedBy}
          isNewBest={play.isNewBest}
          earnedXp={play.earnedXp}
          totalXp={play.xp}
          saveNote={!play.isPractice}
          menuLabel={play.isPractice ? STRINGS[play.quizSettings.lang].backToCards : undefined}
          onAgain={play.playAgain}
          onNextLevel={
            play.endedBy === "complete" &&
            play.quizSettings.path === "levels" &&
            play.quizSettings.level < campaignLevelCount(play.quizSettings.mode)
              ? play.playNextLevel
              : undefined
          }
          onMenu={play.goBackFromPlay}
          onWorlds={play.goToWorlds}
        />
      )}
    </>
  );
}
