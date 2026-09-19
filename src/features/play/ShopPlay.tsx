"use client";

import { ShopScreen } from "@/components/ShopScreen";
import type { PlaySession } from "./session";

export function ShopPlay({ play }: { play: PlaySession }) {
  return <ShopScreen lang={play.quizSettings.lang} onWorlds={play.goToWorlds} />;
}
