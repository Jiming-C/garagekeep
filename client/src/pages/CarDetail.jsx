import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageEnter from '../components/PageEnter.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import CarPhoto from '../components/CarPhoto.jsx';
import Button from '../components/Button.jsx';
import CountUp from '../components/CountUp.jsx';
import { api } from '../lib/api.js';
import { fmtCost, fmtDate, fmtMiles } from '../lib/format.js';
import { easeOutExpo, stagger } from '../lib/motion.js';
import s from './CarDetail.module.css';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.cars.get(id);
        if (!cancelled) setCar(data);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  async function deleteCar() {
    if (!confirm('Delete this car and all its service entries? This cannot be undone.')) return;
    try {
      await api.cars.remove(id);
      navigate('/');
    } catch (e) {
      alert(e.message);
    }
  }

  async function deleteService(serviceId) {
    if (!confirm('Delete this service entry?')) return;
    try {
      await api.services.remove(serviceId);
      const data = await api.cars.get(id);
      setCar(data);
    } catch (e) {
      alert(e.message);
    }
  }

  if (err) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Couldn't load car</p>
        <h1 className="display-m">{err}</h1>
        <Link to="/" className={s.back}>← Back to garage</Link>
      </PageEnter>
    );
  }

  if (!car) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Loading</p>
        <h1 className="display-m">…</h1>
      </PageEnter>
    );
  }

  return (
    <PageEnter className="page">
      <Link to="/" className={s.back}>← Back to garage</Link>

      <section className={s.hero}>
        <motion.div className={s.heroPhoto} {...stagger(0.05)}>
          <CarPhoto make={car.make} model={car.model} year={car.year} />
        </motion.div>
        <motion.div className={s.heroInfo} {...stagger(0.12)}>
          <p className="eyebrow">{car.year} · {car.make} {car.model}</p>
          <h1 className={`display-l ${s.name}`}>{car.name}</h1>
          <div className={s.heroMeta}>
            <StatusBadge status={car.status || 'good'} />
            {car.vin && <span className={s.vin}>VIN&nbsp;<span className="tabular">{car.vin}</span></span>}
          </div>
        </motion.div>
      </section>

      <motion.section className={s.statStrip} {...stagger(0.18)}>
        <div className={s.stat}>
          <p className="eyebrow">Odometer</p>
          <p className={`${s.statValue} tabular`}>
            <CountUp value={car.currentMileage} format={fmtMiles} />
          </p>
        </div>
        <div className={s.stat}>
          <p className="eyebrow">Next due</p>
          <p className={s.statValue}>
            {car.nextDue ? (
              <>
                {car.nextDue.type}
                <span className={s.statSub}> · {car.nextDue.detail}</span>
              </>
            ) : '—'}
          </p>
        </div>
        <div className={s.stat}>
          <p className="eyebrow">Last service</p>
          <p className={s.statValue}>
            {car.services?.[0] ? `${car.services[0].type}` : 'None yet'}
            {car.services?.[0] && <span className={s.statSub}> · {fmtDate(car.services[0].date)}</span>}
          </p>
        </div>
      </motion.section>

      <motion.section {...stagger(0.24)}>
        <div className={s.timelineHead}>
          <p className="eyebrow">Service history</p>
          <Button as={Link} to={`/cars/${id}/services/new`} variant="ghost">Log a service</Button>
        </div>

        {car.services?.length === 0 ? (
          <p className={s.emptyServices}>No services logged yet. The log begins with the next entry.</p>
        ) : (
          <ul className={s.timeline}>
            {car.services.map((sv, i) => (
              <motion.li
                key={sv._id}
                className={s.row}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.32 + i * 0.04 }}
              >
                <span className={`${s.col} ${s.colDate} tabular`}>{fmtDate(sv.date)}</span>
                <span className={`${s.col} ${s.colType}`}>{sv.type}</span>
                <span className={`${s.col} ${s.colMiles} tabular`}>{fmtMiles(sv.mileage)}</span>
                <span className={`${s.col} ${s.colCost} tabular`}>{fmtCost(sv.cost)}</span>
                <button onClick={() => deleteService(sv._id)} className={s.del} aria-label="Delete">×</button>
                {sv.notes && <span className={s.notes}>{sv.notes}</span>}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.section>

      <motion.section className={s.danger} {...stagger(0.30)}>
        <Button as={Link} to={`/cars/${id}/edit`} variant="ghost">Edit car</Button>
        <Button variant="danger" onClick={deleteCar}>Delete this car</Button>
      </motion.section>
    </PageEnter>
  );
}
