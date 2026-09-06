import type { Metadata } from "next";
import { AboutPageView } from "../../components/LegalPages";

export const metadata: Metadata = {
  title: "О проекте — Паспорт страны",
  description: "Викторина по странам ООН: флаги, столицы, карты и футбол.",
};

export default function AboutPage() {
  return <AboutPageView />;
}
