"use client";

import { AlbumScreen } from "@/components/AlbumScreen";
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
import { useDuelLaunch } from "@/features/duel/useDuelLaunch";
import { clearMistakes } from "@/lib/mistakes";
import { WORLD_RECORD_XP } from "@/lib/xp";
import {
  campaignLevelCount,
  campaignLevelNumbers,
  isCodesMode,
  isFactsToName,
  isFootballMode,
  isLeadersMode,
  isWaterMode,
} from "@/lib/quiz";
import type { PlaySession } from "./session";

export function GeoPlay({ play }: { play: PlaySession }) {
  const duel = useDuelLaunch(play.quizSettings);
  return (
    <>
      {play.screen === "home" && (
        <HomeScreen
          settings={play.quizSettings}
          history={play.history}
          bests={play.bests}
          levelClears={play.levelClears}
          xp={play.xp}
          xpReady={play.xpReady}
          duelError={duel.error}
          onChange={play.handleSettingsChange}
          onStart={play.startRound}
          onCreateDuel={(modes, facts) => void duel.create(modes, facts)}
          onJoinDuel={duel.join}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearHistory={play.handleClearHistory}
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
          levels={
            isWaterMode(play.quizSettings.mode) ? campaignLevelNumbers(play.quizSettings.mode) : undefined
          }
          onChange={play.handleSettingsChange}
          onPlay={play.playLevel}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearBests={play.handleClearBests}
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
          modes={["flagToName", "nameToFlag", "nameToCapital", "nameToCurrency", "nameToPopulation", "nameToFounded", "neighborsToName", "nameToMap", "mapToName", "mapToSea", "mapToRiver", "seaToName", "riverToName"]}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onPractice={play.startMistakesPractice}
          onClear={() => play.setMistakeList(clearMistakes((item) => isFootballMode(item.mode) || isCodesMode(item.mode) || isLeadersMode(item.mode)))}
        />
      )}
      {play.screen === "album" && (
        <AlbumScreen
          settings={play.quizSettings}
          stamps={play.stamps}
          history={play.history}
          bests={play.bests}
          levelClears={play.levelClears}
          xp={play.xp}
          xpReady={play.xpReady}
          onChange={play.handleSettingsChange}
          onHub={play.goHub}
          onWorlds={play.goToWorlds}
          onClearBests={play.handleClearBests}
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
