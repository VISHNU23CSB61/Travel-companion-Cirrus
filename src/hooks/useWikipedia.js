import { useState, useEffect } from 'react';
import { fetchLocationLore } from '../services/wikipediaService';

/**
 * Fetches the best Wikipedia article near the given coordinates.
 * Used by AuraMode to surface real historical / cultural facts.
 * Returns { article, loading, error }
 */
export function useWikipedia(coords) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setArticle(null);

    fetchLocationLore(coords.latitude, coords.longitude)
      .then((art) => {
        if (!cancelled) setArticle(art);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [coords?.latitude, coords?.longitude]);

  return { article, loading, error };
}
