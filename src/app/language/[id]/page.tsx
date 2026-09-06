import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguagePageView } from "../../../components/LanguageDetail";
import { languageById, languageName, languagesIndex } from "../../../data/languages";

export function generateStaticParams() {
  return languagesIndex().map((item) => ({ id: item.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const info = languageById(id);
  if (!info) return { title: "Язык — Паспорт страны" };
  const name = languageName(id, "ru");
  return {
    title: `${name} — Паспорт страны`,
    description: `Где говорят на языке «${name}»: карта ареала и страны, где доля говорящих не меньше 1 %.`,
  };
}

export default async function LanguagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const info = languageById(id);
  if (!info) notFound();
  return <LanguagePageView id={id} />;
}
