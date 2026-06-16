"use client";

import { HistoryEntry } from "@/types/signals";
import { calcWinRate } from "@/lib/storage";

interface HistoryTableProps {
  entries: HistoryEntry[];
  onUpdateResult: (id: string, result: "WIN" | "LOSS") => void;
}

export default function HistoryTable({
  entries,
  onUpdateResult,
}: HistoryTableProps) {
  const winRate = calcWinRate(entries);
  const resolved = entries.filter((e) => e.result !== "PENDING").length;

  if (!entries.length) {
    return (
      <div
        style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "10px",
          padding: "32px",
          textAlign: "center",
          color: "#8b949e",
          fontSize: "13px",
          fontFamily: "monospace",
        }}
      >
        No signal history yet. Click "+ Track" on any signal card to start tracking.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "10px",
        overflow: "hidden",
        fontFamily: "monospace",
      }}
    >
      {/* Stats header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #30363d",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#e6edf3" }}>
          Signal History
        </span>
        <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
          <span style={{ color: "#8b949e" }}>
            Total: <span style={{ color: "#e6edf3" }}>{entries.length}</span>
          </span>
          <span style={{ color: "#8b949e" }}>
            Resolved: <span style={{ color: "#e6edf3" }}>{resolved}</span>
          </span>
          <span style={{ color: "#8b949e" }}>
            Win Rate:{" "}
            <span
              style={{
                color:
                  winRate >= 60
                    ? "#3fb950"
                    : winRate >= 40
                    ? "#d29922"
                    : "#f85149",
                fontWeight: 700,
              }}
            >
              {winRate}%
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #30363d" }}>
              {["Time", "Pair", "Signal", "Entry Price", "Predicted", "RSI", "Result", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      color: "#8b949e",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.id}
                style={{
                  borderBottom: "1px solid #21262d",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#0d1117")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = "transparent")
                }
              >
                <td style={{ padding: "8px 12px", color: "#8b949e", whiteSpace: "nowrap" }}>
                  {entry.time}
                </td>
                <td style={{ padding: "8px 12px", color: "#e6edf3", fontWeight: 600 }}>
                  {entry.pair}
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor:
                        entry.signal === "BUY"
                          ? "rgba(63,185,80,0.15)"
                          : entry.signal === "SELL"
                          ? "rgba(248,81,73,0.15)"
                          : "rgba(210,153,34,0.15)",
                      color:
                        entry.signal === "BUY"
                          ? "#3fb950"
                          : entry.signal === "SELL"
                          ? "#f85149"
                          : "#d29922",
                    }}
                  >
                    {entry.signal}
                  </span>
                </td>
                <td style={{ padding: "8px 12px", color: "#e6edf3" }}>
                  {entry.entryPrice.toFixed(5)}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    color:
                      entry.predictedDirection === "UP" ? "#3fb950" : "#f85149",
                    fontWeight: 600,
                  }}
                >
                  {entry.predictedDirection === "UP" ? "▲ UP" : "▼ DOWN"}
                </td>
                <td style={{ padding: "8px 12px", color: "#58a6ff" }}>
                  {entry.rsi.toFixed(1)}
                </td>
                <td style={{ padding: "8px 12px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                      backgroundColor:
                        entry.result === "WIN"
                          ? "rgba(63,185,80,0.15)"
                          : entry.result === "LOSS"
                          ? "rgba(248,81,73,0.15)"
                          : "rgba(88,166,255,0.1)",
                      color:
                        entry.result === "WIN"
                          ? "#3fb950"
                          : entry.result === "LOSS"
                          ? "#f85149"
                          : "#8b949e",
                    }}
                  >
                    {entry.result}
                  </span>
                </td>
                <td style={{ padding: "8px 12px" }}>
                  {entry.result === "PENDING" && (
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={() => onUpdateResult(entry.id, "WIN")}
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          border: "1px solid #3fb950",
                          color: "#3fb950",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        W
                      </button>
                      <button
                        onClick={() => onUpdateResult(entry.id, "LOSS")}
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "3px",
                          border: "1px solid #f85149",
                          color: "#f85149",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        L
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
