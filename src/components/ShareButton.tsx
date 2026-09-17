"use client";

import { useState } from "react";
import { STRINGS, type Lang } from "../i18n/strings";

interface ShareButtonProps {
  lang: Lang
  text: string
  url: string
  className?: string
}

export function ShareButton({ lang, text, url, className = "btn-secondary" }: ShareButtonProps) {
  const t = STRINGS[lang];
  const [copied, setCopied] = useState(false);

  async function onShare() {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ text, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(`${text}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className={className} onClick={() => void onShare()}>
      {copied ? t.shareCopied : t.share}
    </button>
  );
}
