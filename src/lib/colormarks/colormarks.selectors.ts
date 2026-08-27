import { type PanelMetadata } from '@/data/metadata';
import {
  SPECIAL_PANEL_IDS,
  type PanelId,
  type PanelIdKey,
} from '𝕮⁂𝕮/anthrofractal/panel-id';
import { type SpecialBadgeProps } from '𝕮⁂𝕮/colormarks/SpecialPanelBadge.svelte';
import {
  type Colorshapes,
  type Colorword,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import { type BooleanColorword } from '𝕮⁂𝕮/colormarks/colormarks.types';
import {
  DEFAULT_COMPANTHROFACET,
  type Companthrofacet,
} from '𝕮⁂𝕮/colormarks/companthrofacet';
import { resolveWebrowPall, type WebrowPall } from '𝕮⁂𝕮/colormarks/webrow-pall';
import { type PanelMapTileProps } from '𝕮⁂𝕮/marks-facet/PanelMapTile.svelte';
import { NAV } from '𝕮⁂𝕮/nav/nav';
import { type NavKey, type Navigatrix } from '𝕮⁂𝕮/nav/navigatrix';
import {
  createBottomFolia,
  getIndexedPanelIds,
  type Folia,
  type Folium,
} from '𝕮⁂𝕮/reader-facet/folia';
import {
  countDisjointRange,
  nTuple,
  rangeExtrema,
  toDisjointRange,
} from '𝕮⁂𝕮/utils';

export type Legible = {
  produce: <W extends Colorword>(word: W) => Colorshapes[W] | null;
  produceBit: <W extends BooleanColorword>(word: W) => boolean;
};

export const getFacet = (ledger: Legible): Companthrofacet =>
  ledger.produce('companthrofacet') ?? DEFAULT_COMPANTHROFACET;

export const getEffectivePall = (ledger: Legible): WebrowPall => {
  const uiMode = ledger.produce('uiMode');
  const customPall = ledger.produce('pall');
  const extremal = ledger.produceBit('extremal');
  return resolveWebrowPall(uiMode, customPall, extremal);
};

export const getAnchor = (ledger: Legible) => ledger.produce('anchor');

export const getAcme = (ledger: Legible) => ledger.produce('acme');

/** acme if unlocked, otherwise highest visited panel */
export const getNavigationHighest = (ledger: Legible): number | null =>
  getAcme(ledger) ?? getHighestFolium(ledger);

export const getNavigatrix = (ledger: Legible): Navigatrix =>
  ledger.produce('navigatrix') ?? {};

export const getNavKeys = (ledger: Legible) =>
  new Set(Object.keys(getNavigatrix(ledger)) as NavKey[]);

export const getSeenColorwords = (ledger: Legible) =>
  new Set(Object.keys(ledger.produce('sightings') ?? {}) as Colorword[]);

export const getExpandiosity = (ledger: Legible) =>
  ledger.produce('expandiosity') ?? {};

export const getFolia = (ledger: Legible): Folia =>
  ledger.produce('anthrofolia') ?? createBottomFolia();

export const getFolium = (ledger: Legible, panelId: PanelId): Folium | null =>
  getFolia(ledger)[panelId as PanelIdKey] ?? null;

export const getHighestFolium = (ledger: Legible) => {
  const keys = getIndexedPanelIds(getFolia(ledger));
  return keys.length ? Math.max(...keys) : null;
};

const INFER_PANEL_1 = true;
export const getPanelBadgeProps = (
  ledger: Legible,
  metadata: PanelMetadata | null,
): PanelMapTileProps[] => {
  const folia = getFolia(ledger);
  const anchor = getAnchor(ledger);
  const forceDiegesis = ledger.produceBit('forceDiegesis');
  const riverline = ledger.produceBit('riverline');
  const acme = ledger.produce('acme');
  const omnifolia = ledger.produceBit('omnifolia');

  const useMetadata = !forceDiegesis && metadata !== null;

  const foliaKeys = getIndexedPanelIds(folia);
  const foliaSupport = toDisjointRange(foliaKeys);

  if (countDisjointRange(foliaSupport) === 0) return [];

  const [minFolium, maxFolium] = rangeExtrema(foliaSupport);

  const [minPanel, maxPanel] = [
    INFER_PANEL_1 ? 1 : minFolium,
    omnifolia && acme !== null ? acme : maxFolium,
  ];

  return nTuple<PanelMapTileProps>(maxPanel - minPanel + 1, k => {
    const panelIndex = k + minPanel;
    const folium = folia[panelIndex] ?? null;
    const metadatum = useMetadata ? metadata.get(panelIndex) : null;

    return {
      index: panelIndex,
      seen: !!folium,
      revealed: !!folium?.revealed,
      nomianiColor: metadatum?.nomianiColor ?? null,
      choices: metadatum?.choices?.map(([c]) => c) ?? null,
      resolution: Array.isArray(metadatum?.resolution)
        ? metadatum.resolution
        : null,
      title: folium?.title ?? '',
      current: true || panelIndex === anchor,
      onclick: riverline && folium?.revealed ? NAV['☉'](panelIndex) : undefined,
    };
  });
};

export const getSpecialBadgeProps = (ledger: Legible): SpecialBadgeProps[] => {
  const folia = getFolia(ledger);
  const anchor = getAnchor(ledger);
  const riverline = ledger.produceBit('riverline');
  return SPECIAL_PANEL_IDS.filter(id => !!folia[id]).map(id => {
    const folium = folia[id]!;
    return {
      panelId: id,
      folium,
      isCurrent: anchor === id,
      onclick: riverline && folium.revealed ? NAV['★'](id) : undefined,
    };
  });
};
