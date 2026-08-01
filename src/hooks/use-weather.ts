'use client';

import { useEffect, useMemo, useState } from 'react';

import { getWeatherData } from '@/services/weather';
import type { GeoCoordinates, WeatherData } from '@/types';

export function useWeather(coords: GeoCoordinates | null) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords) {
      setWeather(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const current = coords;

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeatherData(new Date(), current);
        if (!cancelled) setWeather(data);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : 'Failed to fetch weather'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();

    const interval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  return useMemo(
    () => ({ weather, loading, error }),
    [weather, loading, error]
  );
}
