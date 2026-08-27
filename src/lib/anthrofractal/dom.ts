/** http://anthrofractal.com/ DOM manipulation */

import { type Extreme } from '𝕮⁂𝕮/colormarks/extreme';

export const warnNull = (warning: string) => (void console.warn(warning), null);

export const READOUT_DIV_ID = 'c12c-reader-readout';
export const getReadoutDiv = () => document.getElementById(READOUT_DIV_ID);

export const getMainDiv = (): HTMLDivElement | null =>
  document.querySelector<HTMLDivElement>('div.main') ??
  warnNull('Main div not found');

export const getPanelImg = (): HTMLImageElement | null => {
  const mainDiv = getMainDiv();
  if (!mainDiv) return null;

  const panelDiv = mainDiv.children[4] as HTMLDivElement | undefined;
  if (!panelDiv) return warnNull('Panel div not found');

  const img = panelDiv.querySelector<HTMLImageElement>('div.col img');
  return img ?? warnNull('Panel image not found');
};

const CONTROLS_INDEX = 5;
const getControlsDiv = (): HTMLDivElement | null =>
  (getMainDiv()?.children[CONTROLS_INDEX] as HTMLDivElement | undefined) ??
  null;

const HREF_PANEL_REGEX = /^\.\.\/(\d+)\/?$/;
/**
 * k = 1 :: - | --- |   2 | N => N
 * 1<k<N :: 1 | k-1 | k+1 | N => N
 * k = N :: 1 | k-1 | --- | - => k-1
 */
export const getLinkedPanelMax = () => {
  const links =
    getControlsDiv()?.querySelectorAll<HTMLAnchorElement>('a[href]');
  if (!links) return null;

  const max = [...links].reduce<number | null>((acc, link) => {
    const match = link.getAttribute('href')?.match(HREF_PANEL_REGEX);
    if (!match) return acc;
    const n = parseInt(match[1], 10);
    return acc === null || n > acc ? n : acc;
  }, null);

  return max;
};

export const addPanelClickListener = (onClick: () => void) => {
  const img = getPanelImg();
  if (!img) return;
  img.classList.add(IMG_CLICKABLE);
  img.addEventListener('click', onClick);
};

export const removePanelClickListener = (onClick: () => void) => {
  const img = getPanelImg();
  if (!img) return;
  img.classList.remove(IMG_CLICKABLE);
  img.removeEventListener('click', onClick);
};

export const extremizePanelImage = (extreme: Extreme) => {
  const img = getPanelImg();
  if (!img) return;
  void restorePanelImage();
  if (extreme === 'min') document.documentElement.classList.add(ROOT);
  getMainDiv()?.classList.add(FULLSCREEN);
  img.closest('div.row')?.classList.add(FULLSCREEN, ROW);
  img.closest('div.col')?.classList.add(FULLSCREEN, COL);
  img.classList.add(
    IMG,
    {
      min: IMG_FIT_MIN,
      max: IMG_FIT_MAX,
      pix: IMG_FIT_PIX,
    }[extreme],
  );
};

export const restorePanelImage = () => {
  const img = getPanelImg();
  if (!img) return;
  document.documentElement.classList.remove(ROOT);
  getMainDiv()?.classList.remove(FULLSCREEN);
  img.closest('div.row')?.classList.remove(FULLSCREEN, ROW);
  img.closest('div.col')?.classList.remove(FULLSCREEN, COL);
  img.classList.remove(IMG, IMG_FIT_MIN, IMG_FIT_PIX, IMG_FIT_MAX);
};

export const IMG_CLICKABLE = 'c12c-clickable-img';
const ROOT = 'c12c-extremal-root';
const FULLSCREEN = 'c12c-viewport-size';
const ROW = 'c12c-extremal-row';
const COL = 'c12c-extremal-col';
const IMG = 'c12c-extremal-img';
const IMG_FIT_MIN = 'c12c-extremal-img-fit-min';
const IMG_FIT_MAX = 'c12c-extremal-img-fit-max';
const IMG_FIT_PIX = 'c12c-extremal-img-fit-pix';
