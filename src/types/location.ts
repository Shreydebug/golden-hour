export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
}

export interface Address {
  city: string | null;
  region: string | null;
  country: string | null;
  street: string | null;
  name: string | null;
  label: string;
}
