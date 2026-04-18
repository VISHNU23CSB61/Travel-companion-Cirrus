/**
 * Nominatim (OpenStreetMap) Reverse Geocoding Service
 * Completely free, no API key required.
 * Docs: https://nominatim.org/release-docs/latest/api/Reverse/
 */

const BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Convert GPS coordinates to a human-readable location.
 * Returns { city, suburb, state, country, countryCode, displayName }
 */
export async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({
    lat,
    lon,
    format: 'json',
    zoom: 14, // neighbourhood level
    addressdetails: 1,
  });

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data = await res.json();

  const addr = data.address ?? {};
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.county ||
    addr.state;
  const suburb = addr.suburb || addr.neighbourhood || '';
  const country = addr.country || '';
  const countryCode = (addr.country_code || '').toUpperCase();

  // Build a short "Suburb, City" display string
  const shortDisplay = suburb
    ? `${suburb}, ${city}`
    : city;

  return {
    city,
    suburb,
    state: addr.state || '',
    country,
    countryCode,
    shortDisplay,
    displayName: data.display_name,
  };
}
