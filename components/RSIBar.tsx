"use client";

interface RSIBarProps {
  value: number;
}

export default function RSIBar({ value }: RSIBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  let color = "#58a6ff";
  let label = "NEUTRAL";
  if (clamped < 30) {
    color = "#3fb950";
    label = "OVERSOLD";
  } else if (clamped < 40) {
    color = "#56d364";
    label = "LOW";
  } else if (clamped > 70) {
    color = "#f85149";
    label = "OVERBOUGHT";
  } else if (clamped > 60) {
    color = "#ff7b72";
    label = "HIGH";
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "10px", color: "#8b949e" }}>RSI(14)</span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color, fontWeight: 600 }}>
            {label}
          </span>
          <span style={{ fontSize: "12px", color: "#e6edf3", fontWeight: 700 }}>
            {clamped.toFixed(1)}
          </span>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "5px",
          backgroundColor: "#30363d",
          borderRadius: "3px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Oversold zone */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "30%",
            height: "100%",
            backgroundColor: "rgba(63,185,80,0.15)",
          }}
        />
        {/* Overbought zone */}
        <div
          style={{
            position: "absolute",
            right: 0,
            width: "30%",
            height: "100%",
            backgroundColor: "rgba(248,81,73,0.15)",
          }}
        />
        {/* Fill */}
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }}
        />
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            left: `${clamped}%`,
            top: "-2px",
            width: "2px",
            height: "9px",
            backgroundColor: "#fff",
            borderRadius: "1px",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
        }
