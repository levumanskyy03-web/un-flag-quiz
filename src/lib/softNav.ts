import { flushSync } from "react-dom";

function canViewTransition() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Crossfade DOM updates (world/hub/screen) instead of a hard cut. */
export function softNav(apply: () => void) {
  if (!canViewTransition()) {
    apply();
    return;
  }
  const active = (document as Document & { activeViewTransition?: unknown }).activeViewTransition
  if (active) {
    apply();
    return;
  }
  try {
    document.startViewTransition(() => {
      flushSync(apply);
    });
  } catch {
    apply();
  }
}
