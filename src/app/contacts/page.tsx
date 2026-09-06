import type { Metadata } from "next";
import { ContactsPageView } from "../../components/LegalPages";

export const metadata: Metadata = {
  title: "Контакты — Паспорт страны",
  description: "Связь с автором викторины Паспорт страны.",
};

export default function ContactsPage() {
  return <ContactsPageView />;
}
