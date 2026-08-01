'use client';

import { useEffect, useMemo, useState } from 'react';

import { generateNearbySpots } from '@/services/places';
import type { GeoCoordinates, PhotographySpot } from '@/types';

export function usePlaces(coords: GeoCoordinates | null) {
  const [spots, setSpots] = useState<PhotographySpot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coords) {
      setSpots([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      setSpots(generateNearbySpots(coords));
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  return useMemo(() => ({ spots, loading }), [spots, loading]);
}
