import type { Metadata } from "next";
import { TodayPageView } from "../../components/TodayPageView";
import { countryOfTheDay } from "../../lib/countryCatalog";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const country = countryOfTheDay();
  return {
    title: `Страна дня — ${country.nameRu} — Паспорт страны`,
    description: `Сегодня в паспорте: ${country.nameRu}. Флаг, столица, факт и ссылка на викторину.`,
  };
}

export default function TodayPage() {
  return <TodayPageView />;
}
