export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatShortDay(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);
}

export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°`;
}

export function formatTemperatureUnit(unit: 'metric' | 'imperial'): string {
  return unit === 'metric' ? '°C' : '°F';
}

export function formatWindSpeed(
  ms: number,
  unit: 'metric' | 'imperial' = 'metric'
): string {
  if (unit === 'imperial') {
    return `${Math.round(ms * 2.237)} mph`;
  }
  return `${Math.round(ms * 3.6)} km/h`;
}

export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatCountdown(targetDate: Date): string {
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) return 'Now';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function formatDirection(degrees: number): string {
  return DIRECTIONS[Math.round(degrees / 45) % 8];
}

export function formatAltitude(degrees: number): string {
  return `${Math.round(degrees)}°`;
}
