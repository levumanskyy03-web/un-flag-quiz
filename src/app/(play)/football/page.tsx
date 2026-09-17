import type { Metadata } from "next";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return publicMetadata(lang, { title: t.football, description: t.subtitle, path: "/football" });
}

export default function FootballPage() {
  return null;
}
