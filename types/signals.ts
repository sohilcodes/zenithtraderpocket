export interface Prediction {
  direction: "UP" | "DOWN";
  confidence: number;
  pattern: string;
  score: number;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

export interface SignalData {
  pair: string;
  flags: string;
  price: number;
  price_change_pct: number;
  signal: "BUY" | "SELL" | "WAIT";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  prediction: Prediction;
  entry_timer: number;
  rsi: number;
  ema9: number;
  ema21: number;
  ema50: number;
  crossover_status: "GOLDEN_CROSS" | "DEATH_CROSS" | "BULLISH" | "BEARISH";
  sparkline: number[];
  candles: Candle[];
  is_demo: boolean;
  last_updated: number;
}

export interface ApiResponse {
  status: string;
  mode: "LIVE" | "DEMO";
  count: number;
  signals: SignalData[];
  timestamp: number;
}

export interface HistoryEntry {
  id: string;
  time: string;
  pair: string;
  signal: "BUY" | "SELL" | "WAIT";
  entryPrice: number;
  predictedDirection: "UP" | "DOWN";
  rsi: number;
  result: "WIN" | "LOSS" | "PENDING";
  timestamp: number;
}
