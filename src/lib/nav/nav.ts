import { sendAction } from '𝕮⁂𝕮/actions';
import {
  IndexedPanelId,
  isIndexedPanel,
  isSpecialPanel,
  type PanelId,
  type SpecialPanelId,
} from '𝕮⁂𝕮/anthrofractal/panel-id';
import { ColormarkLedger } from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getAnchor,
  getNavigationHighest,
} from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import {
  nosedemon,
  resolveLedger,
  saveLedger,
} from '𝕮⁂𝕮/colormarks/colormarks.storage';
import { NAV_STEPS, type NavStep } from '𝕮⁂𝕮/nav/navigatrix';
import { createObject, type Pivot } from '𝕮⁂𝕮/utils';

export type NavCourse = Pivot<NavStep, PanelId>;

export const NAV = {
  ...createObject<NavStep, NavStep, () => void>({
    items: NAV_STEPS,
    createValue: step => () => void take(step),
  }),
  '☉': (id: IndexedPanelId) => (): void => void go([, id]),
  '★': (id: SpecialPanelId) => (): void => void go([, id]),
  '⊘': void 'course' as void,
} as const;

const take = async (step: NavStep) => go([step, ,]);
const go = async (course: NavCourse) => {
  const prev = await resolveLedger(nosedemon(`VOID ${course}`));
  const id = resolveCourse(prev, course);
  const next = updateNavigatrix(prev, course, id);
  await saveLedger(next);

  if (id !== null) isSpecialPanel(id) ? _navigateSpecial(id) : _navigateId(id);
};

const _navigateSpecial = (id: SpecialPanelId) => {
  switch (id) {
    case '<archive>':
    case '<about>':
    case '<Resolver404>':
      _navigateUrl(SPECIAL_PANEL_URL[id]);
      break;
    case '<noPanelTag>':
      _navigateTag('ludic-hypersigil');
      break;
    case '<noComicPanel>':
      _navigateId(826);
      break;
  }
};

const SPECIAL_PANEL_URL = {
  '<archive>': 'https://anthrofractal.com/comic/archive/',
  '<about>': 'https://anthrofractal.com/comic/about/',
  '<Resolver404>':
    'https://anthrofractal.com/comic/a-story-that-refers-to-itself-becomes-an-allegory-of-the-mind/',
} as const;

const _navigateId = (panel: number) =>
  sendAction({ action: 'navigate', panel });
const _navigateTag = (tag: string) =>
  sendAction({ action: 'navigateTag', tag });
const _navigateUrl = (url: string) =>
  sendAction({ action: 'navigateUrl', url });

const resolveCourse = (
  ledger: ColormarkLedger,
  [step, id]: NavCourse,
): PanelId | null => {
  if (id !== undefined) return id;
  const anchor = getAnchor(ledger);
  const highest = getNavigationHighest(ledger);
  return resolveStep(step, anchor, highest);
};

export const resolveStep = (
  step: NavStep,
  anchor: PanelId | null,
  highest: PanelId | null,
): PanelId | null =>
  ({
    '≪': 1,
    '≺': isIndexedPanel(anchor) && anchor > 1 ? anchor - 1 : null,
    '⭯': anchor,
    '≻': isIndexedPanel(anchor) ? anchor + 1 : null,
    '≫': highest,
  })[step];

const updateNavigatrix = (
  prev: ColormarkLedger,
  course: NavCourse,
  id: PanelId | null,
) =>
  prev.reduce('navigatrix', {
    [id === null ? '⊘' : (course[0] ?? (isSpecialPanel(id) ? '★' : '☉'))]: 1,
  });
