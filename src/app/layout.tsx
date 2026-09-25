import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import { AdScripts } from "../components/AdScripts";
import { CookieNotice } from "../components/CookieNotice";
import { LangPrompt } from "../components/LangPrompt";
import { SiteAudio } from "../components/SiteAudio";
import { isLang, langDir, localeTag, SITE_LANG_KEY } from "../i18n/lang";
import { requestLang } from "../i18n/requestLang";
import { COOKIE_NOTICE_KEY, cookieNoticeSeen } from "../lib/cookieConsent";
import { homeMetadata } from "../lib/pageMeta";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["cyrillic", "latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-display",
});

export async function generateMetadata(): Promise<Metadata> {
  return homeMetadata(await requestLang());
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await requestLang();
  const jar = await cookies();
  const cookieNoticeDismissed = cookieNoticeSeen(jar.get(COOKIE_NOTICE_KEY)?.value);
  const askLang = !isLang(jar.get(SITE_LANG_KEY)?.value);
  return (
    <html lang={localeTag(lang)} dir={langDir(lang)} suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${plusJakarta.className} ${nunito.variable}`}>
        <SiteAudio />
        {children}
        <LangPrompt ask={askLang} />
        <CookieNotice lang={lang} dismissed={cookieNoticeDismissed} />
        <AdScripts />
        <Analytics />
      </body>
    </html>
  );
}
