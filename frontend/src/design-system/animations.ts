// Premium animation presets — additive, used by new premium/ components only.
export const heroFadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export const heroStagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const floatingStat = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  hover: { y: -4, transition: { duration: 0.2 } },
};

export const counterEase = [0.16, 1, 0.3, 1];

export const markerPulse = {
  animate: {
    scale: [1, 1.6, 1],
    opacity: [0.8, 0, 0.8],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const glassEntrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};