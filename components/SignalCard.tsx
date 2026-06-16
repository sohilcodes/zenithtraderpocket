"use client";

import { useState } from "react";
import { SignalData } from "@/types/signals";
import Sparkline from "./Sparkline";
import RSIBar from "./RSIBar";
import EntryTimer from "./EntryTimer";
import FullChart from "./FullChart";

interface SignalCardProps {
  signal: SignalData;
  onAddHistory: (signal: SignalData) => void;
}

const SIGNAL_STYLES = {
  BUY: {
    bg: "rgba(63,185,80,0.12)",
    border: "#3fb950",
    color: "#3fb950",
    label: "▲ BUY",
  },
  SELL: {
    bg: "rgba(248,81,73,0.12)",
    border: "#f85149",
    color: "#f85149",
    label: "▼ SELL",
  },
  WAIT: {
    bg: "rgba(210,153,34,0.12)",
    border: "#d29922",
    color: "#d29922",
    label: "◆ WAIT",
  },
};

const CROSS_LABELS: Record<string, { label: string; color: string }> = {
  GOLDEN_CROSS: { label: "GOLDEN ✦", color: "#3fb950" },
  DEATH_CROSS: { label: "DEATH ✦", color: "#f85149" },
  BULLISH: { label: "BULLISH ↑", color: "#56d364" },
  BEARISH: { label: "BEARISH ↓", color: "#ff7b72" },
};

export default function SignalCard({ signal, onAddHistory }: SignalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const style = SIGNAL_STYLES[signal.signal];
  const cross = CROSS_LABELS[signal.crossover_status] || {
    label: signal.crossover_status,
    color: "#8b949e",
  };
  const priceUp = signal.price_change_pct >= 0;

  const handleAddToHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddHistory(signal);
  };

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        style={{
          backgroundColor: "#161b22",
          border: `1px solid ${style.border}33`,
          borderRadius: "10px",
          padding: "16px",
          cursor: "pointer",
          transition: "border-color 0.2s, transform 0.15s",
          animation: "fadeIn 0.3s ease-in-out",
          fontFamily: "monospace",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = style.border;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = `${style.border}33`;
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "14px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#e6edf3",
                letterSpacing: "0.05em",
              }}
            >
              {signal.flags} {signal.pair}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px", alignItems: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#e6edf3" }}>
                {signal.price.toFixed(5)}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: priceUp ? "#3fb950" : "#f85149",
                  fontWeight: 600,
                }}
              >
                {priceUp ? "+" : ""}
                {signal.price_change_pct.toFixed(3)}%
              </span>
            </div>
          </div>

          {/* Signal badge */}
          <div
            style={{
              backgroundColor: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: "6px",
              padding: "6px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 800, color: style.color, letterSpacing: "0.1em" }}>
              {style.label}
            </div>
            <div style={{ fontSize: "10px", color: style.color, opacity: 0.8 }}>
              {signal.confidence}
            </div>
          </div>
        </div>

        {/* Prediction row */}
        <div
          style={{
            backgroundColor: "#0d1117",
            borderRadius: "6px",
            padding: "8px 12px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: "10px", color: "#8b949e", marginBottom: "2px" }}>
              Next Candle
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color:
                  signal.prediction.direction === "UP" ? "#3fb950" : "#f85149",
              }}
            >
              {signal.prediction.direction === "UP" ? "▲ UP" : "▼ DOWN"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#8b949e", marginBottom: "2px" }}>
              Confidence
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#58a6ff" }}>
              {signal.prediction.confidence}%
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#8b949e", marginBottom: "2px" }}>
              EMA Cross
            </div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: cross.color }}>
              {cross.label}
            </div>
          </div>
        </div>

        {/* RSI bar */}
        <div style={{ marginBottom: "12px" }}>
          <RSIBar value={signal.rsi} />
        </div>

        {/* Entry timer */}
        <div style={{ marginBottom: "12px" }}>
          <EntryTimer initialSeconds={signal.entry_timer} />
        </div>

        {/* Sparkline + EMAs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4px",
          }}
        >
          <Sparkline data={signal.sparkline} width={120} height={36} />
          <div style={{ textAlign: "right", fontSize: "10px" }}>
            <div style={{ color: "#f85149", marginBottom: "2px" }}>
              EMA9 {signal.ema9.toFixed(4)}
            </div>
            <div style={{ color: "#58a6ff", marginBottom: "2px" }}>
              EMA21 {signal.ema21.toFixed(4)}
            </div>
            <div style={{ color: "#8b949e" }}>
              EMA50 {signal.ema50.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #30363d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "10px", color: "#8b949e" }}>
            {signal.reason}
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={handleAddToHistory}
              style={{
                fontSize: "10px",
                color: "#58a6ff",
                backgroundColor: "transparent",
                border: "1px solid #58a6ff44",
                borderRadius: "4px",
                padding: "2px 8px",
                cursor: "pointer",
              }}
            >
              + Track
            </button>
            <span style={{ fontSize: "10px", color: "#58a6ff" }}>
              ↗ Details
            </span>
          </div>
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <FullChart signal={signal} onClose={() => setExpanded(false)} />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
                         }
