"use client";

import { useEffect, useState } from "react";

interface EntryTimerProps {
  initialSeconds: number;
}

export default function EntryTimer({ initialSeconds }: EntryTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const pct = Math.max(0, (seconds / 60) * 100);
  const urgent = seconds <= 10;
  const color = urgent ? "#f85149" : seconds <= 20 ? "#d29922" : "#3fb950";

  if (seconds <= 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize: "11px",
            color: "#f85149",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          ⚡ ENTER NOW
        </span>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#8b949e" }}>Entry Timer</span>
        <span style={{ fontSize: "12px", color, fontWeight: 700 }}>
          Enter in {seconds}s
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "3px",
          backgroundColor: "#30363d",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "2px",
            transition: "width 1s linear, background-color 0.3s",
          }}
        />
      </div>
    </div>
  );
}
