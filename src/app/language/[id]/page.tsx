import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguagePageView } from "../../../components/LanguageDetail";
import { languageById, languageName, languagesIndex } from "../../../data/languages";
import { PAGE_COPY } from "../../../i18n/pages";
import { requestLang } from "../../../i18n/requestLang";
import { publicMetadata } from "../../../lib/pageMeta";

export function generateStaticParams() {
  return languagesIndex().map((item) => ({ id: item.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  const { id } = await params;
  const info = languageById(id);
  if (!info) {
    return publicMetadata(lang, {
      title: copy.languagesTitle,
      description: copy.languagesLead,
      path: "/languages",
    });
  }
  const name = languageName(id, lang);
  return publicMetadata(lang, {
    title: name,
    description: `${copy.languageRange(name)}. ${copy.languageCountries}`,
    path: `/language/${id}`,
  });
}

export default async function LanguagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const info = languageById(id);
  if (!info) notFound();
  return <LanguagePageView id={id} />;
}
