import type { GeoCoordinates, WeatherData, WeatherCondition } from '@/types';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const WMO_CONDITIONS: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'partlyCloudy',
  2: 'partlyCloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'drizzle',
  57: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

function mapWeatherCode(code: number): WeatherCondition {
  return WMO_CONDITIONS[code] ?? 'clear';
}

interface OpenMeteoCurrent {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  weather_code?: number;
  cloud_cover?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  visibility?: number;
  pressure_msl?: number;
}

interface OpenMeteoResponse {
  current?: OpenMeteoCurrent;
  daily?: {
    precipitation_probability_max?: number[];
    uv_index_max?: number[];
  };
}

async function fetchAirQualityIndex(
  coords: GeoCoordinates
): Promise<number | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      current: 'us_aqi',
      timezone: 'auto',
    });
    const res = await fetch(`${OPEN_METEO_AQI_URL}?${params.toString()}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: { us_aqi?: number };
    };
    const aqi = data.current?.us_aqi;
    return typeof aqi === 'number' && isFinite(aqi) ? aqi : null;
  } catch {
    return null;
  }
}

function mockAirQualityIndex(coords: GeoCoordinates): number {
  const r = seededRandom(coords.latitude * 7 + coords.longitude * 13 + 42);
  return Math.round(18 + r * 52);
}

async function fetchOpenMeteo(
  coords: GeoCoordinates
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(coords.latitude),
    longitude: String(coords.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,visibility,pressure_msl',
    daily: 'precipitation_probability_max,uv_index_max',
    timezone: 'auto',
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Weather API error');

  const data = (await res.json()) as OpenMeteoResponse;
  const current = data.current ?? {};
  const condition = mapWeatherCode(current.weather_code ?? 0);

  const aqi = await fetchAirQualityIndex(coords);

  return {
    temperature: current.temperature_2m ?? 20,
    feelsLike: current.apparent_temperature ?? current.temperature_2m ?? 20,
    humidity: current.relative_humidity_2m ?? 50,
    cloudCover: current.cloud_cover ?? 0,
    rainChance: data.daily?.precipitation_probability_max?.[0] ?? 0,
    windSpeed: current.wind_speed_10m ?? 0,
    windDirection: current.wind_direction_10m ?? 0,
    visibility: current.visibility ?? 10000,
    pressure: current.pressure_msl ?? 1013,
    uvIndex: data.daily?.uv_index_max?.[0] ?? 0,
    airQualityIndex: aqi ?? mockAirQualityIndex(coords),
    condition,
    icon: condition,
  };
}

export async function getWeatherData(
  _date: Date,
  coords: GeoCoordinates
): Promise<WeatherData> {
  try {
    return await fetchOpenMeteo(coords);
  } catch {
    return getMockWeatherData(new Date(), coords);
  }
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getTemperatureBase(latitude: number, month: number): number {
  const absLat = Math.abs(latitude);
  const isNorth = latitude >= 0;
  const seasonalOffset = isNorth
    ? Math.cos(((month - 7) / 6) * Math.PI) * 12
    : Math.cos(((month - 1) / 6) * Math.PI) * 12;
  return 30 - absLat * 0.45 + seasonalOffset;
}

function getHourFactor(hour: number): number {
  return -Math.cos(((hour - 14) / 12) * Math.PI) * 0.5 + 0.5;
}

function pickCondition(
  cloudCover: number,
  humidity: number,
  lat: number,
  seed: number
): WeatherCondition {
  const r = seededRandom(seed + 999);

  if (cloudCover < 15) return 'clear';
  if (cloudCover < 40) return 'partlyCloudy';
  if (cloudCover < 65) return 'cloudy';

  if (humidity > 85 && lat < 40) return r > 0.6 ? 'thunderstorm' : 'rain';
  if (humidity > 75) return r > 0.7 ? 'rain' : 'overcast';
  if (humidity > 65) return r > 0.8 ? 'drizzle' : 'overcast';

  if (lat > 60 && cloudCover > 80) return r > 0.9 ? 'snow' : 'overcast';

  return 'overcast';
}

export function getMockWeatherData(
  date: Date,
  coords: GeoCoordinates
): WeatherData {
  const { latitude, longitude } = coords;
  const month = date.getMonth();
  const hour = date.getHours();
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );

  const seed = latitude * 100 + longitude * 200 + dayOfYear;
  const r = seededRandom(seed);
  const r2 = seededRandom(seed + 50);

  const tempBase = getTemperatureBase(latitude, month);
  const hourFactor = getHourFactor(hour);
  const temperature =
    Math.round((tempBase + hourFactor * 6 - 3 + (r - 0.5) * 4) * 10) / 10;
  const feelsLike =
    Math.round((temperature + (r - 0.5) * 3 - 1) * 10) / 10;

  const humidity = Math.round(
    Math.max(25, Math.min(100, 40 + r * 45 + (latitude > 0 ? 5 : -5)))
  );

  const cloudCover = Math.round(
    Math.max(
      0,
      Math.min(100, 20 + r2 * 70 + Math.sin(dayOfYear * 0.05) * 10)
    )
  );

  const visibility =
    cloudCover > 70
      ? Math.round(2000 + r * 8000)
      : cloudCover > 40
        ? Math.round(5000 + r * 10000)
        : Math.round(12000 + r * 8000);

  const airQualityIndex = mockAirQualityIndex(coords);

  const windSpeed = Math.round((2 + r * 8) * 10) / 10;
  const windDirection = Math.round(r * 360);
  const pressure = Math.round(1013 + (r - 0.5) * 30);
  const uvIndex = Math.round(
    Math.max(
      0,
      Math.min(
        11,
        (hour >= 6 && hour <= 18
          ? (1 - Math.abs(hour - 12) / 6) * 10
          : 0) + (r - 0.5) * 2
      )
    )
  );
  const rainChance = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        humidity > 70 ? (humidity - 60) * 2 + r * 20 : r * 15
      )
    )
  );

  const condition = pickCondition(cloudCover, humidity, latitude, seed);

  return {
    temperature,
    feelsLike,
    humidity,
    cloudCover,
    rainChance,
    windSpeed,
    windDirection,
    visibility,
    pressure,
    uvIndex,
    airQualityIndex,
    condition,
    icon: condition,
  };
}
