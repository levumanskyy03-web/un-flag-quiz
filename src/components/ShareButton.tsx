"use client";

import { useState, type ReactNode } from "react";
import { STRINGS, type Lang } from "../i18n/strings";

interface ShareButtonProps {
  lang: Lang
  text: string
  url: string
  className?: string
  file?: () => Promise<File | null>
  children?: ReactNode | ((copied: boolean) => ReactNode)
}

export function ShareButton({ lang, text, url, className = "btn-secondary", file, children }: ShareButtonProps) {
  const t = STRINGS[lang];
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const message = text.includes(url) ? text : `${text}\n${url}`;
    const image = file ? await file().catch(() => null) : null;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        if (image) {
          try {
            if (canShare({ files: [image], text: message, url })) {
              await navigator.share({ files: [image], text: message, url });
              return;
            }
            if (canShare({ files: [image], text: message })) {
              await navigator.share({ files: [image], text: message });
              return;
            }
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
          }
        }
        await navigator.share({ text: message, url });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button type="button" className={className} aria-label={t.share} onClick={() => void onShare()}>
      {typeof children === "function" ? children(copied) : children ?? (copied ? t.shareCopied : t.share)}
    </button>
  );
}

function canShare(data: ShareData): boolean {
  return typeof navigator.canShare !== "function" || navigator.canShare(data);
}
