import { mount as mountSvelte, unmount as unmountSvelte } from 'svelte';
import { onAction, sendAction } from '𝕮⁂𝕮/actions';
import { revealPanel, sightPanel, updateAcme } from '𝕮⁂𝕮/anthrofractal/capture';
import {
  addPanelClickListener,
  extremizePanelImage,
  getPanelImg,
  getReadoutDiv,
  READOUT_DIV_ID,
  removePanelClickListener,
  restorePanelImage,
} from '𝕮⁂𝕮/anthrofractal/dom';
import '𝕮⁂𝕮/anthrofractal/maximize-panel.css';
import { ColormarkLedger } from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getEffectivePall,
  getFacet,
} from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import {
  freezeLedger,
  getLedger,
  marksStorage,
  nosedemon,
  resolveLedger,
  updateLedger,
  warmLedger,
} from '𝕮⁂𝕮/colormarks/colormarks.storage';
import { DEFAULT_COMPANTHROFACET } from '𝕮⁂𝕮/colormarks/companthrofacet';
import { type Extreme } from '𝕮⁂𝕮/colormarks/extreme';
import { type WebrowPall } from '𝕮⁂𝕮/colormarks/webrow-pall';
import Readout from '𝕮⁂𝕮/frame/Readout.svelte';
import { createKeyHandler } from '𝕮⁂𝕮/keybindings';
import { connectPrinter, delay, stamp } from '𝕮⁂𝕮/utils';
import { readBit } from '𝕮⁂𝕮/utils/bitmask';
import { createPal, justChanged, updatePal } from '𝕮⁂𝕮/utils/palimpsest';
import { Webrow, WEBROWS } from '𝕮⁂𝕮/webrows';

export default defineContentScript({
  matches: ['*://anthrofractal.com/*', '*://*.anthrofractal.com/*'],
  runAt: 'document_end',
  main: async () => {
    const disconnectPrinter = connectPrinter(([_tp, eff, msg]) =>
      sendAction({ action: 'stamp', eff, msg }),
    );
    const initLedger = await resolveLedger(nosedemon());
    void applyColormarks(initLedger);
    if (AUTOSIGHT) onSight();
    const unwatchConfig = marksStorage.watch(
      newStack => void applyColormarks(new ColormarkLedger(newStack)),
    );

    const unwatchAction = onAction(cpθfr => {
      if (cpθfr.action === 'sight') onSight();
      if (cpθfr.action === 'reveal') onReveal();
    });

    const handleKeydown = createKeyHandler({
      onSight,
      onReveal,
      setFacet: facet =>
        void updateLedger(
          l => l.mark('companthrofacet', facet),
          nosedemon('KEYBOUND'),
        ),
      getFacet: () => {
        const l = getLedger();
        return l ? getFacet(l) : DEFAULT_COMPANTHROFACET;
      },
      setUiMode: mode =>
        void updateLedger(l => l.mark('uiMode', mode), nosedemon('KEYBOUND')),
      toast: msg => sendAction({ action: 'toast', msg }),
    });

    document.addEventListener('keydown', handleKeydown, { capture: true });

    const handleImgClick = () => {
      void onReveal();
      // void updateLedger(l => l.mark('companthrofacet', 'reader'));
    };
    addPanelClickListener(handleImgClick);

    const handlePageshow = async (e: PageTransitionEvent) => {
      void stamp(
        `pageshow persisted=${e.persisted} url=${location.href}`,
        'debug',
      );
      if (e.persisted) {
        const harrowingWindow = getLedger()?.produce('harrowingWindow') ?? 0;
        freezeLedger();
        if (harrowingWindow > 0) await delay(harrowingWindow);
        await warmLedger();
        void onSight();
      }
    };

    const handlePagehide = (e: PageTransitionEvent) => {
      void stamp(
        `pagehide persisted=${e.persisted} url=${location.href}`,
        'debug',
      );
      if (!e.persisted) teardown();
    };

    window.addEventListener('pageshow', handlePageshow);
    window.addEventListener('pagehide', handlePagehide);

    const teardown = () => {
      disconnectPrinter();
      unwatchConfig();
      unwatchAction();
      document.removeEventListener('keydown', handleKeydown, { capture: true });
      removePanelClickListener(handleImgClick);
      window.removeEventListener('pageshow', handlePageshow);
      window.removeEventListener('pagehide', handlePagehide);
      restorePanelImage();
      removeReadout();
      document.getElementById(ROW_STYLES_ID)?.remove();
    };
    return teardown;
  },
});

const AUTOSIGHT = true;
const onSight = async () => {
  await sightPanel(location.href, getPanelImg());
  void updateAcme();
};
const onReveal = async () => revealPanel(location.href, getPanelImg());

let readoutPal = createPal<boolean>();
let extremalPal = createPal<false | Extreme>();

const applyColormarks = (ledger: ColormarkLedger) => {
  const pall = getEffectivePall(ledger);
  const readout = ledger.produceBit('readout');
  const extremal = ledger.produceBit('extremal');
  const extreme = ledger.produce('extreme')!;
  const activeExtreme = extremal ? extreme : false;

  void injectStyles(createStyleText(pall, extremal));
  if (justChanged((readoutPal = updatePal(readoutPal, readout))))
    readout ? void injectReadout(getPanelImg()) : void removeReadout();
  if (justChanged((extremalPal = updatePal(extremalPal, activeExtreme))))
    activeExtreme
      ? void extremizePanelImage(activeExtreme)
      : void restorePanelImage();
};

const ROW_STYLES_ID = 'c12c-row-visibility-styles';

const injectStyles = (styleText: string) => {
  let style = document.getElementById(ROW_STYLES_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = ROW_STYLES_ID;
    document.head.appendChild(style);
  }
  style.textContent = styleText;
};

let _readoutInstance: ReturnType<typeof mountSvelte> | null = null;
const removeReadout = () => {
  if (_readoutInstance) {
    void unmountSvelte(_readoutInstance);
    _readoutInstance = null;
  }
  void getReadoutDiv()?.remove();
};

const injectReadout = (panelImg: HTMLImageElement | null) => {
  if (!panelImg || getReadoutDiv()) return;

  const readoutDiv = document.createElement('div');
  readoutDiv.id = READOUT_DIV_ID;
  void panelImg.insertAdjacentElement('afterend', readoutDiv);
  _readoutInstance = mountSvelte(Readout, {
    target: readoutDiv,
    props: { titleText: panelImg.title, altText: panelImg.alt },
  });
};

const createStyleText = (pall: WebrowPall, isFullscreen = false) =>
  WEBROWS.map(
    (ww, i) =>
      `div.main > div:nth-child(${i + 1}) {${[
        `display: ${readBit(pall, i) ? 'none' : isFullscreen ? 'flex' : 'flex'} !important;`,
        ...(ww === Webrow.PANEL && isFullscreen
          ? ['margin: 0 !important;']
          : []),
      ].join('\n')}}`,
  ).join('\n\n');
