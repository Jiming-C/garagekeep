import { Router } from 'express';
import mongoose from 'mongoose';
import Service from '../models/Service.js';
import Car from '../models/Car.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.car && mongoose.isValidObjectId(req.query.car)) filter.car = req.query.car;
    const services = await Service.find(filter).sort({ date: -1 }).lean();
    res.json(services);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { car, type, date, mileage, cost, notes } = req.body || {};
    if (!car || !mongoose.isValidObjectId(car)) return res.status(400).json({ error: 'Valid car id is required.' });
    if (!type) return res.status(400).json({ error: 'type is required.' });
    if (mileage == null || Number.isNaN(Number(mileage))) return res.status(400).json({ error: 'mileage is required.' });

    const carDoc = await Car.findById(car);
    if (!carDoc) return res.status(404).json({ error: 'Car not found.' });

    const service = await Service.create({
      car: carDoc._id,
      type: String(type).trim(),
      date: date ? new Date(date) : new Date(),
      mileage: Number(mileage),
      cost: cost != null ? Number(cost) : 0,
      notes: notes ? String(notes).trim() : undefined,
    });

    if (Number(mileage) > (carDoc.currentMileage || 0)) {
      carDoc.currentMileage = Number(mileage);
      await carDoc.save();
    }

    res.status(201).json(service);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const s = await Service.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
