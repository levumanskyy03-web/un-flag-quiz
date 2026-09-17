import type { Metadata } from "next";
import { DuelApp } from "@/features/duel/DuelApp";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return {
    ...publicMetadata(lang, { title: t.duel, description: t.duelHint, path: "/duel" }),
    robots: { index: false, follow: false },
  };
}

export default async function DuelPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <DuelApp key={code} code={code} />;
}
