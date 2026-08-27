import {
  ColormarkLedger,
  type Colorshapes,
  type Colorword,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getLedger,
  saveLedger,
  subscribeLedger,
} from '𝕮⁂𝕮/colormarks/colormarks.storage';
import { type BooleanColorword } from '𝕮⁂𝕮/colormarks/colormarks.types';

export const useColormarkLedger = () => {
  let ledger = $state(getLedger() ?? new ColormarkLedger());

  $effect(() => {
    const unsub = subscribeLedger(l => void (ledger = l));
    const current = getLedger();
    if (current) ledger = current; // catch updates that arrived before effect ran
    return unsub;
  });

  const save = async (next: ColormarkLedger) => {
    ledger = next;
    await saveLedger(next);
  };

  return {
    // --- stack ---
    get stack() {
      return ledger.stack;
    },

    // --- reads ---
    produce: <W extends Colorword>(word: W) => ledger.produce(word),
    produceBit: <W extends BooleanColorword>(word: W) =>
      ledger.produceBit(word),
    getValue: <W extends Colorword>(word: W) => ledger.produce(word),
    getState: <W extends Colorword>(word: W) => ledger.getState(word),

    isInked: <W extends Colorword>(word: W) => ledger.isInked(word),
    isChromatic: <W extends Colorword>(word: W) => ledger.isChromatic(word),
    isAmbient: <W extends Colorword>(word: W) => ledger.isAmbient(word),
    isApparent: <W extends Colorword>(word: W) => ledger.isApparent(word),
    isSeen: <W extends Colorword>(word: W) => ledger.isSeen(word),
    isUnitish: <W extends Colorword>(word: W) => ledger.isUnitish(word),
    isBottomish: <W extends Colorword>(word: W) => ledger.isBottomish(word),

    inkedMarks: () => ledger.inkedMarks(),
    seenMarks: () => ledger.seenMarks(),
    apparentMarks: () => ledger.apparentMarks(),
    bottomishMarks: () => ledger.bottomishMarks(),
    unitishMarks: () => ledger.unitishMarks(),
    chromaticMarks: () => ledger.chromaticMarks(),
    ambientMarks: () => ledger.ambientMarks(),

    shownMarks: () => ledger.shownMarks(),

    serialize: () => ledger.serialize(),
    gloss: <W extends Colorword>(word: W) => ledger.gloss(word),

    // --- ⊤/⊥ inspection ---
    hasUnit: <W extends Colorword>(word: W) => ledger.hasUnit(word),
    getUnit: <W extends Colorword>(word: W) => ledger.getUnit(word),
    hasExplicitBottom: <W extends Colorword>(word: W) =>
      ledger.hasExplicitBottom(word),
    getBottom: <W extends Colorword>(word: W) => ledger.getBottom(word),

    // --- writes (all persist) ---
    hide: (word: Colorword) => save(ledger.hide(word)),
    mark: <W extends Colorword>(word: W, value: Colorshapes[W] | null) =>
      save(ledger.mark(word, value)),
    reduce: <W extends Colorword>(word: W, incoming: Colorshapes[W]) =>
      save(ledger.reduce(word, incoming)),
    lock: (word: Colorword) => save(ledger.lock(word)),
    unitize: (word: Colorword) => {
      const next = ledger.unitize(word);
      return next ? save(next).then(() => true) : Promise.resolve(false);
    },
    toggle: (word: BooleanColorword) => save(ledger.toggle(word)),
  };
};
