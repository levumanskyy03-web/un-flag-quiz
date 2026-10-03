import type { Metadata } from "next";
import { requestLang } from "@/i18n/requestLang";
import { STRINGS } from "@/i18n/strings";
import { PlayDocument } from "@/components/PlayDocument";
import { publicMetadata } from "@/lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const t = STRINGS[lang];
  return publicMetadata(lang, { title: t.empire, description: t.empireHint, path: "/empire" });
}

export default async function EmpirePage() {
  return <PlayDocument lang={await requestLang()} hub="empire" />;
}
