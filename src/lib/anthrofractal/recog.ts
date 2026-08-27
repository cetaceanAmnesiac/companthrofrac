import { type IndexedPanelId, type PanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';

export type ImgClass = 'unique' | '404.gif' | null;

export type Recognition = {
  panelId: PanelId | null;
  // enrichment of specific subtypes
  query?: string | null;
  tag?: string;
  allegedIndex?: number;
  allegedTag?: string;
  allegedPath?: string;
};

export type PanelRecog = Recognition & { panelId: PanelId };
export const isPanelRecog = (recog: Recognition | null): recog is PanelRecog =>
  recog !== null && recog.panelId !== null;

// https://anthrofractal.com/comic/1/
export type IndexedPanelRecog = PanelRecog & { panelId: IndexedPanelId };
const createIndexedPanelRecog = (
  panelId: IndexedPanelId,
): IndexedPanelRecog => ({ panelId: panelId });

// https://anthrofractal.com/spam/
// https://anthrofractal.com/comic/spam/
export type Resolver404Recog = PanelRecog & {
  panelId: '<Resolver404>';
  allegedPath?: string;
};
const createResolver404Recog = (allegedPath?: string): Resolver404Recog => ({
  panelId: '<Resolver404>',
  allegedPath,
});

// https://anthrofractal.com/comic/0/
// https://anthrofractal.com/comic/826862268286682628/
export type NoComicPanelRecog = PanelRecog & {
  panelId: '<noComicPanel>';
  allegedIndex?: number;
};
const createNoComicPanelRecog = (allegedIndex?: number): NoComicPanelRecog => ({
  panelId: '<noComicPanel>',
  allegedIndex,
});

// https://anthrofractal.com/comic/search/tag/spam/
export type NoPanelTagRecog = PanelRecog & {
  panelId: '<noPanelTag>';
  allegedTag?: string;
};
const createNoPanelTagRecog = (allegedTag?: string): NoPanelTagRecog => ({
  panelId: '<noPanelTag>',
  allegedTag,
});

// https://anthrofractal.com/comic/about/
export type AboutRecog = PanelRecog & { panelId: '<about>' };
const createAboutRecog = (): AboutRecog => ({ panelId: '<about>' });

// https://anthrofractal.com/comic/archive/
export type ArchiveRecog = PanelRecog & { panelId: '<archive>' };
const createArchiveRecog = (): ArchiveRecog => ({ panelId: '<archive>' });

// https://anthrofractal.com/comic/search/?q=a
export type SearchQueryRecog = Recognition & {
  panelId: null;
  query: string | null;
};
const _createSearchQueryRecog = (query: string | null): SearchQueryRecog => ({
  panelId: null,
  query,
});

// https://anthrofractal.com/comic/search/tag/page-01/
// https://anthrofractal.com/comic/search/tag/hackles/
export type SearchTagRecog = Recognition & { panelId: null; tag: string };
const createSearchTagRecog = (tag: string): SearchTagRecog => ({
  panelId: null,
  tag,
});

const WWWAFCOM_COMIC_SEARCH =
  /^https?:\/\/anthrofractal\.com\/comic\/search([/?#].*)$/;

const WWWAFCOM_COMIC_SEARCH_TAG =
  /^https?:\/\/anthrofractal\.com\/comic\/search\/tag\/([^/?#]+)/;

const WWWAFCOM_COMIC_EXACT =
  /^https?:\/\/anthrofractal\.com\/comic\/([^/?#]+)\/?$/;

/**
 * /comic/42/              + real img   → { panelId: 42, imgClass: 'unique' }
 * /comic/888/             + is404      → { panelId: '<noComicPanel>', allegedIndex: 888 }
 * /comic/0/               + is404      → { panelId: '<noComicPanel>', allegedIndex: 0 }
 * /comic/BBB/             + any        → { panelId: '<Resolver404>', allegedPath: 'BBB' }
 * /comic/archive/         + any        → { panelId: '<archive>' }
 * /comic/about/           + any        → { panelId: '<about>' }
 * /comic/search/tag/X/    + !is404     → { panelId: null, tag: 'X' }
 * /comic/search/tag/spam/ + is404      → { panelId: '<noPanelTag>', allegedTag: 'spam' }
 * /comic/search/?q=…      + any        → null
 * /comic/about/extra/     + any        → { panelId: '<Resolver404>' }
 * anthrofractal.com/foo   + is404      → { panelId: '<Resolver404>' }
 * anthrofractal.com/foo   + !is404     → null
 */
export const recognize = (
  url: string,
  img: HTMLImageElement | null,
): Recognition | null => {
  const hasImg = !!img;
  const is404Gif = isImageNotFound(img?.src);

  // 1. Search branch — before COMIC_EXACT to intercept all /comic/search/...
  if (WWWAFCOM_COMIC_SEARCH.test(url)) {
    const tagMatch = url.match(WWWAFCOM_COMIC_SEARCH_TAG);
    if (tagMatch) {
      const allegedTag = tagMatch[1];
      return hasImg && is404Gif
        ? createNoPanelTagRecog(allegedTag)
        : createSearchTagRecog(allegedTag);
    }
    return null; // bare /comic/search/ or ?q=... — not tracked
  }

  // 2. Anchored /comic/X/ — no extra path segments
  const exact = url.match(WWWAFCOM_COMIC_EXACT);
  if (exact) {
    const segment = exact[1];
    if (segment === 'archive') return createArchiveRecog();
    if (segment === 'about') return createAboutRecog();
    const numeric = /^\d+$/.test(segment) ? parseInt(segment, 10) : NaN;
    return hasImg && !isNaN(numeric)
      ? is404Gif
        ? createNoComicPanelRecog(numeric)
        : createIndexedPanelRecog(numeric)
      : createResolver404Recog(segment);
  }

  // // 3. Any other /comic/... URL (extra path segments, e.g. /comic/about/a)
  // void prettyPrint({ url, COMIC_ANY: matchify(url, WWWAFCOM_COMIC_ANY) });
  // if (WWWAFCOM_COMIC_ANY.test(url)) return createResolver404Recog('');

  // 4. Non-comic URL — only notable if the 404 image is shown
  return is404Gif ? createResolver404Recog('') : null;
};

// https://anthrofractal.com/static/images/404.gif
export const isImageNotFound = (imageUrl = '') =>
  /\/static\/images\/404\.gif$/.test(imageUrl);
