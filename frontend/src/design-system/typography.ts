export const typography = {
  fontDisplay: "var(--font-display)", // Syne
  fontBody: "var(--font-body)",       // Space Grotesk

  hero: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
  },
  heroSubtitle: {
    fontSize: "clamp(15px, 1.6vw, 19px)",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "#94A3B8",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-0.01em",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#94A3B8",
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-0.01em",
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#94A3B8",
  },
};

export default typography;