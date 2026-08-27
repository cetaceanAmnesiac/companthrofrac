import {
  ColormarkLedger,
  type Colorword,
  type ColorwordSet,
  type SparseColormap,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getExpandiosity,
  getFolia,
  getNavKeys,
} from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import { NAV_STEPS, type NavKey } from '𝕮⁂𝕮/nav/navigatrix';
import { countFoliaBy, type FoliaCounts } from '𝕮⁂𝕮/reader-facet/folia';
import { type Transform } from '𝕮⁂𝕮/utils';

type UnlockContext = {
  ledger: ColormarkLedger;
  foliaCounts: FoliaCounts;
  navKeys: Set<NavKey>;
};

type UnlockCondition = (ctx: UnlockContext) => boolean;

const UNLOCK_CONDITIONS: SparseColormap<UnlockCondition> = {
  beachball: ({ foliaCounts }) => foliaCounts.indexed.seen >= 13,
  panelSpan: ({
    foliaCounts: {
      indexed: { seen, revealed },
    },
  }) => seen + revealed >= 26,
  eyes: ({
    foliaCounts: {
      indexed: { seen, revealed },
    },
  }) => seen >= 26 && revealed === seen,
  readout: ({
    foliaCounts: {
      indexed: { seen },
    },
  }) => seen >= 62,
  showMarginalia: ({ ledger }) =>
    Object.values(getExpandiosity(ledger)).filter(Boolean).length >= 5,
  riverline: ({ navKeys }) => NAV_STEPS.every(k => navKeys.has(k)),
  // something: ({ navKeys }) => NAV_STEPS.every(k => k === '⭯' || navKeys.has(k)),
  // eyes: ({
  //   ledger,
  //   foliaCounts: {
  //     special: { seen, revealed },
  //   },
  // }) => seen + revealed + (getAcme(ledger) !== null ? 1 : 0) >= 3,
};

export const applyUnlocks: Transform<ColormarkLedger> = ledger => {
  // compute some stuff once up-front --
  // do not mutate anthrofolia or navigatrix colorwords.
  // realistically these could all be inlined above repeatedly,
  // it would just be too ugly.
  const foliaCounts = countFoliaBy(getFolia(ledger));
  const navKeys = getNavKeys(ledger);

  return (
    Object.entries(UNLOCK_CONDITIONS) as [Colorword, UnlockCondition][]
  ).reduce(
    (l, [word, condition]) =>
      !l.isInked(word) && condition({ ledger: l, foliaCounts, navKeys })
        ? (l.unitize(word) ?? (console.warn(`Failed to unlock ${word}`), l))
        : l,
    ledger,
  );
};

export const applySightings: Transform<ColormarkLedger> = ledger => {
  const seen = ledger.seenMarks();
  return seen.length === 0
    ? ledger
    : ledger.reduce(
        'sightings',
        seen.reduce<ColorwordSet>((acc, w) => ((acc[w] = true), acc), {}),
      );
};
