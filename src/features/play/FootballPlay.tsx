"use client";

import { FactsScreen } from "@/components/FactsScreen";
import { FootballScreen } from "@/components/FootballScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { LevelsScreen } from "@/components/LevelsScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { useDuelLaunch } from "@/features/duel/useDuelLaunch";
import { clearMistakes } from "@/lib/mistakes";
import {
  campaignLevelCount,
  campaignLevelNumbers,
  footballHasDifficulty,
  FOOTBALL_MODES,
  isFactsToName,
  isFootballMode,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function FootballPlay({ play }: { play: PlaySession }) {
  const duel = useDuelLaunch(play.quizSettings);
  return (
    <>
      {play.screen === "home" && (
        <FootballScreen
          settings={play.quizSettings}
          history={play.history.filter((item) => isFootballMode(item.mode))}
          bests={play.bests.filter((item) => isFootballMode(item.mode))}
          levelClears={play.levelClears}
          xp={play.xp}
          xpReady={play.xpReady}
          duelError={duel.error}
          onChange={play.handleSettingsChange}
          onStart={() => play.startFootballRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onCreateDuel={(modes, facts) => void duel.create(modes, facts)}
          onJoinDuel={duel.join}
          onClearHistory={play.handleClearFootballHistory}
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
          modes={FOOTBALL_MODES}
          levels={campaignLevelNumbers(isFootballMode(play.quizSettings.mode) ? play.quizSettings.mode : "playerPhotoToName")}
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
          modes={FOOTBALL_MODES}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !isFootballMode(item.mode)))}
        />
      )}
      {play.screen === "quiz" && play.questions[play.index] && (
        isFactsToName(play.currentMode) ? (
        <FactsScreen
          lang={play.quizSettings.lang}
          question={play.questions[play.index]!}
          index={play.index}
          total={play.questions.length}
          roundMs={play.roundMs}
          practice={play.isPractice}
          selectedIso={play.selectedIso}
          finished={play.answered}
          onFinish={(iso, timeMs) => play.finishFacts(iso, timeMs)}
          onCountryNext={play.isPractice ? play.handlePracticeNext : undefined}
          onBack={play.goBackFromPlay}
          onWorlds={play.goToWorlds}
        />
        ) : (
        <QuizScreen
          lang={play.quizSettings.lang}
          mode={play.currentMode}
          region={play.quizSettings.region}
          path={play.quizSettings.path}
          question={play.questions[play.index]!}
          index={play.index}
          total={play.questions.length}
          selectedIso={play.selectedIso}
          timedOut={play.timedOut}
          remainingMs={play.remainingMs}
          roundMs={play.roundMs}
          livesLeft={play.livesLeft}
          maxLives={play.isPractice ? 0 : play.livesLimit}
          practice={play.isPractice}
          mix={Boolean(play.quizSettings.mix && play.quizSettings.path === "pool")}
          onSelect={play.selectAnswer}
          onNext={play.isPractice ? play.handlePracticeNext : undefined}
          onBack={play.goBackFromPlay}
          onWorlds={play.goToWorlds}
        />
        )
      )}
      {play.screen === "results" && (
        <ResultsScreen
          lang={play.quizSettings.lang}
          mode={play.quizSettings.mode}
          hardcore={
            play.quizSettings.path === "levels"
              ? play.quizSettings.levelHardcore
              : footballHasDifficulty(play.quizSettings.mode) && play.quizSettings.difficulty === "hardcore"
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
