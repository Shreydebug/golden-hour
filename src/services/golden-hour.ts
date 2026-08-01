import * as SunCalc from 'suncalc';

import type {
  GeoCoordinates,
  GoldenHourTimes,
  SkyPhase,
  SunPosition,
  MoonData,
  GoldenHourQuality,
  DayForecast,
} from '@/types';

function ensureDate(value: Date | null, fallback: Date): Date {
  return value ?? fallback;
}

function getMoonPhaseName(phase: number, waxing: boolean): string {
  if (phase < 0.05 || phase > 0.95) return 'New Moon';
  if (phase < 0.2) return waxing ? 'Waxing Crescent' : 'Waning Crescent';
  if (phase < 0.3) return 'First Quarter';
  if (phase < 0.45) return waxing ? 'Waxing Gibbous' : 'Waning Gibbous';
  if (phase < 0.55) return 'Full Moon';
  if (phase < 0.7) return waxing ? 'Waxing Gibbous' : 'Waning Gibbous';
  if (phase < 0.8) return 'Last Quarter';
  return waxing ? 'Waxing Crescent' : 'Waning Crescent';
}

function calculateQualityScore(
  date: Date,
  goldenHour: GoldenHourTimes
): GoldenHourQuality {
  let score = 7.0;

  const month = date.getMonth();
  if (month >= 2 && month <= 4) score += 0.8;
  else if (month >= 8 && month <= 10) score += 0.8;
  else score += 0.3;

  const dayLength = goldenHour.dayLength;
  if (dayLength >= 10 && dayLength <= 14) score += 0.7;
  else if (dayLength >= 8 && dayLength <= 16) score += 0.3;
  else score -= 0.5;

  if (goldenHour.bestWindowLabel === 'Evening') score += 0.5;

  const now = date.getTime();
  const windowStart = goldenHour.bestWindowStart.getTime();
  const diffMinutes = (windowStart - now) / (1000 * 60);
  if (diffMinutes >= 0 && diffMinutes <= 120) score += 1.0;
  else if (diffMinutes > 120 && diffMinutes <= 360) score += 0.5;

  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  let label: string;
  if (score >= 9) label = 'Exceptional';
  else if (score >= 8) label = 'Excellent';
  else if (score >= 7) label = 'Great';
  else if (score >= 6) label = 'Good';
  else if (score >= 5) label = 'Fair';
  else label = 'Poor';

  return { score, label };
}

export function calculateGoldenHourTimes(
  date: Date,
  coords: GeoCoordinates
): GoldenHourTimes {
  const { latitude, longitude } = coords;

  const times = SunCalc.getTimes(date, latitude, longitude);

  const sunrise = ensureDate(
    times.sunrise,
    new Date(date.getTime() + 6 * 60 * 60 * 1000)
  );
  const sunset = ensureDate(
    times.sunset,
    new Date(date.getTime() + 18 * 60 * 60 * 1000)
  );
  const solarNoon = times.solarNoon;

  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);

  const morningGoldenHourStart = new Date(sunrise.getTime());
  const morningGoldenHourEnd = new Date(sunrise.getTime() + 60 * 60 * 1000);
  const eveningGoldenHourStart = new Date(sunset.getTime() - 60 * 60 * 1000);
  const eveningGoldenHourEnd = new Date(sunset.getTime());

  const civilTwilightStart = ensureDate(
    times.dawn,
    new Date(sunrise.getTime() - 30 * 60 * 1000)
  );
  const civilTwilightEnd = ensureDate(
    times.dusk,
    new Date(sunset.getTime() + 30 * 60 * 1000)
  );

  const morningBlueHourStart = civilTwilightStart;
  const morningBlueHourEnd = sunrise;
  const eveningBlueHourStart = sunset;
  const eveningBlueHourEnd = civilTwilightEnd;

  const inMorning =
    date >= morningGoldenHourStart && date <= morningGoldenHourEnd;
  const inEvening =
    date >= eveningGoldenHourStart && date <= eveningGoldenHourEnd;

  const bestWindowLabel: 'Morning' | 'Evening' =
    inEvening || (!inMorning && date >= solarNoon) ? 'Evening' : 'Morning';
  const bestWindowStart =
    bestWindowLabel === 'Morning' ? morningGoldenHourStart : eveningGoldenHourStart;

  return {
    sunrise,
    sunset,
    solarNoon,
    dayLength,
    morningGoldenHourStart,
    morningGoldenHourEnd,
    eveningGoldenHourStart,
    eveningGoldenHourEnd,
    morningBlueHourStart,
    morningBlueHourEnd,
    eveningBlueHourStart,
    eveningBlueHourEnd,
    bestWindowStart,
    bestWindowLabel,
    civilTwilightStart,
    civilTwilightEnd,
    nauticalTwilightStart: ensureDate(
      times.nauticalDawn,
      new Date(sunrise.getTime() - 60 * 60 * 1000)
    ),
    nauticalTwilightEnd: ensureDate(
      times.nauticalDusk,
      new Date(sunset.getTime() + 60 * 60 * 1000)
    ),
    astronomicalTwilightStart: ensureDate(
      times.nightEnd,
      new Date(sunrise.getTime() - 90 * 60 * 1000)
    ),
    astronomicalTwilightEnd: ensureDate(
      times.night,
      new Date(sunset.getTime() + 90 * 60 * 1000)
    ),
  };
}

