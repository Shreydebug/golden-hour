'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  calculateGoldenHourTimes,
  getGoldenHourQuality,
  getMoonData,
  getSkyPhase,
  getSunPosition,
  getWeekForecast,
} from '@/services/golden-hour';
import type { GeoCoordinates } from '@/types';

export function useGoldenHour(coords: GeoCoordinates | null) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!coords) return null;

    const times = calculateGoldenHourTimes(now, coords);
    const quality = getGoldenHourQuality(now, coords);
    const sunPosition = getSunPosition(now, coords);
    const moonData = getMoonData(now, coords);
    const forecast = getWeekForecast(now, coords);
    const skyPhase = getSkyPhase(times, now);

    return {
      times,
      quality,
      sunPosition,
      moonData,
      forecast,
      skyPhase,
      now,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, now]);
}
