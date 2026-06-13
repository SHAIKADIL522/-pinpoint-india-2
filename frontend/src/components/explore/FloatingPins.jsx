import { motion } from "framer-motion";

const pins = [
  { x: "20%", y: "20%", size: 28 },
  { x: "70%", y: "15%", size: 22 },
  { x: "45%", y: "45%", size: 36 },
  { x: "75%", y: "65%", size: 24 },
  { x: "15%", y: "70%", size: 20 },
];

export default function FloatingPins() {
  return (
    <>
      {pins.map((pin, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: pin.x,
            top: pin.y,
            fontSize: pin.size,
            filter: "drop-shadow(0 0 12px rgba(34,211,238,.5))",
            zIndex: 2,
          }}
        >
          📍
        </motion.div>
      ))}
    </>
  );
}