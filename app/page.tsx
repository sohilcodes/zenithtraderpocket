"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SignalData } from "@/types/signals";
import { fetchSignals, getWsUrl } from "@/lib/api";
import { addToHistory, loadHistory, saveHistory } from "@/lib/storage";
import { HistoryEntry } from "@/types/signals";
import Navbar from "@/components/Navbar";
import SignalCard from "@/components/SignalCard";
import HistoryTable from "@/components/HistoryTable";

const REFRESH_INTERVAL = 30;

export default function Dashboard() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const loadSignals = useCallback(async () => {
    try {
      const data = await fetchSignals();
      if (data) {
        setSignals(data.signals);
        setLastUpdated(data.timestamp);
        setIsDemo(data.mode === "DEMO");
        setError(null);
      } else {
        setError("Backend unreachable — showing last data");
      }
    } catch {
      setError("Failed to load signals");
    } finally {
      setLoading(false);
    }
  }, []);

  const startCountdown = useCallback(() => {
    setRefreshIn(REFRESH_INTERVAL);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setRefreshIn((prev) => {
        if (prev <= 1) {
          loadSignals();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
  }, [loadSignals]);

  // Initial load
  useEffect(() => {
    loadSignals().then(() => startCountdown());
    setHistory(loadHistory());

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [loadSignals, startCountdown]);

  // WebSocket
  useEffect(() => {
    const wsUrl = getWsUrl();
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          const ping = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send("ping");
          }, 25000);
          ws.addEventListener("close", () => clearInterval(ping));
        };

        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type === "signals_update" && msg.data?.length) {
              setSignals(msg.data);
              setLastUpdated(msg.timestamp);
              setIsDemo(msg.data[0]?.is_demo ?? true);
              startCountdown();
            }
          } catch {/* ignore */}
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 5000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [startCountdown]);

  const handleAddHistory = useCallback((signal: SignalData) => {
    const entry: HistoryEntry = {
      id: `${signal.pair}-${Date.now()}`,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      pair: signal.pair,
      signal: signal.signal,
      entryPrice: signal.price,
      predictedDirection: signal.prediction.direction,
      rsi: signal.rsi,
      result: "PENDING",
      timestamp: Date.now(),
    };
    const updated = addToHistory(entry);
    setHistory(updated);
  }, []);

  const handleUpdateResult = useCallback(
    (id: string, result: "WIN" | "LOSS") => {
      setHistory((prev) => {
        const updated = prev.map((e) => (e.id === id ? { ...e, result } : e));
        saveHistory(updated);
        return updated;
      });
    },
    []
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0d1117" }}>
      <Navbar
        lastUpdated={lastUpdated}
        isConnected={isConnected}
        isDemo={isDemo}
        refreshIn={refreshIn}
      />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Error banner */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(248,81,73,0.1)",
              border: "1px solid #f8514944",
              borderRadius: "8px",
              padding: "10px 16px",
              marginBottom: "16px",
              fontSize: "12px",
              color: "#f85149",
              fontFamily: "monospace",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>⚠ {error}</span>
            <button
              onClick={loadSignals}
              style={{
                fontSize: "11px",
                color: "#58a6ff",
                background: "none",
                border: "1px solid #58a6ff44",
                borderRadius: "4px",
                padding: "2px 10px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: "#58a6ff",
              padding: "80px 20px",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⟳</div>
            Loading signals…
          </div>
        )}

        {/* Signals grid */}
        {!loading && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {signals.map((signal) => (
                <SignalCard
                  key={signal.pair}
                  signal={signal}
                  onAddHistory={handleAddHistory}
                />
              ))}
            </div>

            {/* History */}
            <div style={{ marginBottom: "16px" }}>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#8b949e",
                  letterSpacing: "0.12em",
                  marginBottom: "12px",
                  fontFamily: "monospace",
                }}
              >
                SIGNAL HISTORY
              </h2>
              <HistoryTable
                entries={history}
                onUpdateResult={handleUpdateResult}
              />
            </div>
          </>
        )}

        {/* Disclaimer */}
        <footer
          style={{
            marginTop: "40px",
            paddingTop: "16px",
            borderTop: "1px solid #21262d",
            textAlign: "center",
            color: "#484f58",
            fontSize: "11px",
            fontFamily: "monospace",
            lineHeight: 1.6,
          }}
        >
          Created By Zenith Trader / Sohil Codes
        </footer>
      </main>
    </div>
  );
                  }
