import type { Metadata } from "next";
import { PrivacyPageView } from "../../components/LegalPages";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Паспорт страны",
  description: "Какие данные собирает Паспорт страны и какие cookies использует.",
};

export default function PrivacyPage() {
  return <PrivacyPageView />;
}
