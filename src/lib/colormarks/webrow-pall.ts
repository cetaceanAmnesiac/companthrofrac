import { type UiMode } from '𝕮⁂𝕮/ui-mode';
import { allOnes, allZeroes, toBitmask, type Bitmask } from '𝕮⁂𝕮/utils/bitmask';
import { Webrow, WEBROWS } from '𝕮⁂𝕮/webrows';

export type WebrowPall = Bitmask<7>;

export const EMPTY_PALL: WebrowPall = allZeroes<7>();
export const FULL_PALL: WebrowPall = allOnes<7>(WEBROWS.length);

export const fromWebrows = (rows: Webrow[]): WebrowPall => {
  const ww = new Set(rows);
  return toBitmask<7>(WEBROWS.map(row => !ww.has(row)));
};

export const ZEN_PALL = fromWebrows([
  Webrow.PANEL,
  Webrow.CONTROLS,
  Webrow.COUNTDOWN,
]);

export const EXTREMAL_PALL = fromWebrows([Webrow.PANEL]);

export const resolveWebrowPall = (
  uiMode: UiMode | null,
  customPall: WebrowPall | null,
  extremal: boolean,
): WebrowPall => {
  if (extremal) return EXTREMAL_PALL;
  switch (uiMode) {
    case 'normal':
      return EMPTY_PALL;
    case 'zen':
      return ZEN_PALL;
    case 'custom':
      return customPall ?? EMPTY_PALL;
    case null:
      return FULL_PALL; // TODO:
  }
};
