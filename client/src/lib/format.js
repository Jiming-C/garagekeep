export function fmtMiles(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('en-US') + ' mi';
}

export function fmtCost(n) {
  if (n == null || Number.isNaN(Number(n)) || Number(n) === 0) return '—';
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtDate(d) {
  if (!d) return '—';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function fmtDateISO(d) {
  if (!d) return '';
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

export function statusLabel(s) {
  return s === 'overdue' ? 'Overdue' : s === 'soon' ? 'Due soon' : 'Good';
}
