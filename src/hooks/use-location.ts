'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import * as LocationService from '@/services/location';
import { reverseGeocode } from '@/services/geocoding';
import { useLocationStore } from '@/store';
import type { Address, GeoCoordinates } from '@/types';

interface UseLocationReturn {
  coords: GeoCoordinates | null;
  address: Address | null;
  permissionStatus: LocationService.PermissionStatus | 'unknown';
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  startWatching: () => () => void;
  stopWatching: () => void;
  isWatching: boolean;
}

export function useLocation(): UseLocationReturn {
  const [isWatching, setIsWatching] = useState(false);
  const watcherRef = useRef<{ remove: () => void } | null>(null);

  const {
    coords,
    address,
    permissionStatus,
    loading,
    error,
    setCoords,
    setAddress,
    setPermissionStatus,
    setLoading,
    setError,
  } = useLocationStore();

  const resolveAddress = useCallback(async (c: GeoCoordinates) => {
    const addr = await reverseGeocode(c);
    setAddress(addr);
    return addr;
  }, [setAddress]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const status = await LocationService.checkPermission();
      if (cancelled) return;
      setPermissionStatus(status);

      if (status === 'granted') {
        try {
          const lastKnown = await LocationService.getCurrentPosition();
          if (cancelled) return;
          setCoords(lastKnown);
          await resolveAddress(lastKnown);
        } catch {
          // no cached position available
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setPermissionStatus, setCoords, resolveAddress]);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newCoords = await LocationService.getCurrentPosition();
      setPermissionStatus('granted');
      setCoords(newCoords);
      await resolveAddress(newCoords);
    } catch (err) {
      const status = await LocationService.checkPermission();
      setPermissionStatus(status);
      setError(
        err instanceof Error ? err.message : 'Failed to request location'
      );
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPermissionStatus, setCoords, resolveAddress]);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newCoords = await LocationService.getCurrentPosition();
      setCoords(newCoords);
      await resolveAddress(newCoords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setCoords, resolveAddress]);

  const startWatching = useCallback(() => {
    if (watcherRef.current) {
      watcherRef.current.remove();
    }

    const watcher = LocationService.watchPosition(
      async (newCoords) => {
        setCoords(newCoords);
        await resolveAddress(newCoords);
      },
      (reason) => {
        setError(reason);
      }
    );

    watcherRef.current = watcher;
    setIsWatching(true);

    return () => {
      watcher.remove();
      watcherRef.current = null;
      setIsWatching(false);
    };
  }, [setCoords, resolveAddress, setError]);

  const stopWatching = useCallback(() => {
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
      setIsWatching(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (watcherRef.current) {
        watcherRef.current.remove();
      }
    };
  }, []);

  return {
    coords,
    address,
    permissionStatus,
    loading,
    error,
    requestPermission,
    refreshLocation,
    startWatching,
    stopWatching,
    isWatching,
  };
}
