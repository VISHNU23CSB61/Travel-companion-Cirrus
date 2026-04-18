/**
 * AviationStack Flight Status Service
 * Free plan: 100 calls/month, no credit card required.
 * Sign up: https://aviationstack.com/ → free plan
 *
 * NOTE: Free plan uses HTTP only (not HTTPS).
 * This works fine on localhost. For production deploy, upgrade to a paid plan.
 */

const BASE_URL = 'http://api.aviationstack.com/v1';

const STORAGE_KEY = 'aura_aviationstack_key';

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ── Status codes → readable labels ── */
export const FLIGHT_STATUS = {
  scheduled:  { label: 'Scheduled',  color: '#3b82f6', emoji: '🗓️' },
  active:     { label: 'In Air',     color: '#10b981', emoji: '✈️' },
  landed:     { label: 'Landed',     color: '#6366f1', emoji: '🛬' },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', emoji: '❌' },
  incident:   { label: 'Incident',   color: '#f59e0b', emoji: '⚠️' },
  diverted:   { label: 'Diverted',   color: '#f59e0b', emoji: '↩️' },
  unknown:    { label: 'Unknown',    color: '#94a3b8', emoji: '❓' },
};

export function getStatus(code) {
  return FLIGHT_STATUS[code] ?? FLIGHT_STATUS.unknown;
}

/** Format ISO datetime → "10:35 AM" */
export function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Format ISO datetime → "Apr 18" */
export function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/** Compute delay in minutes, returns string like "+42 min" */
export function fmtDelay(scheduledIso, actualIso) {
  if (!scheduledIso || !actualIso) return null;
  const diff = Math.round((new Date(actualIso) - new Date(scheduledIso)) / 60000);
  if (diff <= 2) return null;
  return `+${diff} min`;
}

/**
 * Search flights by IATA flight number (e.g. "AI101", "6E123").
 * Returns array of normalized flight objects.
 */
export async function searchFlight(flightIata, apiKey) {
  const key = apiKey || getApiKey();
  if (!key) throw new Error('NO_KEY');

  const clean = flightIata.replace(/\s+/g, '').toUpperCase();

  const params = new URLSearchParams({
    access_key: key,
    flight_iata: clean,
    limit: 5,
  });

  const res = await fetch(`${BASE_URL}/flights?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();

  if (data?.error) {
    if (data.error.code === 101) throw new Error('INVALID_KEY');
    throw new Error(data.error.message ?? 'API error');
  }

  return (data.data ?? []).map(normalizeFlight);
}

/**
 * Fetch real-time departures from an airport (IATA code, e.g. "BOM").
 */
export async function fetchDepartures(iataCode, apiKey) {
  const key = apiKey || getApiKey();
  if (!key) throw new Error('NO_KEY');

  const params = new URLSearchParams({
    access_key: key,
    dep_iata: iataCode.toUpperCase(),
    limit: 10,
    flight_status: 'scheduled,active',
  });

  const res = await fetch(`${BASE_URL}/flights?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  if (data?.error) throw new Error(data.error.message ?? 'API error');

  return (data.data ?? []).map(normalizeFlight);
}

/** Normalize raw AviationStack flight object */
function normalizeFlight(f) {
  const dep = f.departure ?? {};
  const arr = f.arrival ?? {};
  const airline = f.airline ?? {};
  const flight = f.flight ?? {};

  const statusCode = f.flight_status ?? 'unknown';
  const status = getStatus(statusCode);

  const depDelay = fmtDelay(dep.scheduled, dep.actual ?? dep.estimated);
  const arrDelay = fmtDelay(arr.scheduled, arr.actual ?? arr.estimated);

  return {
    // identifiers
    iata:         flight.iata ?? '—',
    icao:         flight.icao ?? '',
    number:       flight.number ?? '',
    statusCode,
    status,

    // airline
    airlineName:  airline.name ?? 'Unknown Airline',
    airlineIata:  airline.iata ?? '',

    // departure
    depAirport:   dep.airport ?? '—',
    depIata:      dep.iata ?? '—',
    depScheduled: dep.scheduled,
    depActual:    dep.actual ?? dep.estimated,
    depGate:      dep.gate ?? null,
    depTerminal:  dep.terminal ?? null,
    depDelay,
    depTime:      fmtTime(dep.actual ?? dep.estimated ?? dep.scheduled),
    depDate:      fmtDate(dep.scheduled),

    // arrival
    arrAirport:   arr.airport ?? '—',
    arrIata:      arr.iata ?? '—',
    arrScheduled: arr.scheduled,
    arrActual:    arr.actual ?? arr.estimated,
    arrGate:      arr.gate ?? null,
    arrTerminal:  arr.terminal ?? null,
    arrDelay,
    arrTime:      fmtTime(arr.actual ?? arr.estimated ?? arr.scheduled),
    arrDate:      fmtDate(arr.scheduled),

    // extra
    aircraft:     f.aircraft?.registration ?? null,
    live:         f.live ?? null,
    raw:          f,
  };
}
