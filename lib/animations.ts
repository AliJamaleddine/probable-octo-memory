import type { Variants } from "framer-motion";

export const bookHover = {
  rest: {
    y: 0,
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    y: -20,
    rotateY: -8,
    rotateX: 5,
    scale: 1.02,
    boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const bookOpenVariants: Variants = {
  closed: {
    rotateY: 0,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
  open: {
    rotateY: -180,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      delay: i * 0.1,
    },
  }),
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

export const imageViewerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
