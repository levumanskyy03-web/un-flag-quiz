"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizSettings } from "@/components/HomeScreen";
import { fetchAccount } from "@/lib/account";
import { createDuel } from "@/lib/duel";
import type { FactsDuelConfig } from "@/lib/factsRules";
import { STRINGS } from "@/i18n/strings";
import type { QuizMode } from "@/lib/quiz";
import { duelHref, normalizeDuelCode } from "./paths";

async function duelName(lang: QuizSettings["lang"]) {
  const account = await fetchAccount();
  if (account?.name) return account.name;
  return lang === "ru" ? "Игрок" : "Player";
}

function errorMessage(lang: QuizSettings["lang"], error: string) {
  const t = STRINGS[lang];
  if (error === "missing") return t.duelNotFound;
  if (error === "full") return t.duelFull;
  return t.duelOffline;
}

export function useDuelLaunch(settings: QuizSettings) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function create(modes: QuizMode[], facts?: FactsDuelConfig) {
    setError(null);
    const nextModes = modes.length > 0 ? modes : [settings.mode];
    const result = await createDuel({
      name: await duelName(settings.lang),
      modes: nextModes,
      region: facts?.region ?? settings.region,
      difficulty: facts ? "hard" : settings.difficulty,
      roundSize: facts ? facts.series : settings.roundSize,
      facts,
      includeExtras: settings.includeExtras,
    });
    if (!result.ok) {
      setError(errorMessage(settings.lang, result.error));
      return;
    }
    router.push(duelHref(result.room.code));
  }

  function join(code: string) {
    setError(null);
    const normalized = normalizeDuelCode(code);
    if (!normalized) {
      setError(STRINGS[settings.lang].duelNotFound);
      return;
    }
    router.push(duelHref(normalized));
  }

  return { error, create, join };
}
