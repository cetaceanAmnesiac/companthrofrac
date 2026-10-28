import { type StationKey } from '𝕮⁂𝕮/colormarks/companthrofacet';
import { type NavStep } from '𝕮⁂𝕮/nav/navigatrix';
import { type UiMode } from '𝕮⁂𝕮/ui-mode';

export type KeyActionType = KeyAction['type'];
export type KeyAction =
  | { type: 'nav'; step: NavStep }
  | { type: 'reveal' }
  | { type: 'restation'; key: StationKey }
  | { type: 'cycleFacet' }
  | { type: 'extremify' }
  | { type: 'cycleExtreme' }
  | { type: 'setUiMode'; mode: UiMode }
  | { type: 'moor' }
  | { type: 'panopticalize' };

export const NULL_ACTION_CODE = '∅' as const;
export type KeyActionCode =
  ReturnType<typeof getKeyActionCode> | typeof NULL_ACTION_CODE;

export const getKeyActionCode = (action: KeyAction) => {
  const { type } = action;
  switch (type) {
    case 'nav':
      return `${type}:${action.step}` as const;
    case 'restation':
      return `${type}:${action.key}` as const;
    case 'setUiMode':
      return `${type}:${action.mode}` as const;
    case 'reveal':
    case 'cycleFacet':
    case 'extremify':
    case 'cycleExtreme':
    case 'moor':
    case 'panopticalize':
      return `${type}` as const;
  }
};
