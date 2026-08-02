export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  cloudCover: number;
  rainChance: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  airQualityIndex: number;
  condition: WeatherCondition;
  icon: string;
}

export type WeatherCondition =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'fog'
  | 'haze'
  | 'dust';
