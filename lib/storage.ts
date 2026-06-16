import { HistoryEntry } from "@/types/signals";

const HISTORY_KEY = "signal_history";
const MAX_ENTRIES = 50;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    const limited = entries.slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
  } catch {
    /* ignore */
  }
}

export function addToHistory(entry: HistoryEntry): HistoryEntry[] {
  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  saveHistory(updated);
  return updated;
}

export function calcWinRate(entries: HistoryEntry[]): number {
  const resolved = entries.filter((e) => e.result !== "PENDING");
  if (!resolved.length) return 0;
  const wins = resolved.filter((e) => e.result === "WIN").length;
  return Math.round((wins / resolved.length) * 100);
}
