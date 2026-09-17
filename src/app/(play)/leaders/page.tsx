import type { Metadata } from "next";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return publicMetadata(lang, { title: t.leaders, description: t.leadersSubtitle, path: "/leaders" });
}

export default function LeadersPage() {
  return null;
}
