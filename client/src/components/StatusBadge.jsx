import { motion } from 'framer-motion';
import s from './StatusBadge.module.css';
import { badgeEnter } from '../lib/motion.js';
import { statusLabel } from '../lib/format.js';

export default function StatusBadge({ status = 'good', label }) {
  const text = label || statusLabel(status);
  return (
    <motion.span className={`${s.badge} ${s[status]}`} {...badgeEnter} role="status">
      <span className={s.dot} aria-hidden="true" />
      <span className={s.label}>{text}</span>
    </motion.span>
  );
}
