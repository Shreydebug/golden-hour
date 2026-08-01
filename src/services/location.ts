import type { GeoCoordinates } from '@/types';

export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

const GEOLOCATION_TIMEOUT = 15000;

function isGeolocationAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

export async function checkPermission(): Promise<PermissionStatus> {
  if (!isGeolocationAvailable()) return 'unavailable';

  try {
    const permission = await navigator.permissions.query({
      name: 'geolocation',
    } as PermissionDescriptor);
    if (permission.state === 'granted') return 'granted';
    if (permission.state === 'denied') return 'blocked';
    return 'denied';
  } catch {
    return 'denied';
  }
}

export function getCurrentPosition(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = 'Failed to get location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location access was denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location is currently unavailable';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 5 * 60 * 1000,
      }
    );
  });
}

export function watchPosition(
  callback: (coords: GeoCoordinates) => void,
  onError?: (reason: string) => void
): { remove: () => void } {
  if (!isGeolocationAvailable()) {
    onError?.('Geolocation is not supported by this browser');
    return { remove: () => {} };
  }

  const id = navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      onError?.(error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 30000,
    }
  );

  return {
    remove: () => navigator.geolocation.clearWatch(id),
  };
}

export function openSettings(): void {
  if (typeof navigator === 'undefined') return;
  window.location.reload();
}
