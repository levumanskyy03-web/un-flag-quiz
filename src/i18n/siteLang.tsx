"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { langDir, localeTag, type Lang } from "./lang";
import { persistLang, readStoredLang } from "./persistLang";

export { SITE_LANG_KEY } from "./lang";

export function getStoredLang(): Lang {
  return readStoredLang() ?? "ru";
}

const SiteLangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "ru",
  setLang: () => {},
});

export function SiteLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const stored = readStoredLang();
    if (stored) setLangState(stored);
    const onChange = () => {
      const next = readStoredLang();
      if (next) setLangState(next);
    };
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);

  const setLang = useCallback((next: Lang) => {
    persistLang(next);
    setLangState(next);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = localeTag(lang);
    document.documentElement.dir = langDir(lang);
  }, [lang]);

  return <SiteLangContext.Provider value={value}>{children}</SiteLangContext.Provider>;
}

export function useSiteLang() {
  return useContext(SiteLangContext);
}
