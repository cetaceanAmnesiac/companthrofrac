import { modularIndex } from '𝕮⁂𝕮/utils/utils';

export type Extreme = 'min' | 'max' | 'pix';
export const DEFAULT_EXTREME: Extreme = 'min';

export type ExtremeHandle = readonly [extreme: Extreme, desc: string];
export const EXTREME_HANDLES: readonly ExtremeHandle[] = [
  ['min', 'Scale to fit device (no scroll)'],
  ['max', 'Scale to fit device (1D scroll)'],
  ['pix', 'Scale to pixel-perfect size'],
];

export const cycleExtreme = (current: Extreme | null = null) =>
  current === null ? DEFAULT_EXTREME : getNextExtreme(current);

export const getNextExtreme = (extreme: Extreme) => {
  const i = EXTREME_HANDLES.findIndex(([e]) => e === extreme);
  return modularIndex(EXTREME_HANDLES, i + 1)[0];
};
