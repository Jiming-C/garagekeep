import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageEnter from '../components/PageEnter.jsx';
import Field from '../components/Field.jsx';
import Button from '../components/Button.jsx';
import CarPhoto from '../components/CarPhoto.jsx';
import { api } from '../lib/api.js';
import { stagger } from '../lib/motion.js';
import s from './AddCar.module.css';

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [vinState, setVinState] = useState('idle');
  const [vinError, setVinError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const vinTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const car = await api.cars.get(id);
        if (!cancelled) {
          setForm({
            name: car.name || '',
            make: car.make || '',
            model: car.model || '',
            year: car.year ? String(car.year) : '',
            vin: car.vin || '',
            currentMileage: car.currentMileage != null ? String(car.currentMileage) : '',
            notes: car.notes || '',
          });
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

  function onVinChange(e) {
    const value = e.target.value.toUpperCase();
    update('vin', value);
    setVinError(null);
    if (vinTimer.current) clearTimeout(vinTimer.current);
    if (value.length < 11) {
      setVinState('idle');
      return;
    }
    vinTimer.current = setTimeout(() => decodeVin(value), 600);
  }

  async function decodeVin(vin) {
    setVinState('loading');
    try {
      const r = await api.vin.decode(vin);
      setForm((f) => ({
        ...f,
        make: r.make || f.make,
        model: r.model || f.model,
        year: r.year ? String(r.year) : f.year,
      }));
      setVinState('done');
    } catch (e) {
      setVinState('error');
      setVinError(e.message);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.make || !form.model || !form.year) {
      setError('Please fill in nickname, make, model, and year.');
      return;
    }
    setSubmitting(true);
    try {
      await api.cars.update(id, {
        ...form,
        year: Number(form.year),
        currentMileage: Number(form.currentMileage) || 0,
      });
      navigate(`/cars/${id}`);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  useEffect(() => () => { if (vinTimer.current) clearTimeout(vinTimer.current); }, []);

  if (error && !form) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Couldn't load car</p>
        <h1 className="display-m">{error}</h1>
      </PageEnter>
    );
  }

  if (!form) {
    return (
      <PageEnter className="page">
        <p className="eyebrow">Loading…</p>
      </PageEnter>
    );
  }

  const previewReady = form.make && form.model && form.year;

  return (
    <PageEnter className="page">
      <motion.div className="page-header" {...stagger(0)}>
        <div>
          <p className="eyebrow">Edit car</p>
          <h1 className="display-m">Update the record.</h1>
        </div>
      </motion.div>

      <div className={s.layout}>
        <motion.form onSubmit={onSubmit} className={s.form} {...stagger(0.08)} noValidate>
          <FormSection title="Identification">
            <Field
              label="Nickname"
              placeholder="The Wagon, Daily, Project Car…"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              required
            />
            <Field
              label="VIN"
              placeholder="17-character VIN, optional"
              maxLength={17}
              value={form.vin}
              onChange={onVinChange}
              hint={
                vinState === 'loading'
                  ? 'Decoding…'
                  : vinState === 'done'
                  ? 'Decoded — make, model, and year filled below.'
                  : 'Optional. Auto-fills make / model / year via NHTSA.'
              }
              error={vinError}
            />
          </FormSection>

          <FormSection title="The car">
            <div className={s.row3}>
              <Field
                label="Make"
                value={form.make}
                onChange={(e) => update('make', e.target.value)}
                required
                placeholder="Honda"
              />
              <Field
                label="Model"
                value={form.model}
                onChange={(e) => update('model', e.target.value)}
                required
                placeholder="Civic"
              />
              <Field
                label="Year"
                type="number"
                inputMode="numeric"
                value={form.year}
                onChange={(e) => update('year', e.target.value)}
                required
                placeholder="2020"
                min="1900"
                max="2099"
              />
            </div>
            <Field
              label="Current odometer (miles)"
              type="number"
              inputMode="numeric"
              value={form.currentMileage}
              onChange={(e) => update('currentMileage', e.target.value)}
              placeholder="0"
            />
          </FormSection>

          <FormSection title="Notes">
            <Field
              as="textarea"
              label="Anything to remember"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Coilovers, ECU tune, bought 2024-03 with 41,000 mi…"
            />
          </FormSection>

          {error && <p className={s.formError}>{error}</p>}

          <div className={s.actions}>
            <Button as="button" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
            <Button as="button" type="button" variant="link" onClick={() => navigate(`/cars/${id}`)}>
              Cancel
            </Button>
          </div>
        </motion.form>

        <motion.aside className={s.preview} {...stagger(0.18)}>
          <p className="eyebrow">Preview</p>
          {previewReady ? (
            <>
              <CarPhoto make={form.make} model={form.model} year={Number(form.year)} />
              <p className={s.previewName}>
                {form.year} {form.make} {form.model}
              </p>
            </>
          ) : (
            <div className={s.previewEmpty}>
              <p className="body-s">
                A render of the car appears here once make, model, and year are filled.
              </p>
            </div>
          )}
        </motion.aside>
      </div>
    </PageEnter>
  );
}

function FormSection({ title, children }) {
  return (
    <fieldset className={s.section}>
      <legend className={s.sectionTitle}>{title}</legend>
      {children}
    </fieldset>
  );
}
