"use client";

import { WorldAlbumScreen } from "@/components/WorldAlbumScreen";
import { CollectionsScreen } from "@/components/CollectionsScreen";
import { THEME_HUB_TABS } from "@/components/HubNav";
import { ThemeScreen } from "@/components/ThemeScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { LevelsScreen } from "@/components/LevelsScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { clearMistakes } from "@/lib/mistakes";
import {
  THEME_CAMPAIGN_MODES,
  campaignLevelCount,
  campaignLevelNumbers,
  defaultThemeMode,
  isThemeMode,
  themeHasCampaign,
  themeModesOfWorld,
  themeWorldOf,
  type ThemeWorld,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function ThemePlay({ world, play }: { world: ThemeWorld; play: PlaySession }) {
  const campaignMode = defaultThemeMode(world, play.quizSettings.mode);
  return (
    <>
      {play.screen === "home" && (
        <ThemeScreen
          world={world}
          settings={play.quizSettings}
          history={play.history.filter((item) => isThemeMode(item.mode) && themeWorldOf(item.mode) === world)}
          bests={play.bests.filter((item) => isThemeMode(item.mode) && themeWorldOf(item.mode) === world)}
          onChange={play.handleSettingsChange}
          onStart={() => play.startThemeRound()}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearThemeHistory}
        />
      )}
      {play.screen === "levels" && (
        <LevelsScreen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          modes={THEME_CAMPAIGN_MODES[world]}
          levels={campaignLevelNumbers(themeHasCampaign(campaignMode) ? campaignMode : THEME_CAMPAIGN_MODES[world][0])}
          tabs={THEME_HUB_TABS}
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
          modes={themeModesOfWorld(world)}
          tabs={THEME_HUB_TABS}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => !(isThemeMode(item.mode) && themeWorldOf(item.mode) === world)))}
        />
      )}
      {play.screen === "album" && (
        <WorldAlbumScreen
          settings={play.quizSettings}
          world={world}
          tabs={THEME_HUB_TABS}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "lists" && (
        <CollectionsScreen
          world={world}
          settings={play.quizSettings}
          tabs={THEME_HUB_TABS}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPlay={(collection, path) => play.startCollectionRound(collection, path)}
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
          empireReward={play.empireReward}
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
