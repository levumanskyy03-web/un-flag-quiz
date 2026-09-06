import type { Metadata } from "next";
import { LanguagesPageView } from "../../components/LanguagesIndex";

export const metadata: Metadata = {
  title: "Языки — Паспорт страны",
  description: "Языки государств ООН: ареал говорящих и страны, где доля не меньше 1 % населения.",
};

export default function LanguagesPage() {
  return <LanguagesPageView />;
}
