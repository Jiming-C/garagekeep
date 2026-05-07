import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageEnter } from '../lib/motion.js';
import s from './Empty.module.css';

export default function Empty({ eyebrow, title, body, ctaLabel, ctaTo }) {
  return (
    <motion.div className={s.empty} {...pageEnter}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="display-l">{title}</h1>
      {body && <p className={`body-l ${s.body}`}>{body}</p>}
      {ctaLabel && ctaTo && (
        <Link to={ctaTo} className={s.cta}>
          <span>{ctaLabel}</span>
          <span aria-hidden="true" className={s.arrow}>→</span>
        </Link>
      )}
    </motion.div>
  );
}
