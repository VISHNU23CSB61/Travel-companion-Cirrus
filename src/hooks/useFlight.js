import { useState, useCallback } from 'react';
import { searchFlight, fetchDepartures } from '../services/flightService';

/**
 * Hook for searching a specific flight by IATA number.
 */
export function useFlightSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [query,   setQuery]   = useState('');

  const search = useCallback(async (flightNumber) => {
    if (!flightNumber.trim()) return;
    setQuery(flightNumber);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const data = await searchFlight(flightNumber);
      setResults(data);
      if (data.length === 0) setError('NO_RESULTS');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, query, search, setResults, setError };
}

/**
 * Hook for fetching departures from a given airport.
 */
export function useAirportDepartures(iataCode) {
  const [flights,  setFlights]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const load = useCallback(async (code) => {
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDepartures(code);
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { flights, loading, error, load };
}
