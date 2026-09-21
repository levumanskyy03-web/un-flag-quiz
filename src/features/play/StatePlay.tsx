"use client";

import { StateScreen } from "@/components/StateScreen";
import type { PlaySession } from "./session";

export function StatePlay({ play }: { play: PlaySession }) {
  return (
    <StateScreen lang={play.quizSettings.lang} onWorlds={play.goToWorlds} onPlay={play.startStateRound} />
  );
}
