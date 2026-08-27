import { IntCanon } from '𝕮⁂𝕮/utils';

// void '≪≺⭯≻≫☉★⊘';
export type NavStep = '≪' | '≺' | '⭯' | '≻' | '≫';
export type NavKey = NavStep | '☉' | '★' | '⊘';
export type Navigatrix = IntCanon<NavKey>;

export const NAV_STEPS: readonly NavStep[] = ['≪', '≺', '⭯', '≻', '≫'];
export const NAV_KEYS: readonly NavKey[] = [...NAV_STEPS, '☉', '★', '⊘'];
