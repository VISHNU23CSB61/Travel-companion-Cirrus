/**
 * Overpass API (OpenStreetMap) — Real Nearby Places Service
 * Completely free, no API key required.
 * Docs: https://overpass-api.de/
 */

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Category → OSM tags mapping
const CATEGORY_TAGS = {
  food: [
    '["amenity"="restaurant"]',
    '["amenity"="cafe"]',
    '["amenity"="fast_food"]',
    '["amenity"="bakery"]',
  ],
  nature: [
    '["leisure"="park"]',
    '["leisure"="garden"]',
    '["natural"="beach"]',
    '["leisure"="nature_reserve"]',
  ],
  culture: [
    '["tourism"="museum"]',
    '["historic"="monument"]',
    '["tourism"="gallery"]',
    '["amenity"="place_of_worship"]',
    '["historic"="castle"]',
    '["tourism"="attraction"]',
  ],
  nightlife: [
    '["amenity"="bar"]',
    '["amenity"="pub"]',
    '["amenity"="nightclub"]',
    '["amenity"="cinema"]',
  ],
};

// Curated photos per amenity type from Unsplash (static fallback since Overpass has no photos)
const PHOTO_MAP = {
  restaurant:     'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80&auto=format&fit=crop',
  cafe:           'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80&auto=format&fit=crop',
  fast_food:      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80&auto=format&fit=crop',
  bakery:         'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format&fit=crop',
  park:           'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=400&q=80&auto=format&fit=crop',
  garden:         'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80&auto=format&fit=crop',
  beach:          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80&auto=format&fit=crop',
  museum:         'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400&q=80&auto=format&fit=crop',
  monument:       'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80&auto=format&fit=crop',
  gallery:        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80&auto=format&fit=crop',
  place_of_worship:'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80&auto=format&fit=crop',
  castle:         'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=400&q=80&auto=format&fit=crop',
  attraction:     'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80&auto=format&fit=crop',
  bar:            'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=400&q=80&auto=format&fit=crop',
  pub:            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80&auto=format&fit=crop',
  nightclub:      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80&auto=format&fit=crop',
  cinema:         'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80&auto=format&fit=crop',
  nature_reserve: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80&auto=format&fit=crop',
  default:        'https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=400&q=80&auto=format&fit=crop',
};

function getPhoto(tags) {
  const key =
    tags.amenity ||
    tags.leisure ||
    tags.tourism ||
    tags.historic ||
    tags.natural ||
    'default';
  return PHOTO_MAP[key] ?? PHOTO_MAP.default;
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = R * c;
  return meters < 1000
    ? `${Math.round(meters)}m`
    : `${(meters / 1000).toFixed(1)}km`;
}

function buildQuery(lat, lon, tags, radiusMeters = 2000, limit = 8) {
  const nodeQueries = tags
    .map(t => `node${t}(around:${radiusMeters},${lat},${lon});`)
    .join('\n  ');
  return `[out:json][timeout:20];
(
  ${nodeQueries}
);
out body ${limit};`;
}

function normalizeElement(el, userLat, userLon) {
  const name = el.tags?.name || el.tags?.['name:en'] || 'Unnamed Place';
  const type =
    el.tags?.amenity ||
    el.tags?.leisure ||
    el.tags?.tourism ||
    el.tags?.historic ||
    el.tags?.natural ||
    'place';
  return {
    id: el.id,
    name,
    type,
    lat: el.lat ?? el.center?.lat,
    lon: el.lon ?? el.center?.lon,
    distance: calcDistance(userLat, userLon, el.lat ?? el.center?.lat, el.lon ?? el.center?.lon),
    photo: getPhoto(el.tags ?? {}),
    tags: el.tags ?? {},
    // Fake a plausible rating 3.8–5.0 seeded by the OSM ID
    rating: (3.8 + (el.id % 13) / 10).toFixed(1),
    category: type === 'restaurant' || type === 'cafe' || type === 'fast_food' || type === 'bakery'
      ? 'food'
      : type === 'park' || type === 'garden' || type === 'beach' || type === 'nature_reserve'
        ? 'nature'
        : type === 'museum' || type === 'monument' || type === 'gallery' || type === 'castle' || type === 'attraction' || type === 'place_of_worship'
          ? 'culture'
          : 'nightlife',
  };
}

/**
 * Fetch nearby places for a given category and location.
 * @param {number} lat
 * @param {number} lon
 * @param {string} category  'all' | 'food' | 'nature' | 'culture' | 'nightlife'
 */
export async function fetchNearbyPlaces(lat, lon, category = 'all') {
  const tagsToFetch = category === 'all'
    ? Object.values(CATEGORY_TAGS).flat()
    : (CATEGORY_TAGS[category] ?? []);

  const query = buildQuery(lat, lon, tagsToFetch, 2500, 20);

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();

  return (data.elements ?? [])
    .filter(el => el.tags?.name) // only named places
    .map(el => normalizeElement(el, lat, lon))
    .slice(0, 12);
}
