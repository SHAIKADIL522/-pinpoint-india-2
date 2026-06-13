export default function TerrainMesh() {
  const rows = 14;
  return (
    <svg
      viewBox="0 0 800 520"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <defs>
        <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(236,72,153,0.5)" />
          <stop offset="100%" stopColor="rgba(236,72,153,0)" />
        </radialGradient>
        <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99,140,255,0.25)" />
          <stop offset="100%" stopColor="rgba(99,140,255,0.02)" />
        </linearGradient>
      </defs>

      {/* faint wave guide lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const baseY = 180 + i * 32;
        const amp = 14 + i * 2.5;
        const d = `M -20 ${baseY}
          C 150 ${baseY - amp}, 300 ${baseY + amp}, 450 ${baseY - amp / 2}
          S 700 ${baseY + amp}, 820 ${baseY}`;
        return (
          <path
            key={`line-${i}`}
            d={d}
            fill="none"
            stroke="url(#lineFade)"
            strokeWidth="0.75"
            opacity={0.4 - i * 0.03}
          />
        );
      })}

      {/* dense dot field forming the surface */}
      {Array.from({ length: rows }).map((_, row) => {
        const baseY = 170 + row * 24;
        const amp = 12 + row * 2.2;
        const cols = 40;
        return Array.from({ length: cols }).map((_, col) => {
          const x = (col / (cols - 1)) * 840 - 20;
          const wave = Math.sin((col / cols) * Math.PI * 2 + row * 0.4) * amp;
          const y = baseY + wave;
          const opacity = 0.15 + (row / rows) * 0.35;
          return (
            <circle
              key={`dot-${row}-${col}`}
              cx={x}
              cy={y}
              r={0.6}
              fill="rgba(99,140,255,0.6)"
              opacity={opacity}
            />
          );
        });
      })}

      {/* pink glow under center pin */}
      <ellipse
        cx="400"
        cy="350"
        rx="80"
        ry="40"
        fill="url(#pinGlow)"
      />
    </svg>
  );
}