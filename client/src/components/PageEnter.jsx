import { motion } from 'framer-motion';
import { easeOutExpo } from '../lib/motion.js';

export default function PageEnter({ children, className, delay = 0 }) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.main>
  );
}
