export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};
