import { Router } from 'express';
import mongoose from 'mongoose';
import Car from '../models/Car.js';
import Service from '../models/Service.js';
import { computeCarStatus } from '../lib/status.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }).lean();
    const services = await Service.find({ car: { $in: cars.map((c) => c._id) } }).lean();
    const grouped = new Map();
    for (const s of services) {
      const id = String(s.car);
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id).push({ ...s, date: new Date(s.date) });
    }
    const enriched = cars.map((c) => ({
      ...c,
      ...computeCarStatus(c, grouped.get(String(c._id)) || []),
    }));
    res.json(enriched);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const car = await Car.findById(req.params.id).lean();
    if (!car) return res.status(404).json({ error: 'Not found' });
    const services = await Service.find({ car: car._id }).sort({ date: -1, mileage: -1 }).lean();
    const status = computeCarStatus(car, services.map((s) => ({ ...s, date: new Date(s.date) })));
    res.json({ ...car, services, ...status });
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, make, model, year, vin, currentMileage, notes, photoUrl } = req.body || {};
    if (!name || !make || !model || !year) {
      return res.status(400).json({ error: 'name, make, model, year are required.' });
    }
    const car = await Car.create({
      name: String(name).trim(),
      make: String(make).trim(),
      model: String(model).trim(),
      year: Number(year),
      vin: vin ? String(vin).trim().toUpperCase() : undefined,
      currentMileage: Number(currentMileage) || 0,
      notes: notes ? String(notes).trim() : undefined,
      photoUrl: photoUrl ? String(photoUrl).trim() : undefined,
    });
    res.status(201).json(car);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const updatable = ['name', 'make', 'model', 'year', 'vin', 'currentMileage', 'notes', 'photoUrl'];
    const update = {};
    for (const k of updatable) if (k in req.body) update[k] = req.body[k];
    const car = await Car.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json(car);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: 'Not found' });
    await Service.deleteMany({ car: car._id });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
