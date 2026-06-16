import { ApiResponse, SignalData } from "@/types/signals";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchSignals(): Promise<ApiResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/signals`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchSignals error:", err);
    return null;
  }
}

export async function fetchSignalByPair(
  pair: string
): Promise<SignalData | null> {
  try {
    const encoded = pair.replace("/", "-");
    const res = await fetch(`${API_URL}/api/signals/${encoded}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.signal || null;
  } catch (err) {
    console.error("fetchSignalByPair error:", err);
    return null;
  }
}

export function getWsUrl(): string {
  const base = API_URL.replace("https://", "wss://").replace(
    "http://",
    "ws://"
  );
  return `${base}/ws`;
}
