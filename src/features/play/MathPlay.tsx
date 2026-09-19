"use client";

import { MATH_HUB_TABS } from "@/components/HubNav";
import { defaultMathMode, MathScreen } from "@/components/MathScreen";
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
  isMathMode,
  MATH_CAMPAIGN_MODES,
  MATH_MODES,
  mathHasCampaign,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function MathPlay({ play }: { play: PlaySession }) {
  return (
    <>
      {play.screen === "home" && (
        <MathScreen
          settings={play.quizSettings}
          history={play.history.filter((item) => isMathMode(item.mode))}
          bests={play.bests.filter((item) => isMathMode(item.mode))}
          onChange={play.handleSettingsChange}
          onStart={() => play.startMathRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearMathHistory}
        />
      )}
      {play.screen === "levels" && (
        <LevelsScreen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          modes={MATH_CAMPAIGN_MODES}
          levels={campaignLevelNumbers(
            mathHasCampaign(defaultMathMode(play.quizSettings.mode))
              ? defaultMathMode(play.quizSettings.mode)
              : 'exprToValue',
          )}
          tabs={MATH_HUB_TABS}
          onChange={play.handleSettingsChange}
          onPlay={play.playLevel}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
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
          modes={MATH_MODES}
          tabs={MATH_HUB_TABS}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !isMathMode(item.mode)))}
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
          power={play.quizPower}
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
          mix={play.quizSettings.path === "pool" ? play.quizSettings.mix : null}
          mixModes={play.quizSettings.mixModes}
          hardcore={play.quizSettings.levelHardcore || play.quizSettings.difficulty === "hardcore"}
          answers={play.answers}
          roundMs={play.roundMs}
          endedBy={play.endedBy}
          isNewBest={play.isNewBest}
          earnedXp={play.earnedXp}
          earnedTokens={play.earnedTokens}
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
