import { modularIndex } from '𝕮⁂𝕮/utils';

export type Companthrofacet = 'reader' | 'marks' | 'config';
export const DEFAULT_COMPANTHROFACET: Companthrofacet = 'reader';

export type StationKey = 1 | 2 | 3;
export const STATION_FACETS: Record<StationKey, Companthrofacet> = {
  [1]: 'reader',
  [2]: 'marks',
  [3]: 'config',
};
export const isStationKey = (n: number): n is StationKey => n in STATION_FACETS;

export type StationHandle = readonly [facet: Companthrofacet, label: string];
export const STATION_HANDLES: readonly StationHandle[] = [
  ['reader', '◉ read'],
  ['marks', '◈ marks'],
  ['config', '⚙ settings'],
];

export const restation = (
  target: Companthrofacet,
  current: Companthrofacet | null = null,
) => (target !== current ? target : getNextFacet(target));

export const cycleFacet = (current: Companthrofacet | null = null) =>
  current === null ? DEFAULT_COMPANTHROFACET : getNextFacet(current);

export const getNextFacet = (facet: Companthrofacet) => {
  const i = STATION_HANDLES.findIndex(([f]) => f === facet);
  return modularIndex(STATION_HANDLES, i + 1)[0];
};
