import { useState, useEffect } from 'react';
import { fetchWeather }    from '../services/weatherService';
import { reverseGeocode }  from '../services/geocodingService';

/**
 * Fetches real weather + city name for the given coordinates.
 * Returns { weather, location, loading, error }
 */
export function useWeather(coords) {
  const [weather,  setWeather]  = useState(null);
  const [location, setLocation] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchWeather(coords.latitude, coords.longitude),
      reverseGeocode(coords.latitude, coords.longitude),
    ])
      .then(([w, loc]) => {
        if (!cancelled) {
          setWeather(w);
          setLocation(loc);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [coords?.latitude, coords?.longitude]);

  return { weather, location, loading, error };
}
