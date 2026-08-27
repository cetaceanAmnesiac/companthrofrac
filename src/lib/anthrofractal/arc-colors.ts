import { type WRBYG } from '𝕮⁂𝕮/anthrofractal/choices';

// cf. arc-colors.css
export enum ArcColor {
  RED = '#df0707',
  BLUE = '#0760cd',
  YELLOW = '#f8e915',
  GREEN = '#09b535',
}

export const ARC_COLORS: readonly ArcColor[] = [
  ArcColor.RED,
  ArcColor.BLUE,
  ArcColor.YELLOW,
  ArcColor.GREEN,
];

export const WHITE_AF = '#ffffff';
export const BLACK_AF = '#0f0f0f';

export const getWrbygHex = (c: WRBYG) => WRBYG_HEX[c];
export const WRBYG_HEX: Record<WRBYG, string> = {
  W: WHITE_AF,
  R: ArcColor.RED,
  B: ArcColor.BLUE,
  Y: ArcColor.YELLOW,
  G: ArcColor.GREEN,
};

export const wrbygToHex = (code: string | null): string | null =>
  code && code in WRBYG_HEX ? WRBYG_HEX[code as WRBYG] : null;
