import type { Metadata } from "next";
import { DuelApp } from "@/features/duel/DuelApp";

export const metadata: Metadata = {
  title: "Дуэль — Паспорт страны",
};

export default async function DuelPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <DuelApp key={code} code={code} />;
}
