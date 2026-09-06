"use client";

import { CodesScreen } from "@/components/CodesScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { clearMistakes } from "@/lib/mistakes";
import { CODES_MODES, isCodesMode } from "@/lib/quiz";
import type { PlaySession } from "./session";

export function CodesPlay({ play }: { play: PlaySession }) {
  return (
    <>
      {play.screen === "home" && (
        <CodesScreen
          settings={play.quizSettings}
          history={play.history.filter((item) => isCodesMode(item.mode))}
          bests={play.bests.filter((item) => isCodesMode(item.mode))}
          levelClears={play.levelClears}
          xp={play.xp}
          xpReady={play.xpReady}
          onChange={play.handleSettingsChange}
          onStart={() => play.startCodesRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearCodesHistory}
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
          modes={CODES_MODES}
          tabs={["free", "learn", "mistakes"]}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !isCodesMode(item.mode)))}
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
          hardcore={false}
          answers={play.answers}
          roundMs={play.roundMs}
          endedBy={play.endedBy}
          isNewBest={play.isNewBest}
          earnedXp={play.earnedXp}
          totalXp={play.xp}
          saveNote={!play.isPractice}
          menuLabel={play.isPractice ? STRINGS[play.quizSettings.lang].backToCards : undefined}
          onAgain={play.playAgain}
          onMenu={play.goBackFromPlay}
          onWorlds={play.goToWorlds}
        />
      )}
    </>
  );
}
