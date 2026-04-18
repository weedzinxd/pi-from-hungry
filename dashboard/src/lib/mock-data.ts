import type { CrisisEvent } from '@/types/domain';

export const mockCrisisEvents: CrisisEvent[] = [
  {
    id: '1',
    location: 'Central Sahel',
    country: 'Mali, Niger, Burkina Faso',
    region: 'Africa',
    severity: 'CRITICAL',
    affected: 31500000,
    piNeeded: 23150318509,
    piDistributed: 2100000,
    peopleHelped: 850000,
    description: 'Severe drought + armed conflict forcing mass displacement.',
    gvcActive: true,
    coordinates: [16, 2],
    satelliteUrl:
      'https://firms.modaps.eosdis.nasa.gov/map/ff/firemap.ajax.php?sat=VIIRS&ci=25&cv=1&ct=1&reg=af&cog=1&source=IFF',
    liveData: { temperature: 42, humidity: 15, windSpeed: 25, drought: 'EXTREME' },
    news: '3.5M children under 5 malnourished',
  },
  {
    id: '2',
    location: 'Yemen',
    country: 'Yemen',
    region: 'Middle East',
    severity: 'CRITICAL',
    affected: 21000000,
    piNeeded: 15433660069,
    piDistributed: 1800000,
    peopleHelped: 720000,
    description: 'Humanitarian blockade + civil war creating famine conditions.',
    gvcActive: true,
    coordinates: [15.5, 48],
    satelliteUrl:
      'https://firms.modaps.eosdis.nasa.gov/map/ff/firemap.ajax.php?sat=VIIRS&ci=25&cv=1&ct=1&reg=mideast&cog=1&source=IFF',
    liveData: { temperature: 38, humidity: 30, windSpeed: 12, drought: 'SEVERE' },
    news: 'UN: 21M need immediate food assistance',
  },
];
