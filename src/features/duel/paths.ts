import { isFootballMode, isLeadersMode, isMathMode, isAstroMode, worldOfMode, type QuizMode, type QuizWorld } from "@/lib/quiz";
import type { DuelView } from "@/lib/duelTypes";

export const MULTIPLAYER_HREF = "/multiplayer";

export function duelHref(code: string): string {
  return `/duel/${code.trim().toUpperCase()}`;
}

export function normalizeDuelCode(value: string): string | null {
  const code = value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return code.length === 4 ? code : null;
}

export function duelWorldHref(_room: DuelView | null): string {
  return MULTIPLAYER_HREF;
}

export function duelPlayWorld(room: DuelView | null): QuizWorld {
  if (!room) return 'geo'
  const mode: QuizMode = room.modes[0] ?? room.mode
  if (room.modes.some(isFootballMode) || isFootballMode(mode)) return 'football'
  if (room.modes.some(isLeadersMode) || isLeadersMode(mode)) return 'leaders'
  if (room.modes.some(isMathMode) || isMathMode(mode)) return 'math'
  if (room.modes.some(isAstroMode) || isAstroMode(mode)) return 'astronomy'
  return worldOfMode(mode)
}

export function duelIsFootball(room: DuelView | null): boolean {
  return duelPlayWorld(room) === 'football';
}
