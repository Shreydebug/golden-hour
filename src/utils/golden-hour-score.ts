import type { GoldenHourQuality, WeatherData } from '@/types';

function scoreLabel(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Great';
  if (score >= 6) return 'Good';
  if (score >= 5) return 'Fair';
  return 'Poor';
}

export function getWeatherAdjustedScore(
  quality: GoldenHourQuality,
  weather: WeatherData | null
): GoldenHourQuality {
  if (!weather) return quality;

  let delta = 0;
  const cloud = weather.cloudCover;
  if (cloud >= 90) delta -= 3;
  else if (cloud >= 70) delta -= 2;
  else if (cloud >= 50) delta -= 1;
  else if (cloud < 20) delta += 0.5;

  if (weather.condition === 'thunderstorm' || weather.condition === 'snow') {
    delta -= 1;
  }

  const score = Math.max(
    1,
    Math.min(10, Math.round((quality.score + delta) * 10) / 10)
  );

  return { score, label: scoreLabel(score) };
}

export function scoreColor(score: number): string {
  if (score >= 8) return 'rgba(255, 255, 255, 0.9)';
  if (score >= 6) return 'rgba(255, 255, 255, 0.6)';
  return 'rgba(255, 255, 255, 0.35)';
}
