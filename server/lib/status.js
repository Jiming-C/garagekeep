import { SERVICE_INTERVALS } from './intervals.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const SOON_MILES = 500;
const SOON_DAYS = 30;

export function computeCarStatus(car, services) {
  const now = new Date();

  // Pick the latest entry of each service type (newest date wins; ties broken by higher mileage).
  const byType = new Map();
  for (const s of services) {
    const prior = byType.get(s.type);
    const sd = s.date instanceof Date ? s.date : new Date(s.date);
    if (!prior) {
      byType.set(s.type, { ...s, date: sd });
      continue;
    }
    const pd = prior.date instanceof Date ? prior.date : new Date(prior.date);
    if (sd > pd || (sd.getTime() === pd.getTime() && s.mileage > prior.mileage)) {
      byType.set(s.type, { ...s, date: sd });
    }
  }

  let worst = 'good';
  let nextDueLine = null;
  let nextDueScore = Infinity;

  for (const [type, interval] of Object.entries(SERVICE_INTERVALS)) {
    const last = byType.get(type);
    const fromMileage = last ? last.mileage : 0;
    const fromDate = last ? last.date : (car.createdAt ? new Date(car.createdAt) : now);

    const milesUntilDue = interval.miles != null ? (fromMileage + interval.miles) - car.currentMileage : null;
    const daysUntilDue = interval.months != null
      ? Math.round((fromDate.getTime() + interval.months * 30 * MS_PER_DAY - now.getTime()) / MS_PER_DAY)
      : null;

    const milesPastDue = milesUntilDue != null && milesUntilDue <= 0;
    const milesNearDue = milesUntilDue != null && milesUntilDue > 0 && milesUntilDue <= SOON_MILES;
    const datePastDue = daysUntilDue != null && daysUntilDue <= 0;
    const dateNearDue = daysUntilDue != null && daysUntilDue > 0 && daysUntilDue <= SOON_DAYS;
    const hasMileageInterval = interval.miles != null;

    // Overdue rules:
    //  - mileage interval crossed, OR
    //  - date crossed AND there's no mileage interval to balance it out (e.g., Battery — months only)
    // Otherwise, "soon" if mileage is close, OR if any date condition triggered.
    let typeStatus = 'good';
    if (milesPastDue) {
      typeStatus = 'overdue';
    } else if (datePastDue && !hasMileageInterval) {
      typeStatus = 'overdue';
    } else if (milesNearDue || datePastDue || dateNearDue) {
      typeStatus = 'soon';
    }

    if (rank(typeStatus) > rank(worst)) worst = typeStatus;

    // Score for picking the most-pressing service for the "next due" line:
    // smaller = more pressing. Mileage in mi units, days converted by ×50 so they're commensurate.
    let score = Infinity;
    if (milesUntilDue != null) score = Math.min(score, milesUntilDue);
    if (daysUntilDue != null) score = Math.min(score, daysUntilDue * 50);

    if (score < nextDueScore) {
      nextDueScore = score;
      nextDueLine = {
        type,
        detail: formatNextDue(milesUntilDue, daysUntilDue, typeStatus, hasMileageInterval),
        status: typeStatus,
      };
    }
  }

  return { status: worst, nextDue: nextDueLine };
}

function rank(s) {
  return s === 'overdue' ? 2 : s === 'soon' ? 1 : 0;
}

function formatNextDue(milesUntilDue, daysUntilDue, typeStatus, hasMileageInterval) {
  if (typeStatus === 'overdue') {
    if (milesUntilDue != null && milesUntilDue <= 0) {
      return `overdue by ${Math.abs(milesUntilDue).toLocaleString()} mi`;
    }
    if (daysUntilDue != null && daysUntilDue <= 0) {
      return `overdue by ${Math.abs(daysUntilDue)} days`;
    }
  }

  if (typeStatus === 'soon') {
    // Mileage near due → show miles remaining (most actionable).
    if (milesUntilDue != null && milesUntilDue > 0 && milesUntilDue <= SOON_MILES) {
      return `in ${milesUntilDue.toLocaleString()} mi`;
    }
    // Date is past but mileage is fine → say so without alarming.
    if (daysUntilDue != null && daysUntilDue <= 0 && hasMileageInterval) {
      return `${Math.abs(daysUntilDue)} days past schedule`;
    }
    if (daysUntilDue != null && daysUntilDue > 0 && daysUntilDue <= SOON_DAYS) {
      return `in ${daysUntilDue} days`;
    }
  }

  // Good — show whichever is closer.
  if (milesUntilDue != null && milesUntilDue >= 0) {
    return `in ${milesUntilDue.toLocaleString()} mi`;
  }
  if (daysUntilDue != null && daysUntilDue >= 0) {
    return `in ${daysUntilDue} days`;
  }
  return 'schedule';
}
