"use client";

import { ProfileScreen } from "@/components/ProfileScreen";
import type { PlaySession } from "./session";

export function ProfilePlay({ play }: { play: PlaySession }) {
  return (
    <ProfileScreen
      settings={play.quizSettings}
      history={play.history}
      bests={play.bests}
      levelClears={play.levelClears}
      onWorlds={play.goToWorlds}
      onLangChange={play.handleSettingsChange}
      onClearBests={play.handleClearBests}
    />
  );
}
