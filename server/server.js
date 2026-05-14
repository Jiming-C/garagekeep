import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
const indexHtml = path.join(clientDist, 'index.html');
const distExists = fs.existsSync(clientDist);
const indexExists = fs.existsSync(indexHtml);
console.log(`static: clientDist=${clientDist}`);
console.log(`static: dist exists=${distExists}, index.html exists=${indexExists}`);

app.use(express.static(clientDist));

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api/')) return next();
  if (!indexExists) {
    return res
      .status(500)
      .type('text/plain')
      .send(`client/dist/index.html missing.\nResolved path: ${indexHtml}\nDid the client build run? Render build command should be: npm install && npm run build`);
  }
  res.sendFile(indexHtml, (err) => {
    if (err) {
      console.error('sendFile error:', err.message);
      if (!res.headersSent) res.status(500).type('text/plain').send('Failed to serve index.html');
    }
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`garagekeep: listening on :${PORT}`);
});
