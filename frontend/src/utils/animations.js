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
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.3,
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
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.8,
      type: "spring",
      stiffness: 60,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
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
      duration: 0.8,
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
      duration: 1.2,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
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
      duration: 1.0,
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
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  mobile: {
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};
