import { buildPhotoUrl } from './photoCache.js';

const BASE = '/api';

async function http(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw Object.assign(new Error(data?.error || `HTTP ${res.status}`), { status: res.status, data });
  return data;
}

export const api = {
  cars: {
    list: () => http('GET', '/cars'),
    get: (id) => http('GET', `/cars/${id}`),
    create: (payload) => http('POST', '/cars', payload),
    update: (id, payload) => http('PATCH', `/cars/${id}`, payload),
    remove: (id) => http('DELETE', `/cars/${id}`),
  },
  services: {
    create: (payload) => http('POST', '/services', payload),
    remove: (id) => http('DELETE', `/services/${id}`),
  },
  vin: {
    decode: (vin) => http('GET', `/vin/${encodeURIComponent(vin)}`),
  },
  photo: {
    // Synchronous; no /api/photo round-trip. URL is built on the client and
    // memoized in localStorage. Returns a Promise to preserve the call shape
    // existing components rely on.
    url: (make, model, year, angle = '01') =>
      Promise.resolve({ url: buildPhotoUrl(make, model, year, angle), make, model, year }),
  },
};
