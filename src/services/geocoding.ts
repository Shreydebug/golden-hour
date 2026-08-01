import type { Address, GeoCoordinates } from '@/types';

const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export async function reverseGeocode(coords: GeoCoordinates): Promise<Address> {
  const fallback: Address = {
    city: null,
    region: null,
    country: null,
    street: null,
    name: null,
    label: 'Current location',
  };

  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding error');

    const data = await res.json();
    const city = data.city ?? data.locality ?? data.principalSubdivision ?? null;
    const region = data.principalSubdivision ?? null;
    const country = data.countryName ?? null;
    const street = data.street ?? null;
    const name = data.locality ?? null;

    const parts = [city, region].filter(Boolean);
    const label =
      parts.length > 0 ? parts.join(', ') : name || street || 'Current location';

    return { city, region, country, street, name, label };
  } catch {
    return fallback;
  }
}

export function formatCoordinates(coords: GeoCoordinates): string {
  return `${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`;
}
