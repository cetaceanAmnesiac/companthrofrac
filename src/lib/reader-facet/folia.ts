import { type ChoiceCode, type TagResolution } from '𝕮⁂𝕮/anthrofractal/choices';
import {
  getPanelType,
  isIndexedPanel,
  isSpecialPanel,
  type IndexedPanelId,
  type PanelId,
  type PanelIdKey,
  type PanelType,
  type SpecialPanelId,
} from '𝕮⁂𝕮/anthrofractal/panel-id';
import { type PanelRecog } from '𝕮⁂𝕮/anthrofractal/recog';
import { type Colorreducer } from '𝕮⁂𝕮/colormarks/colormarks.model';

export type Folia = { [id in PanelIdKey]?: Folium };
export type Folium = {
  panelId: PanelId;
  revealed: boolean;
  title: string;
  altText?: string;
  imageId?: string;
  resolution?: ChoiceCode[] | TagResolution;
  tags?: string[];
};

export const createBottomFolia = (): Folia => ({});

export const reduceFolia: Colorreducer<'anthrofolia'> = (provided, incoming) =>
  getFoliaEntries(incoming).reduce<Folia>(
    (folia, [panelId, incomingFolium]) => ({
      ...folia,
      [panelId]: {
        ...(folia[panelId] ?? {}),
        ...incomingFolium,
      },
    }),

    { ...(provided ?? createBottomFolia()) },
  );

export type FoliumPatch = Partial<Omit<Folium, 'seen'>>;
export const patchFolium = (existing: Folium, patch: FoliumPatch): Folia => ({
  [existing.panelId]: { ...existing, ...patch },
});

export const createLeaf = (
  recog: PanelRecog,
  img: HTMLImageElement | null,
): Folia => ({ [recog.panelId]: createFolium(recog, img) });

const E404_IMAGE_ID = '404';
export const createFolium = (
  { panelId }: PanelRecog,
  img: HTMLImageElement | null,
): Folium =>
  isSpecialPanel(panelId)
    ? createSpecialFolium(panelId, img)
    : createIndexedFolium(panelId, img);

const createSpecialFolium = (
  panelId: SpecialPanelId,
  img: HTMLImageElement | null,
): Folium => {
  switch (panelId) {
    case '<archive>':
    case '<about>':
      return {
        panelId,
        revealed: false,
        title: panelId,
      };
    case '<Resolver404>':
    case '<noComicPanel>':
    case '<noPanelTag>':
      return {
        panelId,
        revealed: false,
        title: img?.title ?? '',
        altText: img?.alt ?? '',
        imageId: E404_IMAGE_ID,
      };
  }
};

const createIndexedFolium = (
  panelId: IndexedPanelId,
  img: HTMLImageElement | null,
): Folium => ({
  panelId,
  revealed: false,
  title: img?.title ?? '',
  ...(img && {
    altText: img.alt,
    imageId: getPanelImageId(img.src) ?? '',
  }),
  // altText: img?.alt ?? '',
  // imageId: img ? (getPanelImageId(img.src) ?? '') : '',
});

const PANEL_IMAGE_ID_LIKE = /\/panels\/[\w_]*(?<id>AF\_.*)\.gif$/;
const getPanelImageId = (imageUrl: string) =>
  imageUrl.match(PANEL_IMAGE_ID_LIKE)?.[1] ?? null;

// --- selector-esque utils for this colorshape ---

export const getFoliaEntries = (folia: Folia) =>
  Object.entries(folia).map<[PanelIdKey, Folium]>(([k, v]) => [
    castPanelId(k),
    v!,
  ]);

type FoliaQuery = {
  type?: PanelType;
  status?: 'seen' | 'revealed';
};

export const queryFoliaKeys = (
  folia: Folia,
  { type, status }: FoliaQuery = {},
) =>
  getFoliaEntries(folia).reduce<PanelIdKey[]>((keys, [k, folium]) => {
    if (type && getPanelType(k) !== type) return keys;
    if (status === 'revealed' && !folium.revealed) return keys;
    return (keys.push(k), keys);
  }, []);

export type StatusCounts = Record<'seen' | 'revealed', number>;
export type FoliaCounts = Record<PanelType, StatusCounts>;

const EMPTY_COUNTS = (): FoliaCounts => ({
  indexed: { seen: 0, revealed: 0 },
  special: { seen: 0, revealed: 0 },
});

export const countFoliaBy = (folia: Folia): FoliaCounts =>
  getFoliaEntries(folia).reduce<FoliaCounts>((c, [k, { revealed }]) => {
    const bucket = isIndexedPanel(k) ? c.indexed : c.special;
    bucket.seen++;
    if (revealed) bucket.revealed++;
    return c;
  }, EMPTY_COUNTS());

export const getIndexedPanelIds = (folia: Folia) =>
  queryFoliaKeys(folia, { type: 'indexed' }) as IndexedPanelId[];

export const countIndexedFolia = (folia: Folia) =>
  getIndexedPanelIds(folia).length;

const castPanelId = (key: string): PanelIdKey => {
  const n = Number(key);
  return Number.isFinite(n) && n > 0
    ? (n as IndexedPanelId)
    : (key as SpecialPanelId);
};

export const glossFolia = (folia: Folia): string => {
  const { indexed, special } = countFoliaBy(folia);
  return [glossIndexedFolia(indexed), glossSpecialFolia(special)]
    .filter(Boolean)
    .join(' · ');
};

const glossIndexedFolia = ({ seen, revealed }: StatusCounts) =>
  [
    [0, seen].includes(revealed) ? `${seen}` : `${revealed}/${seen}`,
    revealed === 0 ? '⬜︎' : '▣',
    // revealed === 0 ? '○' : '◉',
  ].join(' ');

const glossSpecialFolia = ({ seen, revealed }: StatusCounts) =>
  seen === 0
    ? null
    : [seen > revealed && `${seen - revealed}☆`, revealed > 0 && `${revealed}★`]
        .filter(Boolean)
        .join(' ');

// export const _testGlossFolia = () => {
//   const ix = (seen: number, revealed: number): Folia =>
//     Object.fromEntries(
//       Array.from({ length: seen }, (_, i) => [
//         i + 1,
//         { panelId: i + 1, revealed: i < revealed, title: '' },
//       ]),
//     );
//   const sp = (folia: Folia, seen: number, revealed: number): Folia => {
//     const specials = ['<archive>', '<about>', '<Resolver404>'] as const;
//     return specials.slice(0, seen).reduce<Folia>(
//       (f, id, i) => ({
//         ...f,
//         [id]: { panelId: id, revealed: i < revealed, title: '' },
//       }),
//       folia,
//     );
//   };

//   const cases: [Folia, string][] = [
//     [ix(0, 0), '0 ⬜︎'],
//     [ix(5, 0), '5 ⬜︎'],
//     [ix(5, 3), '3/5 ▣'],
//     [ix(5, 5), '5 ▣'],
//     [sp(ix(5, 3), 2, 0), '3/5 ▣ · 2☆'],
//     [sp(ix(5, 5), 1, 1), '5 ▣ · 1★'],
//     [sp(ix(5, 0), 2, 1), '5 ⬜︎ · 1☆ 1★'],
//     [sp(ix(0, 0), 2, 0), '0 ⬜︎ · 2☆'],
//   ];

//   const results = cases.map(([folia, expected]) => {
//     const actual = glossFolia(folia);
//     return { expected, actual, pass: actual === expected };
//   });
//   console.table(results);
//   return results.every(r => r.pass);
// };
