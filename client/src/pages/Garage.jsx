import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageEnter from '../components/PageEnter.jsx';
import CarCard from '../components/CarCard.jsx';
import { SkeletonCard } from '../components/Skeleton.jsx';
import Empty from '../components/Empty.jsx';
import { api } from '../lib/api.js';
import { stagger } from '../lib/motion.js';
import s from './Garage.module.css';

export default function Garage() {
  const [cars, setCars] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.cars.list();
        if (!cancelled) setCars(data);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (err) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Couldn't load garage</p>
        <h1 className="display-m">{err}</h1>
        <p className="body-s" style={{ marginTop: 24 }}>
          Make sure the server is running and your <code>MONGODB_URI</code> is set.
        </p>
      </PageEnter>
    );
  }

  if (cars === null) {
    return (
      <PageEnter className="page">
        <Header total={null} />
        <div className={s.grid}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageEnter>
    );
  }

  if (cars.length === 0) {
    return (
      <PageEnter className="page">
        <Empty
          eyebrow="The Garage"
          title="An empty garage."
          body="Every record begins with the first entry. Add a car and start the log."
          ctaLabel="Add your first car"
          ctaTo="/cars/new"
        />
      </PageEnter>
    );
  }

  return (
    <PageEnter className="page">
      <Header total={cars.length} />
      <motion.div className={s.grid}>
        {cars.map((c, i) => (
          <CarCard key={c._id} car={c} index={i} />
        ))}
      </motion.div>
    </PageEnter>
  );
}

function Header({ total }) {
  return (
    <motion.div className="page-header" {...stagger(0)}>
      <div>
        <p className="eyebrow">The Garage</p>
        <h1 className="display-m">
          {total == null ? 'Loading…' : total === 1 ? 'One car kept.' : `${total} cars kept.`}
        </h1>
      </div>
      <Link to="/cars/new" className={s.headerCta}>
        Add a car <span aria-hidden="true">→</span>
      </Link>
    </motion.div>
  );
}
