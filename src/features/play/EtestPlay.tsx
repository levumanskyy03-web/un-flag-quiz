"use client";

import { EtestScreen } from "@/components/EtestScreen";
import type { Lang } from "@/i18n/strings";

export function EtestPlay({
  lang,
  onWorlds,
  onStart,
}: {
  lang: Lang;
  onWorlds: () => void;
  onStart: (index: number) => void;
}) {
  return <EtestScreen lang={lang} onWorlds={onWorlds} onStart={onStart} />;
}
