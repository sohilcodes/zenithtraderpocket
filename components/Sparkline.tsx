"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({
  data,
  width = 120,
  height = 36,
  color = "#58a6ff",
}: SparklineProps) {
  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height}>
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#30363d"
          strokeWidth={1}
        />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;

  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + ((max - val) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  const last = data[data.length - 1];
  const first = data[0];
  const lineColor = last >= first ? "#3fb950" : "#f85149";
  const finalColor = color === "#58a6ff" ? lineColor : color;

  const pathD = `M ${points.join(" L ")}`;

  // Fill path
  const firstPt = points[0].split(",");
  const lastPt = points[points.length - 1].split(",");
  const fillD = `M ${points.join(" L ")} L ${lastPt[0]},${height} L ${firstPt[0]},${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={finalColor} stopOpacity={0.3} />
          <stop offset="100%" stopColor={finalColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${color})`} />
      <path
        d={pathD}
        fill="none"
        stroke={finalColor}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last dot */}
      <circle
        cx={lastPt[0]}
        cy={lastPt[1]}
        r={2.5}
        fill={finalColor}
      />
    </svg>
  );
}
