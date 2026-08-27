export type Companthrofacet = 'reader' | 'marks' | 'config';
export const DEFAULT_COMPANTHROFACET: Companthrofacet = 'reader';

export type StationKey = 1 | 2 | 3;
export const STATION_FACETS: Record<StationKey, Companthrofacet> = {
  [1]: 'reader',
  [2]: 'marks',
  [3]: 'config',
};
export const isStationKey = (n: number): n is StationKey => n in STATION_FACETS;

export type StationHandle = [facet: Companthrofacet, label: string];
export const STATION_HANDLES: readonly StationHandle[] = [
  ['reader', '◉ read'],
  ['marks', '◈ marks'],
  ['config', '⚙ settings'],
];
