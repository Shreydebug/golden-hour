export type SpotCategory =
  | 'viewpoint'
  | 'lake'
  | 'mountain'
  | 'beach'
  | 'hilltop'
  | 'park'
  | 'bridge'
  | 'waterfront';

export interface PhotographySpot {
  id: string;
  name: string;
  description: string;
  category: SpotCategory;
  latitude: number;
  longitude: number;
  imageUrl: string;
  rating: number;
  distance: number;
  goldenHourQuality: number;
  crowdLevel: 'low' | 'medium' | 'high';
  parking: boolean;
  walkingDistance: number;
  bestTime: string;
  bestViewingDirection: string;
  tags: string[];
}
