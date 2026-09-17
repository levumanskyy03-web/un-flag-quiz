import type { Metadata } from "next";
import { LanguagesPageView } from "../../components/LanguagesIndex";
import { PAGE_COPY } from "../../i18n/pages";
import { requestLang } from "../../i18n/requestLang";
import { publicMetadata } from "../../lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  return publicMetadata(lang, {
    title: copy.languagesTitle,
    description: copy.languagesLead,
    path: "/languages",
  });
}

export default function LanguagesPage() {
  return <LanguagesPageView />;
}
