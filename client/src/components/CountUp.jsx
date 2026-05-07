import { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import { easeOutExpo } from '../lib/motion.js';

/** Animates a number from 0 (or a previous value) up to `value` over `duration` seconds.
 *  `format` turns the rounded number into the displayed string. */
export default function CountUp({ value = 0, duration = 0.9, format = (v) => v }) {
  const target = Number(value) || 0;
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    const controls = animate(mv, target, { duration, ease: easeOutExpo });
    const unsub = mv.on('change', (v) => setDisplay(format(Math.round(v))));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, duration]);

  return <>{display}</>;
}
