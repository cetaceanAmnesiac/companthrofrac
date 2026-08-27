import { getLinkedPanelMax } from '𝕮⁂𝕮/anthrofractal/dom';
import { isIndexedPanel, type PanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
import { isPanelRecog, recognize } from '𝕮⁂𝕮/anthrofractal/recog';
import {
  getAcme,
  getAnchor,
  getFolia,
  getFolium,
  type Legible,
} from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import {
  nosedemon,
  resolveLedger,
  saveLedger,
  updateLedgerMaybe,
} from '𝕮⁂𝕮/colormarks/colormarks.storage';
import {
  countIndexedFolia,
  createLeaf,
  patchFolium,
} from '𝕮⁂𝕮/reader-facet/folia';
import { stamp } from '𝕮⁂𝕮/utils';

export const sightPanel = async (url: string, img: HTMLImageElement | null) => {
  const recog = recognize(url, img);
  if (!isPanelRecog(recog)) return;
  const { panelId } = recog;
  const prev = await resolveLedger(nosedemon(`CAP-${panelId}`));
  const needsAnchor = shouldMoor(prev, panelId);
  const needsFolium = !getFolium(prev, panelId);
  if (!needsAnchor && !needsFolium)
    return stamp(`SIGHT SKIP #${panelId}`, 'debug');

  let next = prev;
  if (needsAnchor)
    ((next = next.mark('anchor', panelId)),
      stamp(`moor(#${panelId})`, 'debug'));
  if (needsFolium)
    ((next = next.reduce('anthrofolia', createLeaf(recog, img))),
      stamp(`createLeaf(#${panelId})`, 'debug'));
  await saveLedger(next);
};

const ALLOW_MOOR_SPECIAL_PANELS = true;
const shouldMoor = (l: Legible, panelId: PanelId) =>
  (ALLOW_MOOR_SPECIAL_PANELS || isIndexedPanel(panelId)) &&
  panelId !== getAnchor(l);

export const revealPanel = async (
  url: string,
  img: HTMLImageElement | null,
) => {
  const recog = recognize(url, img);
  if (!isPanelRecog(recog)) return;
  await revealPanelById(recog.panelId);
};

const ACME_FOLIA_RATIO = 0.8;
export const updateAcme = () =>
  updateLedgerMaybe(prev => {
    const linkedMax = getLinkedPanelMax();
    if (linkedMax === null) return;
    const anchor = getAnchor(prev);
    const atFrontier = isIndexedPanel(anchor) && anchor === linkedMax + 1;
    const frontier = atFrontier ? anchor : linkedMax;
    const acme = getAcme(prev);
    const proceed =
      acme !== null
        ? frontier > acme
        : atFrontier &&
          countIndexedFolia(getFolia(prev)) >= ACME_FOLIA_RATIO * frontier;
    if (!proceed) return;
    stamp(`ACME #${frontier}`);
    return prev.mark('acme', frontier);
  }, nosedemon('ACME'));

const ALLOW_RERAVEL = true;
const revealPanelById = async (id: PanelId) => {
  const prev = await resolveLedger(nosedemon(`REV-${id}`));
  const existing = getFolium(prev, id);
  if (!existing) {
    void stamp(`REVEAL FAIL #${id}`, 'warn');
    return;
  }

  const willReveal = ALLOW_RERAVEL ? !existing.revealed : true;
  void stamp(`${willReveal ? 'REVEAL' : 'RERAVEL'} #${id}`);

  const next = prev.reduce(
    'anthrofolia',
    patchFolium(existing, { revealed: willReveal }),
  );
  await saveLedger(next);
};
