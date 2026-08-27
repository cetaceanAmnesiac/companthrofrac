export type Extreme = 'min' | 'max' | 'pix';
export const DEFAULT_EXTREME: Extreme = 'min';
export const EXTREME_HANDLES: readonly { extreme: Extreme; desc: string }[] = [
  { extreme: 'min', desc: 'Scale to fit device (no scroll)' },
  { extreme: 'max', desc: 'Scale to fit device (1D scroll)' },
  { extreme: 'pix', desc: 'Scale to pixel-perfect size' },
];
