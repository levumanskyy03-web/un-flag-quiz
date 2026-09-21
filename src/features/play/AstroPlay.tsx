"use client";

import { WorldAlbumScreen } from "@/components/WorldAlbumScreen";
import { ASTRO_HUB_TABS } from "@/components/HubNav";
import { defaultAstroMode, AstroScreen } from "@/components/AstroScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { LevelsScreen } from "@/components/LevelsScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { clearMistakes } from "@/lib/mistakes";
import {
  ASTRO_CAMPAIGN_MODES,
  ASTRO_MODES,
  astroHasCampaign,
  campaignLevelCount,
  campaignLevelNumbers,
  isAstroMode,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function AstroPlay({ play }: { play: PlaySession }) {
  return (
    <>
      {play.screen === "home" && (
        <AstroScreen
          settings={play.quizSettings}
          history={play.history.filter((item) => isAstroMode(item.mode))}
          bests={play.bests.filter((item) => isAstroMode(item.mode))}
          onChange={play.handleSettingsChange}
          onStart={() => play.startAstroRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearAstroHistory}
        />
      )}
      {play.screen === "levels" && (
        <LevelsScreen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          modes={ASTRO_CAMPAIGN_MODES}
          levels={campaignLevelNumbers(
            astroHasCampaign(defaultAstroMode(play.quizSettings.mode))
              ? defaultAstroMode(play.quizSettings.mode)
              : 'planetToOrder',
          )}
          tabs={ASTRO_HUB_TABS}
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
          modes={ASTRO_MODES}
          tabs={ASTRO_HUB_TABS}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !isAstroMode(item.mode)))}
        />
      )}
      {play.screen === "album" && (
        <WorldAlbumScreen
          settings={play.quizSettings}
          world="astronomy"
          tabs={ASTRO_HUB_TABS}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
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
        />
      )}
    </>
  );
}
