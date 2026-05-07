import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageEnter from '../components/PageEnter.jsx';
import Field from '../components/Field.jsx';
import Button from '../components/Button.jsx';
import { api } from '../lib/api.js';
import { SERVICE_TYPES } from '../lib/intervals.js';
import { fmtDateISO } from '../lib/format.js';
import { stagger } from '../lib/motion.js';
import s from './LogService.module.css';

export default function LogService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [form, setForm] = useState({
    type: SERVICE_TYPES[0],
    customType: '',
    date: fmtDateISO(new Date()),
    mileage: '',
    cost: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.cars.get(id);
        if (!cancelled) {
          setCar(data);
          setForm((f) => ({ ...f, mileage: String(data.currentMileage || '') }));
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const type = form.type === 'Custom' ? form.customType.trim() : form.type;
    if (!type) {
      setError('Please pick a service type or enter a custom one.');
      return;
    }
    if (!form.mileage) {
      setError('Mileage is required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.services.create({
        car: id,
        type,
        date: form.date,
        mileage: Number(form.mileage),
        cost: Number(form.cost) || 0,
        notes: form.notes,
      });
      navigate(`/cars/${id}`);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  if (error && !car) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Couldn't load</p>
        <h1 className="display-m">{error}</h1>
      </PageEnter>
    );
  }

  return (
    <PageEnter className="page">
      <motion.div className="page-header" {...stagger(0)}>
        <div>
          <Link to={`/cars/${id}`} className={s.back}>← Back to car</Link>
          <p className="eyebrow">Log a service</p>
          <h1 className="display-m">{car ? car.name : 'Loading…'}</h1>
        </div>
      </motion.div>

      <motion.form onSubmit={onSubmit} className={s.form} {...stagger(0.08)} noValidate>
        <Field as="select" label="Service type" value={form.type} onChange={(e) => update('type', e.target.value)}>
          {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
          <option value="Custom">Custom…</option>
        </Field>

        {form.type === 'Custom' && (
          <Field
            label="Custom type"
            placeholder="e.g. Spark plugs, Timing belt"
            value={form.customType}
            onChange={(e) => update('customType', e.target.value)}
          />
        )}

        <div className={s.row}>
          <Field
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            required
          />
          <Field
            label="Mileage"
            type="number"
            inputMode="numeric"
            value={form.mileage}
            onChange={(e) => update('mileage', e.target.value)}
            required
          />
          <Field
            label="Cost (USD)"
            type="number"
            inputMode="decimal"
            value={form.cost}
            onChange={(e) => update('cost', e.target.value)}
            placeholder="0"
          />
        </div>

        <Field
          as="textarea"
          label="Notes"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Mobil 1 0W-20, dealer, replaced cabin filter while there…"
        />

        {error && <p className={s.formError}>{error}</p>}

        <div className={s.actions}>
          <Button as="button" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save service'}
          </Button>
          <Button as="button" type="button" variant="link" onClick={() => navigate(`/cars/${id}`)}>
            Cancel
          </Button>
        </div>
      </motion.form>
    </PageEnter>
  );
}
