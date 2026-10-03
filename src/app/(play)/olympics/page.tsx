import type { Metadata } from "next";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { PlayDocument } from "@/components/PlayDocument";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return publicMetadata(lang, { title: t.olympics, description: t.olySubtitle, path: "/olympics" });
}

export default async function OlympicsPage() {
  return <PlayDocument lang={await requestLang()} hub="olympics" />;
}
