import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { langDir, localeTag } from "../i18n/lang";
import { requestLang } from "../i18n/requestLang";
import { SiteAudio } from "../components/SiteAudio";
import { homeMetadata } from "../lib/pageMeta";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sans",
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
  return (
    <html lang={localeTag(lang)} dir={langDir(lang)} suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${plusJakarta.className}`}>
        <SiteAudio />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
