import { Router } from 'express';

const router = Router();
const CUSTOMER = process.env.IMAGIN_CUSTOMER || 'img';

router.get('/', (req, res) => {
  const make = String(req.query.make || '').trim();
  const model = String(req.query.model || '').trim();
  const year = Number(req.query.year) || null;
  const angle = String(req.query.angle || '01');

  if (!make || !model) return res.status(400).json({ error: 'make and model are required.' });

  const params = new URLSearchParams({
    customer: CUSTOMER,
    make: make.toLowerCase(),
    modelFamily: firstWord(model).toLowerCase(),
    angle,
    paintdescription: 'composite',
    zoomType: 'fullscreen',
  });
  if (year) params.set('modelYear', String(year));

  const url = `https://cdn.imagin.studio/getimage?${params.toString()}`;
  res.json({ url, make, model, year });
});

function firstWord(s) {
  return String(s).split(/\s+/)[0] || s;
}

export default router;
