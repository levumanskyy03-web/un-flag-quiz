"use client";

import { EmpireScreen } from "@/components/EmpireScreen";
import type { PlaySession } from "./session";

export function EmpirePlay({ play }: { play: PlaySession }) {
  return <EmpireScreen lang={play.quizSettings.lang} onWorlds={play.goToWorlds} />;
}
