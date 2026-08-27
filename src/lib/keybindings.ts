import { sendAction } from '𝕮⁂𝕮/actions';
import { updateLedger } from '𝕮⁂𝕮/colormarks/colormarks.storage';
import {
  isStationKey,
  STATION_FACETS,
  STATION_HANDLES,
  StationKey,
  type Companthrofacet,
} from '𝕮⁂𝕮/colormarks/companthrofacet';
import { NAV } from '𝕮⁂𝕮/nav/nav';
import { type UiMode } from '𝕮⁂𝕮/ui-mode';

export type KeyHandlerOptions = {
  onSight: () => void;
  onReveal: () => void;
  setFacet?: (facet: Companthrofacet) => void;
  getFacet?: () => Companthrofacet | null;
  setUiMode?: (mode: UiMode) => void;
  toast?: (msg: string) => void;
};

export const createKeyHandler =
  ({
    onSight,
    onReveal,
    setFacet,
    getFacet,
    setUiMode,
    toast,
  }: KeyHandlerOptions) =>
  async (event: KeyboardEvent) => {
    if (event.defaultPrevented || isTypingInField()) return;

    const WANT_TOAST = false;
    const uiToast = (msg: string) => {
      if (WANT_TOAST) toast?.(msg);
    };

    const stationByKey = (k: StationKey) => {
      toast?.(`${k}/s ∷ st@f${k}`);
      setFacet?.(restation(STATION_FACETS[k], getFacet?.()));
    };

    switch (event.code) {
      case 'KeyA':
      case 'ArrowLeft': {
        uiToast('←/a :: prev');
        NAV['≺']();
        return;
      }

      case 'KeyD':
      case 'ArrowRight': {
        uiToast('→/d :: next');
        NAV['≻']();
        return;
      }

      case 'KeyF': {
        uiToast('f ∷ extremize');
        await updateLedger(l => l.toggle('extremal'));
        return;
      }

      case 'KeyZ': {
        uiToast('z ∷');
        setUiMode?.('zen');
        return;
      }

      case 'KeyQ': {
        uiToast('q ∷ normal');
        setUiMode?.('normal');
        return;
      }

      case 'KeyJ': {
        uiToast('j ∷ custom');
        setUiMode?.('custom');
        return;
      }

      case 'KeyM': {
        uiToast('m ∷ moor');
        onSight();
        return;
      }

      case 'Space': {
        event.preventDefault();
        uiToast('⎵ ∷ reveal');
        onReveal();
        return;
      }

      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
      case 'Digit9':
      case 'Digit0': {
        const n = extractNumeral(event.code);
        if (isStationKey(n)) return stationByKey(n);
        switch (n) {
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
          case 9: {
            return uiToast(`${n} ∷ ???`);
          }

          case 0: {
            uiToast('0 ∷ panoptic');
            await updateLedger(l => l.toggle('panoptic'));
            return;
          }
        }
      }
    }
  };

// default handler for non-sidepanel contexts -- no facet/uiMode access
export const handleKeydown = createKeyHandler({
  onSight: () => sendAction({ action: 'sight' }),
  onReveal: () => sendAction({ action: 'reveal' }),
});

// go to target facet; if already there, advance to the next one cyclically
const restation = (
  target: Companthrofacet,
  current: Companthrofacet | null = null,
): Companthrofacet => {
  if (current !== target) return target;
  const i = STATION_HANDLES.findIndex(([facet]) => facet === target);
  return STATION_HANDLES[(i + 1) % STATION_HANDLES.length][0];
};

const isTypingInField = () =>
  !!document.activeElement?.matches('input, textarea, [contenteditable]');

type D = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;
const extractNumeral = (code: `Digit${D}`) => +code.slice(5) as D;
