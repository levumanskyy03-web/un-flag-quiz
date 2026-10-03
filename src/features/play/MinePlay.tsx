"use client";

import { MineScreen } from "@/components/MineScreen";
import type { Lang } from "@/i18n/strings";
import type { QuizMode } from "@/lib/quiz";

export function MinePlay({
  lang,
  onWorlds,
  onPlay,
}: {
  lang: Lang;
  onWorlds: () => void;
  onPlay: (mode: QuizMode) => void;
}) {
  return <MineScreen lang={lang} onWorlds={onWorlds} onPlay={onPlay} />;
}
