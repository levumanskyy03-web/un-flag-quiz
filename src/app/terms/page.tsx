import type { Metadata } from "next";
import { TermsPageView } from "../../components/LegalPages";
import { PAGE_COPY } from "../../i18n/pages";
import { requestLang } from "../../i18n/requestLang";
import { publicMetadata } from "../../lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  return publicMetadata(lang, {
    title: copy.termsTitle,
    description: copy.terms[0],
    path: "/terms",
  });
}

export default function TermsPage() {
  return <TermsPageView />;
}
