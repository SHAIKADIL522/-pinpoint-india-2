import { MapPin, Building2, Target, Zap } from "lucide-react";

const stats = [
  { icon: MapPin, value: "19M+", label: "Pincodes Covered" },
  { icon: Building2, value: "540K+", label: "Cities & Towns" },
  { icon: Target, value: "99.9%", label: "Accuracy" },
  { icon: Zap, value: "24/7", label: "AI Intelligence" },
];

export default function HeroStats() {
  return (
    <div className="hero-stats">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label}>
          <div className="icon-wrap">
            <Icon size={22} />
          </div>
          <div>
            <h3>{value}</h3>
            <p>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}