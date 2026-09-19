"use client";

import { CompanyScreen } from "@/components/CompanyScreen";
import type { PlaySession } from "./session";

export function CompanyPlay({ play }: { play: PlaySession }) {
  return <CompanyScreen lang={play.quizSettings.lang} onWorlds={play.goToWorlds} />;
}
