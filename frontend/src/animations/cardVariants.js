export const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  hover: { y: -3, transition: { duration: 0.2 } },
};

export const listItem = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
