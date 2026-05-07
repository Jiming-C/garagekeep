import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { cardEnter, easeOutQuart } from '../lib/motion.js';
import { fmtMiles } from '../lib/format.js';
import StatusBadge from './StatusBadge.jsx';
import CarPhoto from './CarPhoto.jsx';
import s from './CarCard.module.css';

export default function CarCard({ car, index = 0 }) {
  const transition = { ...cardEnter.transition, delay: index * 0.06 };
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-3.5, 3.5]);

  function onMove(e) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function onLeave() {
    animate(x, 0, { duration: 0.4, ease: easeOutQuart });
    animate(y, 0, { duration: 0.4, ease: easeOutQuart });
  }

  return (
    <motion.div className={s.cardWrap} initial={cardEnter.initial} animate={cardEnter.animate} transition={transition}>
      <Link to={`/cars/${car._id}`} className={s.card}>
        <motion.div
          className={s.photoWrap}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        >
          <CarPhoto make={car.make} model={car.model} year={car.year} className={s.photo} />
        </motion.div>
        <div className={s.body}>
          <div className={s.head}>
            <h3 className={s.name}>{car.name}</h3>
            <p className={s.sub}>{car.year} {car.make} {car.model}</p>
          </div>
          <hr className="hairline" />
          <dl className={s.stats}>
            <div className={s.row}>
              <dt className="eyebrow">Odometer</dt>
              <dd className="tabular">{fmtMiles(car.currentMileage)}</dd>
            </div>
            <div className={s.row}>
              <dt className="eyebrow">Next due</dt>
              <dd>{car.nextDue ? `${car.nextDue.type} · ${car.nextDue.detail}` : '—'}</dd>
            </div>
            <div className={s.row}>
              <dt className="eyebrow">Status</dt>
              <dd><StatusBadge status={car.status || 'good'} /></dd>
            </div>
          </dl>
        </div>
      </Link>
    </motion.div>
  );
}
