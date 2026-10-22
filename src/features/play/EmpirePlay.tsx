"use client";

import { EmpireScreen } from "@/components/EmpireScreen";
import { WorldsBack } from "@/components/WorldsBack";
import { STRINGS } from "@/i18n/strings";
import { EMPIRE_VISIBLE } from "@/lib/empire/visible";
import type { PlaySession } from "./session";

/** Empire stays closed until the town game is ready to ship again. */
const EMPIRE_OPEN = false;

export function EmpirePlay({ play }: { play: PlaySession }) {
  if (!EMPIRE_VISIBLE) return null;
  if (EMPIRE_OPEN) return <EmpireScreen lang={play.quizSettings.lang} onWorlds={play.goToWorlds} />;
  const lang = play.quizSettings.lang;
  const t = STRINGS[lang];
  return (
    <div className="screen home-screen">
      <header className="home-header">
        <WorldsBack lang={lang} onClick={play.goToWorlds} />
        <h1>{t.empire}</h1>
        <p className="subtitle">{t.studioUnavailable}</p>
      </header>
    </div>
  );
}
