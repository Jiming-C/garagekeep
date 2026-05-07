import { Router } from 'express';

const router = Router();

router.get('/:vin', async (req, res, next) => {
  try {
    const vin = String(req.params.vin || '').trim().toUpperCase();
    if (!vin || vin.length < 5) return res.status(400).json({ error: 'VIN is too short.' });

    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: `NHTSA returned ${r.status}` });
    const data = await r.json();
    const row = data.Results && data.Results[0];
    if (!row) return res.status(502).json({ error: 'NHTSA returned no result.' });

    const make = (row.Make || '').toString().trim();
    const model = (row.Model || '').toString().trim();
    const year = Number(row.ModelYear) || null;

    if (!make || !model || !year) {
      return res.status(404).json({ error: 'VIN could not be decoded into make/model/year.', raw: { make, model, year } });
    }

    res.json({
      vin,
      make: titleCase(make),
      model: titleCase(model),
      year,
      bodyClass: row.BodyClass || null,
      engineCylinders: row.EngineCylinders || null,
      fuelType: row.FuelTypePrimary || null,
      manufacturer: row.Manufacturer || null,
    });
  } catch (e) {
    next(e);
  }
});

function titleCase(s) {
  return String(s)
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export default router;
