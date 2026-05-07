import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loadEnv({ path: path.join(__dirname, '.env') });

import carsRouter from './routes/cars.js';
import servicesRouter from './routes/services.js';
import vinRouter from './routes/vin.js';
import photoRouter from './routes/photo.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Copy server/.env.example to server/.env and fill it in.');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log('mongo: connected');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/cars', carsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/vin', vinRouter);
app.use('/api/photo', photoRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 });
});

const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`garagekeep: listening on :${PORT}`);
});
