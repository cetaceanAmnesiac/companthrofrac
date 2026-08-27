import '@/entrypoints/sidepanel/sidepanel.css';
import Sidepanel from '@/entrypoints/sidepanel/Sidepanel.svelte';
import { mount } from 'svelte';
import { ColormarkLedger } from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getLedger,
  resolveLedger,
  saveLedger,
  updateLedger,
  updateLedgerMaybe,
} from '𝕮⁂𝕮/colormarks/colormarks.storage';

const app = mount(Sidepanel, { target: document.getElementById('main')! });

// TODO: move to dev file
if (import.meta.env.DEV) {
  (window as any).__𝕮 = {
    ColormarkLedger,
    getLedger,
    saveLedger,
    resolveLedger,
    updateLedger,
    updateLedgerMaybe,
    reset: () => saveLedger(new ColormarkLedger()),

    get ledger() {
      return getLedger();
    },

    get stack() {
      return getLedger()?._stack;
    },
  };
}

export default app;
