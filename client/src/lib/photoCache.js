// Two-layer cache for Imagin.studio URLs.
//
// The URL is fully deterministic from (make, model, year, angle), so we can
// build it on the client and skip the /api/photo round-trip entirely. The
// in-memory Map handles a single session; localStorage persists across
// reloads. Browser HTTP cache + Imagin's Cache-Control headers handle the
// actual image bytes — first <img> load fills the disk cache, subsequent
// loads come back instantly from disk.

const CUSTOMER = 'img';
const STORAGE_KEY = 'gk:photoUrlCache:v1';
const MAX_ENTRIES = 60;

// Demo overrides — for specific make/model combinations we'd rather show a
// curated local photo than the Imagin render. Lookup is case-insensitive.
// Files live in client/public/ and are served from the site root.
const LOCAL_OVERRIDES = {
  'audi|a8': '/audi-a8.jpg',
  'toyota|camry': '/camry.png',
  'bmw|m3': '/m3.png'
};

const memCache = new Map();

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) memCache.set(k, v);
    }
  } catch {
    /* ignore corrupt cache */
  }
}

function persistToStorage() {
  try {
    let entries = Array.from(memCache.entries());
    if (entries.length > MAX_ENTRIES) {
      // Drop the oldest (insertion-order) entries until we're under the cap.
      const drop = entries.length - MAX_ENTRIES;
      for (let i = 0; i < drop; i++) memCache.delete(entries[i][0]);
      entries = Array.from(memCache.entries());
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* quota exceeded or storage disabled — non-fatal */
  }
}

loadFromStorage();

function keyFor(make, model, year, angle) {
  return `${String(make).trim().toLowerCase()}|${String(model).trim().toLowerCase()}|${year || ''}|${angle}`;
}

export function buildPhotoUrl(make, model, year, angle = '01') {
  if (!make || !model) return null;

  const overrideKey = `${String(make).trim().toLowerCase()}|${String(model).trim().toLowerCase()}`;
  const override = LOCAL_OVERRIDES[overrideKey];
  if (override) return override;

  const key = keyFor(make, model, year, angle);
  const hit = memCache.get(key);
  if (hit) return hit;

  const params = new URLSearchParams({
    customer: CUSTOMER,
    make: String(make).toLowerCase(),
    modelFamily: String(model).split(/\s+/)[0].toLowerCase(),
    angle: String(angle),
    paintdescription: 'composite',
    zoomType: 'fullscreen',
  });
  if (year) params.set('modelYear', String(year));

  const url = `https://cdn.imagin.studio/getimage?${params.toString()}`;
  memCache.set(key, url);
  persistToStorage();
  return url;
}

/** Pre-warm the browser's HTTP image cache for a list of cars (e.g., the dashboard).
 *  No-op if the URL is already cached at the HTTP level. */
export function preloadPhotos(cars) {
  if (typeof window === 'undefined') return;
  for (const c of cars) {
    const url = buildPhotoUrl(c.make, c.model, c.year);
    if (!url) continue;
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = url;
  }
}

/** For tests / debugging. */
export function _clearPhotoCache() {
  memCache.clear();
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}
