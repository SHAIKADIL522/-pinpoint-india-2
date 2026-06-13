export default function FeatureGrid() {
  const features = [
    {
      icon: "🗺️",
      title: "Map Intelligence",
      desc: "Interactive district mapping and geographic insights",
    },
    {
      icon: "🤖",
      title: "AI Insights",
      desc: "AI-powered analysis for every location searched",
    },
    {
      icon: "🌦️",
      title: "Weather Analytics",
      desc: "Live forecasts and climate intelligence",
    },
    {
      icon: "📍",
      title: "Nearby Discovery",
      desc: "Explore places and services around locations",
    },
  ];

  return (
    <div className="feature-grid">
      {features.map((item) => (
        <div key={item.title} className="feature-card">
          <div
            style={{
              fontSize: 32,
              marginBottom: 12,
            }}
          >
            {item.icon}
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {item.title}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#94A3B8",
              lineHeight: 1.6,
            }}
          >
            {item.desc}
          </div>
        </div>
      ))}
    </div>
  );
}