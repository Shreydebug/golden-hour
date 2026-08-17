'use client';

import { useEffect, useMemo, useState } from 'react';

import { getCitySpots } from '@/data/city-spots';
import { generateNearbySpots } from '@/services/places';
import type { Address, GeoCoordinates, PhotographySpot } from '@/types';

export function usePlaces(
  coords: GeoCoordinates | null,
  address: Address | null
) {
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
      const curated = getCitySpots(address);
      setSpots(curated ?? generateNearbySpots(coords));
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, address?.city, address?.region]);

  return useMemo(() => ({ spots, loading }), [spots, loading]);
}