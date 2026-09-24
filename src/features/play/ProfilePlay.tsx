"use client";

import { ProfileScreen } from "@/components/ProfileScreen";
import { useDuelLaunch } from "@/features/duel/useDuelLaunch";
import type { PlaySession } from "./session";

export function ProfilePlay({ play }: { play: PlaySession }) {
  const duel = useDuelLaunch(play.quizSettings);
  return (
    <ProfileScreen
      settings={play.quizSettings}
      history={play.history}
      bests={play.bests}
      levelClears={play.levelClears}
      error={duel.error}
      onWorlds={play.goToWorlds}
      onLangChange={play.handleSettingsChange}
      onClearBests={play.handleClearBests}
      onCreate={(modes) => void duel.create(modes)}
      onJoin={duel.join}
    />
  );
}
