"use client";

import { useEffect, useRef } from "react";
import { SignalData } from "@/types/signals";

interface FullChartProps {
  signal: SignalData;
  onClose: () => void;
}

export default function FullChart({ signal, onClose }: FullChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !signal.candles.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const padLeft = 60;
    const padRight = 10;
    const padTop = 20;
    const padBottom = 30;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, W, H);

    const candles = signal.candles.slice(-40);
    const closes = candles.map((c) => c.close);
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);

    // EMA lines from closes
    const ema = (data: number[], period: number) => {
      const k = 2 / (period + 1);
      const result: number[] = [];
      let prev = data[0];
      data.forEach((val) => {
        const e = val * k + prev * (1 - k);
        result.push(e);
        prev = e;
      });
      return result;
    };

    const ema9 = ema(closes, 9);
    const ema21 = ema(closes, 21);

    const allPrices = [...highs, ...lows, ...ema9, ...ema21];
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const priceRange = maxP - minP || 1;

    const toY = (price: number) =>
      padTop + ((maxP - price) / priceRange) * (H - padTop - padBottom);

    const candleW = Math.max(3, ((W - padLeft - padRight) / candles.length) * 0.6);
    const step = (W - padLeft - padRight) / candles.length;

    // Grid
    ctx.strokeStyle = "#21262d";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (i / 4) * (H - padTop - padBottom);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();

      const price = maxP - (i / 4) * priceRange;
      ctx.fillStyle = "#8b949e";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(price.toFixed(5), padLeft - 4, y + 3);
    }

    // Candles
    candles.forEach((c, i) => {
      const x = padLeft + i * step + step / 2;
      const openY = toY(c.open);
      const closeY = toY(c.close);
      const highY = toY(c.high);
      const lowY = toY(c.low);
      const bull = c.close >= c.open;
      const color = bull ? "#3fb950" : "#f85149";

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyH = Math.max(Math.abs(closeY - openY), 1);
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });

    // EMA9
    ctx.strokeStyle = "#f85149";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ema9.forEach((val, i) => {
      const x = padLeft + i * step + step / 2;
      const y = toY(val);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // EMA21
    ctx.strokeStyle = "#58a6ff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ema21.forEach((val, i) => {
      const x = padLeft + i * step + step / 2;
      const y = toY(val);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Legend
    ctx.font = "11px monospace";
    ctx.fillStyle = "#f85149";
    ctx.fillText("── EMA9", padLeft + 4, padTop + 14);
    ctx.fillStyle = "#58a6ff";
    ctx.fillText("── EMA21", padLeft + 70, padTop + 14);
  }, [signal]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "800px",
          width: "100%",
          fontFamily: "monospace",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div>
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#e6edf3" }}>
              {signal.flags} {signal.pair}
            </span>
            <span style={{ marginLeft: "12px", fontSize: "14px", color: "#8b949e" }}>
              Full Chart (Last 40 Candles)
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #30363d",
              color: "#8b949e",
              cursor: "pointer",
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={740}
          height={320}
          style={{ width: "100%", height: "auto", borderRadius: "6px" }}
        />

        <div
          style={{
            marginTop: "14px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {[
            { label: "RSI(14)", val: signal.rsi.toFixed(1), color: signal.rsi < 30 ? "#3fb950" : signal.rsi > 70 ? "#f85149" : "#58a6ff" },
            { label: "EMA9", val: signal.ema9.toFixed(5), color: "#f85149" },
            { label: "EMA21", val: signal.ema21.toFixed(5), color: "#58a6ff" },
            { label: "EMA50", val: signal.ema50.toFixed(5), color: "#8b949e" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: "#0d1117",
                borderRadius: "6px",
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "10px", color: "#8b949e", marginBottom: "4px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: item.color }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
        }
