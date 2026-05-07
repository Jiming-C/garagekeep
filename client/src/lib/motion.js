export const easeOutQuart = [0.22, 1, 0.36, 1];
export const easeOutExpo = [0.16, 1, 0.3, 1];

export const pageEnter = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOutExpo },
};

export const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: easeOutExpo, delay },
});

export const cardEnter = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.32, ease: easeOutQuart },
};

export const badgeEnter = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.32, ease: easeOutQuart },
};
