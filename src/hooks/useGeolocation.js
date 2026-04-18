import { useState, useEffect } from 'react';

/**
 * Requests the browser's Geolocation API.
 * Returns { coords, error, loading }
 * - coords: { latitude, longitude, accuracy }
 */
export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    const onSuccess = (pos) => {
      setCoords({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy:  pos.coords.accuracy,
      });
      setLoading(false);
    };

    const onError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60_000,       // cache for 1 minute
    });
  }, []);

  return { coords, error, loading };
}
