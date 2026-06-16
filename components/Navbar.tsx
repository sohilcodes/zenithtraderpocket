"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  lastUpdated: number | null;
  isConnected: boolean;
  isDemo: boolean;
  refreshIn: number;
}

export default function Navbar({
  lastUpdated,
  isConnected,
  isDemo,
  refreshIn,
}: NavbarProps) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    if (!lastUpdated) return;
    const d = new Date(lastUpdated * 1000);
    setTimeStr(
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, [lastUpdated]);

  return (
    <nav
      style={{
        backgroundColor: "#161b22",
        borderBottom: "1px solid #30363d",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 16px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {/* Left — live dot + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative", width: 10, height: 10 }}>
            <span
              style={{
                display: "block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: isConnected ? "#3fb950" : "#8b949e",
              }}
            />
            {isConnected && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  backgroundColor: "#3fb950",
                  animation: "ping 1.5s ease-out infinite",
                  opacity: 0.6,
                }}
              />
            )}
          </div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#e6edf3",
              fontFamily: "monospace",
            }}
          >
            SIGNAL DASHBOARD
          </span>
        </div>

        {/* Right — status chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          {timeStr && (
            <span style={{ fontSize: "11px", color: "#8b949e" }}>
              Updated {timeStr}
            </span>
          )}

          <span
            style={{
              fontSize: "11px",
              color: "#8b949e",
              backgroundColor: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: "4px",
              padding: "2px 8px",
            }}
          >
            {refreshIn > 0 ? `↻ ${refreshIn}s` : "Refreshing…"}
          </span>

          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 10px",
              borderRadius: "4px",
              backgroundColor: isDemo
                ? "rgba(210,153,34,0.15)"
                : "rgba(63,185,80,0.15)",
              color: isDemo ? "#d29922" : "#3fb950",
              border: `1px solid ${isDemo ? "#d29922" : "#3fb950"}`,
            }}
          >
            {isDemo ? "DEMO" : "LIVE"}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </nav>
  );
                }
