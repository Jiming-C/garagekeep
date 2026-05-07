import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api.js';
import { easeOutExpo } from '../lib/motion.js';
import s from './CarPhoto.module.css';

export default function CarPhoto({ make, model, year, angle = '01', className }) {
  const [url, setUrl] = useState(null);
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErrored(false);
    setLoaded(false);
    setUrl(null);
    if (!make || !model) return;
    (async () => {
      try {
        const { url } = await api.photo.url(make, model, year, angle);
        if (!cancelled) setUrl(url);
      } catch {
        if (!cancelled) setErrored(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [make, model, year, angle]);

  const showFallback = errored || !url;
  return (
    <div className={`${s.frame} ${className || ''}`}>
      {!showFallback && (
        <motion.img
          className={s.img}
          src={url}
          alt={`${year || ''} ${make} ${model}`.trim()}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          initial={{ opacity: 0, scale: 1.06, clipPath: 'inset(0 100% 0 0)' }}
          animate={loaded
            ? { opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0)' }
            : { opacity: 0, scale: 1.06, clipPath: 'inset(0 100% 0 0)' }
          }
          transition={{ duration: 0.7, ease: easeOutExpo }}
        />
      )}
      {showFallback && (
        <motion.div
          className={s.fallback}
          aria-label={`${year || ''} ${make || ''} ${model || ''}`.trim()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <span className={s.fbYear}>{year || '—'}</span>
          <span className={s.fbName}>{make} {model}</span>
        </motion.div>
      )}
    </div>
  );
}
