import type { Metadata } from "next";
import { NotFoundPageView } from "../components/NotFoundView";
import { PAGE_COPY } from "../i18n/pages";
import { requestLang } from "../i18n/requestLang";
import { publicMetadata } from "../lib/pageMeta";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await requestLang();
  const copy = PAGE_COPY[lang];
  return {
    ...publicMetadata(lang, {
      title: copy.notFoundTitle,
      description: copy.notFoundLead,
      path: "/",
    }),
    robots: { index: false, follow: true },
  };
}

export default function NotFound() {
  return <NotFoundPageView />;
}
