import type { GeoCoordinates, PhotographySpot, SpotCategory } from '@/types';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const NAME_POOLS: Record<SpotCategory, string[]> = {
  park: [
    'Sunset Meadow Park',
    'Pine Ridge Reserve',
    'Oakwood Gardens',
    'Riverside Park',
    'Cedar Creek Preserve',
    'Willow Grove Park',
    'Fern Canyon Park',
  ],
  viewpoint: [
    'Scenic Overlook',
    'Panorama Point',
    'Skyline Vista',
    'Valley View Lookout',
    'Summit Viewpoint',
    'Horizon Ridge',
    'Crest Trail Vista',
  ],
  hilltop: [
    'Eagle Crest Hill',
    'Bald Knob Summit',
    'Lookout Peak',
    'High Point Trail',
    'Rattlesnake Ridge',
    'Prospect Hill',
    'Signal Mountain',
  ],
  lake: [
    'Mirror Lake Overlook',
    'Bluewater Cove',
    'Lakeview Point',
    'Silver Lake Shore',
    'Crystal Lake Trail',
    'Hidden Lake Basin',
    'Trout Lake Vista',
  ],
  mountain: [
    'Cloud Peak Trail',
    'Alpine Ridge',
    'Granite Pass',
    'Thunder Mountain',
    'Wildcat Peak',
    'Storm Mountain Lookout',
    "Devil's Pulpit",
  ],
  waterfront: [
    'Harbor View Pier',
    'Bayfront Promenade',
    'Riverwalk Landing',
    'Marina Point',
    'Coastal Bend Trail',
    'Estuary Overlook',
    'Wharf View Park',
  ],
  beach: [
    'Sandy Cove Beach',
    'Shell Strand Shore',
    'Dune Point Beach',
    'Tidepool Beach',
    'Golden Sands Shore',
    'Crescent Beach',
    'Driftwood Beach',
  ],
  bridge: [
    'Iron Bridge Crossing',
    'Stone Arch Bridge',
    'Suspension Bridge View',
    'Viaduct Overlook',
    'Canal Bridge Point',
    'Trestle Bridge Park',
    'Covered Bridge Grove',
  ],
};

const BEST_TIME_POOL = [
  'Sunset Golden Hour',
  'Morning Golden Hour',
  'Sunrise',
  'Sunset',
  'Golden Hour',
  'Blue Hour',
  'Twilight',
];

function bestViewingDirectionFor(bestTime: string): string {
  if (/sunrise|morning/i.test(bestTime)) return 'East';
  if (/blue/i.test(bestTime)) return 'Southwest';
  return 'West';
}

const TAG_SETS: Record<SpotCategory, string[]> = {
  park: ['nature', 'quiet', 'trees', 'trails'],
  viewpoint: ['panoramic', 'cityscape', 'sunset', 'overlook'],
  hilltop: ['sunset', 'panoramic', 'viewpoint', 'hiking'],
  lake: ['water', 'reflections', 'sunrise', 'nature'],
  mountain: ['hiking', 'landscape', 'nature', 'sunrise'],
  waterfront: ['water', 'sunset', 'bridge', 'urban'],
  beach: ['beach', 'sunset', 'landscape', 'ocean'],
  bridge: ['architecture', 'urban', 'cityscape', 'sunset'],
};

export function generateNearbySpots(
  coords: GeoCoordinates,
  count: number = 8
): PhotographySpot[] {
  const seed =
    Math.round(coords.latitude * 100) * 1000 +
    Math.round(coords.longitude * 100);

  const categories: SpotCategory[] = [
    'viewpoint',
    'park',
    'hilltop',
    'lake',
    'waterfront',
    'beach',
    'mountain',
    'bridge',
  ];

  const spots: PhotographySpot[] = [];

  for (let i = 0; i < count; i++) {
    const r = seededRandom(seed + i * 7);
    const r2 = seededRandom(seed + i * 13);
    const r3 = seededRandom(seed + i * 23);
    const r4 = seededRandom(seed + i * 31);

    const category = categories[i % categories.length];
    const namePool = NAME_POOLS[category];
    const name = namePool[Math.floor(r * namePool.length)];

    const bearing = r2 * 360;
    const distanceKm = 0.5 + r3 * 9;
    const latOffset =
      (distanceKm / 111.32) * Math.cos((bearing * Math.PI) / 180);
    const lngOffset =
      (distanceKm / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))) *
      Math.sin((bearing * Math.PI) / 180);

    const spotLat = coords.latitude + latOffset;
    const spotLng = coords.longitude + lngOffset;
    const actualDistance = haversineKm(
      coords.latitude,
      coords.longitude,
      spotLat,
      spotLng
    );
    const roundedDist = Math.round(actualDistance * 10) / 10;

    const tags = TAG_SETS[category];
    const rating = Math.round((3.5 + r4 * 1.5) * 10) / 10;
    const goldenHourQuality = Math.round((6 + r * 4) * 10) / 10;
    const walkingDist = Math.round((0.1 + r3 * 1.5) * 10) / 10;

    const crowdLevel =
      goldenHourQuality >= 9
        ? 'high'
        : goldenHourQuality >= 7.5
          ? 'medium'
          : 'low';

    const bestTime =
      BEST_TIME_POOL[Math.floor(r2 * BEST_TIME_POOL.length)];

    const bestViewingDirection = bestViewingDirectionFor(bestTime);

    spots.push({
      id: `nearby-${i}`,
      name,
      description: `A beautiful ${category} location ${roundedDist} km from your current position. Perfect for photography during ${bestTime.toLowerCase()}.`,
      category,
      latitude: spotLat,
      longitude: spotLng,
      imageUrl: '',
      rating,
      distance: roundedDist,
      goldenHourQuality,
      crowdLevel,
      parking: r3 > 0.4,
      walkingDistance: walkingDist,
      bestTime,
      bestViewingDirection,
      tags: [...tags, bestTime.toLowerCase().replace(/\s+/g, ' ')],
    });
  }

  spots.sort((a, b) => a.distance - b.distance);
  return spots;
}

export function getDirectionsUrl(spot: PhotographySpot): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
}

export function getMapboxDirectionsUrl(spot: PhotographySpot): string {
  return `https://www.mapbox.com/directions/?destination=${spot.latitude}%2C${spot.longitude}`;
}
