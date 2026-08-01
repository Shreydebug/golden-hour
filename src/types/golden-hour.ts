export interface GoldenHourTimes {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  dayLength: number;
  morningGoldenHourStart: Date;
  morningGoldenHourEnd: Date;
  eveningGoldenHourStart: Date;
  eveningGoldenHourEnd: Date;
  morningBlueHourStart: Date;
  morningBlueHourEnd: Date;
  eveningBlueHourStart: Date;
  eveningBlueHourEnd: Date;
  civilTwilightStart: Date;
  civilTwilightEnd: Date;
  nauticalTwilightStart: Date;
  nauticalTwilightEnd: Date;
  astronomicalTwilightStart: Date;
  astronomicalTwilightEnd: Date;
  bestWindowStart: Date;
  bestWindowLabel: 'Morning' | 'Evening';
}

export interface SunPosition {
  azimuth: number;
  altitude: number;
}

export interface MoonData {
  phase: number;
  illumination: number;
  waxing: boolean;
  phaseName: string;
  rise: Date | null;
  set: Date | null;
}

export interface GoldenHourQuality {
  score: number;
  label: string;
}

export interface DayForecast {
  date: Date;
  sunrise: Date;
  sunset: Date;
  morningGoldenHourStart: Date;
  morningGoldenHourEnd: Date;
  eveningGoldenHourStart: Date;
  eveningGoldenHourEnd: Date;
  qualityScore: number;
}

export type SkyPhase =
  | 'goldenHour'
  | 'morning'
  | 'blueHour'
  | 'night'
  | 'day'
  | 'sunrise'
  | 'sunset';
