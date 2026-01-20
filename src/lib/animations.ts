export const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
        scale: 0.98,
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    out: {
        opacity: 0,
        y: -10,
        scale: 0.98,
    },
};

export const pageTransition = {
    type: "tween",
    ease: "circOut",
    duration: 0.4,
} as const;
