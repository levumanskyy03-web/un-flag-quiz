import type { Metadata } from "next";
import { TodayPageView } from "../../components/TodayPageView";
import { PAGE_COPY } from "../../i18n/pages";
import { requestLang } from "../../i18n/requestLang";
import { STRINGS } from "../../i18n/strings";
import { countryOfTheDay } from "../../lib/countryCatalog";
import { publicMetadata } from "../../lib/pageMeta";
import { countryName } from "../../lib/quiz/core";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  const t = STRINGS[lang];
  const country = countryOfTheDay();
  const name = countryName(country, lang);
  return publicMetadata(lang, {
    title: `${t.legalToday}: ${name}`,
    description: `${copy.catalogToday} ${name}. ${copy.playQuiz}`,
    path: "/today",
  });
}

export default function TodayPage() {
  return <TodayPageView />;
}
