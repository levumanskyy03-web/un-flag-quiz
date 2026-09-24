"use client";

import { MultiplayerScreen } from "@/components/MultiplayerScreen";
import { useDuelLaunch } from "@/features/duel/useDuelLaunch";
import type { PlaySession } from "./session";

export function MultiplayerPlay({ play }: { play: PlaySession }) {
  const duel = useDuelLaunch(play.quizSettings);
  return (
    <MultiplayerScreen
      settings={play.quizSettings}
      onWorlds={play.goToWorlds}
      onMatch={(modes) => void duel.match(modes)}
    />
  );
}
