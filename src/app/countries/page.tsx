import type { Metadata } from "next";
import { CountriesPageView } from "../../components/CountriesIndex";
import { COUNTRIES } from "../../data/countries";
import { PAGE_COPY } from "../../i18n/pages";
import { requestLang } from "../../i18n/requestLang";
import { publicMetadata } from "../../lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  return publicMetadata(lang, {
    title: copy.catalogTitle,
    description: copy.catalogLead(COUNTRIES.length),
    path: "/countries",
  });
}

export default function CountriesPage() {
  return <CountriesPageView />;
}
