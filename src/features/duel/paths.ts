import { isFootballMode, worldOfMode, type QuizMode } from "@/lib/quiz";
import type { DuelView } from "@/lib/duelTypes";

export function duelHref(code: string): string {
  return `/duel/${code.trim().toUpperCase()}`;
}

export function normalizeDuelCode(value: string): string | null {
  const code = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return code.length === 4 ? code : null;
}

export function duelWorldHref(room: DuelView | null): string {
  if (!room) return "/";
  const mode = room.modes[0] ?? room.mode;
  if (room.modes.some(isFootballMode) || isFootballMode(mode)) return "/football";
  return `/${worldOfMode(mode)}`;
}

export function duelIsFootball(room: DuelView | null): boolean {
  if (!room) return false;
  const mode: QuizMode = room.modes[0] ?? room.mode;
  return room.modes.some(isFootballMode) || isFootballMode(mode);
}
