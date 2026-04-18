import { useState, useEffect } from 'react';
import { fetchNearbyPlaces } from '../services/placesService';

/**
 * Fetches real nearby places from the Overpass API (OpenStreetMap).
 * Re-fetches whenever coords or category changes.
 * Returns { places, loading, error, refetch }
 */
export function usePlaces(coords, category = 'all') {
  const [places,  setPlaces]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const load = (lat, lon, cat) => {
    setLoading(true);
    setError(null);
    fetchNearbyPlaces(lat, lon, cat)
      .then(setPlaces)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!coords) return;
    load(coords.latitude, coords.longitude, category);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, category]);

  return {
    places,
    loading,
    error,
    refetch: () => coords && load(coords.latitude, coords.longitude, category),
  };
}
