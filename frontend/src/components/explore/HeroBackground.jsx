export default function HeroBackground() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(34,211,238,.12), transparent 35%),
            radial-gradient(circle at 80% 30%, rgba(99,102,241,.12), transparent 35%),
            radial-gradient(circle at 60% 80%, rgba(16,185,129,.10), transparent 40%)
          `,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          opacity: 0.35,
        }}
      />
    </>
  );
}