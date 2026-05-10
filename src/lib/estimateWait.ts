// Base wait times in minutes per CTAS level
const BASE_WAIT: Record<number, number> = {
  1: 0,
  2: 15,
  3: 30,
  4: 60,
  5: 120,
};

export function estimateWaitMinutes(
  patientCtasLevel: number,
  queuePosition: number,
  patientsAhead: { ctasLevel: number }[]
): number {
  // Sum the base wait of every patient ahead in queue
  const waitFromQueue = patientsAhead.reduce((total, p) => {
    return total + (BASE_WAIT[p.ctasLevel] ?? 60) * 0.3;
  }, 0);
  return Math.round((BASE_WAIT[patientCtasLevel] ?? 60) + waitFromQueue);
}

export function formatWait(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}
