"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isLang, langDir, localeTag, type Lang } from "./lang";

export const SITE_LANG_KEY = "un-flag-quiz-lang";

export function getStoredLang(): Lang {
  if (typeof localStorage === "undefined") return "ru";
  const stored = localStorage.getItem(SITE_LANG_KEY);
  return isLang(stored) ? stored : "ru";
}

function setStoredLang(lang: Lang) {
  localStorage.setItem(SITE_LANG_KEY, lang);
  window.dispatchEvent(new Event("storage"));
}

const SiteLangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "ru",
  setLang: () => {},
});

export function SiteLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    setLangState(getStoredLang());
    const onChange = () => setLangState(getStoredLang());
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setStoredLang(next);
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
