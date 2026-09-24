"use client";

import { AlbumScreen } from "@/components/AlbumScreen";
import { CollectionsScreen } from "@/components/CollectionsScreen";
import { GEO_HUB_TABS } from "@/components/HubNav";
import { FactsScreen } from "@/components/FactsScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { LearnScreen } from "@/components/LearnScreen";
import { Level20Screen } from "@/components/Level20Screen";
import { LevelsScreen } from "@/components/LevelsScreen";
import { MapScreen } from "@/components/MapScreen";
import { MistakesScreen } from "@/components/MistakesScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { RecordModal } from "@/components/RecordModal";
import { ResultsScreen } from "@/components/ResultsScreen";
import { STRINGS } from "@/i18n/strings";
import { clearMistakes } from "@/lib/mistakes";
import { WORLD_RECORD_XP } from "@/lib/xp";
import {
  campaignLevelCount,
  campaignLevelNumbers,
  isFactsToName,
  isFootballMode,
  isLeadersMode,
  isMathMode,
  isAstroMode,
  isWaterMode,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function GeoPlay({ play }: { play: PlaySession }) {
  return (
    <>
      {play.screen === "home" && (
        <HomeScreen
          settings={play.quizSettings}
          history={play.history}
          bests={play.bests}
          onChange={play.handleSettingsChange}
          onStart={play.startRound}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearHistory}
        />
      )}
      {play.screen === "levels" && (
        <LevelsScreen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          levels={
            isWaterMode(play.quizSettings.mode) ? campaignLevelNumbers(play.quizSettings.mode) : undefined
          }
          onChange={play.handleSettingsChange}
          onPlay={play.playLevel}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "level20" && (
        <Level20Screen
          settings={play.quizSettings}
          levelClears={play.levelClears}
          onPlay={play.playFinalLevel}
          onBack={() => play.goHub("levels")}
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
      {play.screen === "map" && (
        <MapScreen
          settings={play.quizSettings}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "mistakes" && (
        <MistakesScreen
          settings={play.quizSettings}
          mistakes={play.mistakeList}
          modes={["flagToName", "nameToFlag", "nameToCapital", "nameToCurrency", "nameToPopulation", "nameToFounded", "neighborsToName", "nameToMap", "mapToName", "mapToSea", "mapToRiver", "seaToName", "riverToName", "nameToGov"]}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => isFootballMode(item.mode) || isLeadersMode(item.mode) || isMathMode(item.mode) || isAstroMode(item.mode)))}
        />
      )}
      {play.screen === "album" && (
        <AlbumScreen
          settings={play.quizSettings}
          stamps={play.stamps}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "lists" && (
        <CollectionsScreen
          world="geo"
          settings={play.quizSettings}
          tabs={GEO_HUB_TABS}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPlay={(collection, path) => play.startCollectionRound(collection, path)}
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
          includeExtras={play.quizSettings.includeExtras}
          includeEraStates={play.quizSettings.includeEraStates}
          eraYear={play.quizSettings.eraYear}
          power={play.quizPower}
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
          onWorlds={play.goToWorlds}
        />
      )}
      {play.screen === "results" && play.worldRecord ? (
        <RecordModal
          lang={play.quizSettings.lang}
          previousName={play.worldRecord.previousName}
          bonusXp={WORLD_RECORD_XP}
          onClose={() => play.setWorldRecord(null)}
        />
      ) : null}
    </>
  );
}
