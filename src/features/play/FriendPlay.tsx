"use client";

import { FriendScreen } from "@/components/FriendScreen";
import { useDuelLaunch } from "@/features/duel/useDuelLaunch";
import type { PlaySession } from "./session";

export function FriendPlay({ play }: { play: PlaySession }) {
  const duel = useDuelLaunch(play.quizSettings);
  return (
    <FriendScreen
      settings={play.quizSettings}
      error={duel.error}
      onWorlds={play.goToWorlds}
      onCreate={(modes) => void duel.create(modes)}
      onJoin={duel.join}
    />
  );
}
