import type { Variants } from "framer-motion";

export const deskEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
      ease: deskEase,
      delay: i * 0.1,
    },
  }),
};

export const dropIn: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
    scale: 0.9,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: deskEase,
      delay: 0.5 + i * 0.15,
    },
  }),
};

export const slideIn: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: deskEase,
      delay: 1.6 + i * 0.12,
    },
  }),
};

export const imageViewerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: deskEase },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } },
};
