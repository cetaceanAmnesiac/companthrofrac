declare const ℓ: unique symbol;
export type PanelId = PanelIdKey & { readonly [ℓ]?: never };
export type PanelIdKey = IndexedPanelId | SpecialPanelId;
export type PanelType = 'indexed' | 'special';

export type IndexedPanelId = number;
export type SpecialPanelId =
  '<archive>' | '<about>' | '<Resolver404>' | '<noComicPanel>' | '<noPanelTag>';

export const SPECIAL_PANEL_IDS: readonly SpecialPanelId[] = [
  '<archive>',
  '<about>',
  '<Resolver404>',
  '<noComicPanel>',
  '<noPanelTag>',
];

export const getPanelType = (id: PanelId | null): PanelType | null =>
  isIndexedPanel(id) ? 'indexed' : isSpecialPanel(id) ? 'special' : null;
export const isIndexedPanel = (id: PanelId | null): id is IndexedPanelId =>
  typeof id === 'number';
export const isSpecialPanel = (id: PanelId | null): id is SpecialPanelId =>
  typeof id === 'string';

export const getPanelTooltip = (id: PanelId | null) =>
  isSpecialPanel(id) ? id : undefined;

export const getPanelLabel = (id: PanelId | null) =>
  isIndexedPanel(id) ? `#${id}` : isSpecialPanel(id) ? '★' : '—';
