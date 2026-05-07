import { SERVICE_INTERVALS } from './intervals.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SOON_MILES = 500;
const SOON_DAYS = 30;

export function computeCarStatus(car, services) {
  const now = new Date();
  const byType = new Map();
  for (const s of services) {
    const prior = byType.get(s.type);
    if (!prior || s.date > prior.date || (s.date.getTime() === prior.date.getTime() && s.mileage > prior.mileage)) {
      byType.set(s.type, s);
    }
  }

  let worst = 'good';
  let nextDueLine = null;
  let nextDueScore = Infinity;

  for (const [type, interval] of Object.entries(SERVICE_INTERVALS)) {
    const last = byType.get(type);
    const fromMileage = last ? last.mileage : 0;
    const fromDate = last ? new Date(last.date) : (car.createdAt ? new Date(car.createdAt) : now);

    const milesUntilDue = interval.miles != null ? (fromMileage + interval.miles) - car.currentMileage : null;
    const daysUntilDue = interval.months != null ? Math.round((fromDate.getTime() + interval.months * 30 * MS_PER_DAY - now.getTime()) / MS_PER_DAY) : null;

    let typeStatus = 'good';
    if ((milesUntilDue != null && milesUntilDue <= 0) || (daysUntilDue != null && daysUntilDue <= 0)) {
      typeStatus = 'overdue';
    } else if ((milesUntilDue != null && milesUntilDue <= SOON_MILES) || (daysUntilDue != null && daysUntilDue <= SOON_DAYS)) {
      typeStatus = 'soon';
    }

    if (rank(typeStatus) > rank(worst)) worst = typeStatus;

    let score = Infinity;
    if (milesUntilDue != null) score = Math.min(score, milesUntilDue);
    if (daysUntilDue != null) score = Math.min(score, daysUntilDue * 50);

    if (score < nextDueScore) {
      nextDueScore = score;
      const detail = formatNextDue(milesUntilDue, daysUntilDue);
      nextDueLine = { type, detail, status: typeStatus };
    }
  }

  return { status: worst, nextDue: nextDueLine };
}

function rank(s) {
  return s === 'overdue' ? 2 : s === 'soon' ? 1 : 0;
}

function formatNextDue(milesUntilDue, daysUntilDue) {
  if (milesUntilDue != null && milesUntilDue <= 0) return `overdue by ${Math.abs(milesUntilDue).toLocaleString()} mi`;
  if (daysUntilDue != null && daysUntilDue <= 0) return `overdue by ${Math.abs(daysUntilDue)} days`;
  if (milesUntilDue != null && daysUntilDue != null) {
    const pickMiles = milesUntilDue * 50 < daysUntilDue * 50 ? milesUntilDue : null;
    if (pickMiles != null) return `in ${milesUntilDue.toLocaleString()} mi`;
    return `in ${daysUntilDue} days`;
  }
  if (milesUntilDue != null) return `in ${milesUntilDue.toLocaleString()} mi`;
  if (daysUntilDue != null) return `in ${daysUntilDue} days`;
  return 'schedule';
}
