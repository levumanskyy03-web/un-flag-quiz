import type { Metadata } from "next";
import { CountriesPageView } from "../../components/CountriesIndex";

export const metadata: Metadata = {
  title: "Страны — Паспорт страны",
  description: "Паспорта всех 193 государств ООН: флаг, столица, валюта, факт.",
};

export default function CountriesPage() {
  return <CountriesPageView />;
}
