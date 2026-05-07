import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { buildPhotoUrl } from '../lib/photoCache.js';
import { easeOutExpo } from '../lib/motion.js';
import s from './CarPhoto.module.css';

export default function CarPhoto({ make, model, year, angle = '01', photoUrl, className }) {
  const url = useMemo(
    () => photoUrl || buildPhotoUrl(make, model, year, angle),
    [photoUrl, make, model, year, angle]
  );
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setErrored(false);
    setLoaded(false);
  }, [url]);

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
