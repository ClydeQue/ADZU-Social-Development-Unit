// Animation variants ng FRAMER MOTION COMPOWNENTS

export const titleVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
    },
  },
};

export const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
      type: "spring",
      stiffness: 60,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

export const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.68, -0.55, 0.265, 1.55],
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.15,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

export const textScaleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

export const layoutVariants = {
  desktop: {
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  mobile: {
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