export function getSunPosition(
  date: Date,
  coords: GeoCoordinates
): SunPosition {
  const pos = SunCalc.getPosition(date, coords.latitude, coords.longitude);
  return {
    azimuth: (pos.azimuth * 180) / Math.PI,
    altitude: (pos.altitude * 180) / Math.PI,
  };
}

export function getMoonData(date: Date, coords: GeoCoordinates): MoonData {
  const illumination = SunCalc.getMoonIllumination(date);
  const moonTimes = SunCalc.getMoonTimes(
    date,
    coords.latitude,
    coords.longitude
  );

  return {
    phase: illumination.phase,
    illumination: illumination.fraction,
    waxing: illumination.waxing,
    phaseName: getMoonPhaseName(illumination.phase, illumination.waxing),
    rise: moonTimes.rise ?? null,
    set: moonTimes.set ?? null,
  };
}

export function getGoldenHourQuality(
  date: Date,
  coords: GeoCoordinates
): GoldenHourQuality {
  const goldenHour = calculateGoldenHourTimes(date, coords);
  return calculateQualityScore(date, goldenHour);
}

export function getWeekForecast(
  startDate: Date,
  coords: GeoCoordinates
): DayForecast[] {
  const days: DayForecast[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(12, 0, 0, 0);

    const gh = calculateGoldenHourTimes(date, coords);
    const quality = calculateQualityScore(date, gh);

    days.push({
      date,
      sunrise: gh.sunrise,
      sunset: gh.sunset,
      morningGoldenHourStart: gh.morningGoldenHourStart,
      morningGoldenHourEnd: gh.morningGoldenHourEnd,
      eveningGoldenHourStart: gh.eveningGoldenHourStart,
      eveningGoldenHourEnd: gh.eveningGoldenHourEnd,
      qualityScore: quality.score,
    });
  }
  return days;
}

export function getSkyPhase(
  goldenHour: GoldenHourTimes,
  now: Date = new Date()
): SkyPhase {
  if (now >= goldenHour.morningGoldenHourStart && now <= goldenHour.morningGoldenHourEnd) {
    return 'goldenHour';
  }

  if (now >= goldenHour.eveningGoldenHourStart && now <= goldenHour.eveningGoldenHourEnd) {
    return 'goldenHour';
  }

  if (now >= goldenHour.morningBlueHourStart && now < goldenHour.morningBlueHourEnd) {
    return 'blueHour';
  }

  if (now > goldenHour.eveningBlueHourStart && now <= goldenHour.eveningBlueHourEnd) {
    return 'blueHour';
  }

  if (now >= goldenHour.civilTwilightStart && now < goldenHour.sunrise) {
    return 'morning';
  }

  if (now >= goldenHour.astronomicalTwilightEnd || now >= goldenHour.astronomicalTwilightStart) {
    return 'night';
  }

  return 'day';
}
