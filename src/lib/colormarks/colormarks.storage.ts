import {
  ColormarkLedger,
  DEFAULT_COLORMARK_STACK,
  type ColormarkStack,
  type Colorword,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import { getSeenColorwords } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import {
  applySightings,
  applyUnlocks,
} from '𝕮⁂𝕮/colormarks/colormarks.unlocks';
import { LocalStorageKey } from '𝕮⁂𝕮/local-storage';
import { applyEach, type Transform } from '𝕮⁂𝕮/utils';

export const marksStorage = storage.defineItem<ColormarkStack>(
  LocalStorageKey.MARKS,
  { fallback: DEFAULT_COLORMARK_STACK },
);

export type Listener<T> = (value: T) => void;
export type LedgerListener = Listener<ColormarkLedger>;

let _ledger: ColormarkLedger | null = null;
let _frozen = false;
const _listeners = new Set<LedgerListener>();

const _update = (s: ColormarkStack) => {
  if (_frozen) return;
  _ledger = new ColormarkLedger(s);
  _listeners.forEach(fn => fn(_ledger!));
};

marksStorage.getValue().then(_update);
marksStorage.watch(_update);

export const getLedger = () => _ledger;
export const freezeLedger = () => {
  _ledger = null;
  _frozen = true;
};
export const warmLedger = async () => {
  _frozen = false;
  return marksStorage.getValue().then(_update);
};

export const subscribeLedger = (fn: LedgerListener): (() => void) => {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
};

// TODO: palimpsest?
export const watchSightings = (
  onNew: (words: Colorword[]) => void,
): (() => void) => {
  let prev = _ledger !== null ? getSeenColorwords(_ledger) : null;
  return subscribeLedger(ledger => {
    const next = getSeenColorwords(ledger);
    if (prev !== null) {
      // don't fire because you opened the sidepanel
      const snap = prev; // constify to type-guard
      const gained = [...next].filter(w => !snap.has(w));
      if (gained.length > 0) onNew(gained);
    }
    prev = next;
  });
};

/**
 * Async read that always resolves. Returns the cached ledger if warm;
 * otherwise loads from storage and calls onCold (e.g. to fire nosedemon).
 */
export const resolveLedger = async (onCold?: Transform<ColormarkLedger>) => {
  const cached = _ledger;
  if (cached) return cached;
  const ledger = new ColormarkLedger(await marksStorage.getValue());
  return onCold ? onCold(ledger) : ledger;
};

/** Persist a ledger, updating the module cache optimistically. */
export const saveLedger = async (next: ColormarkLedger) => {
  const processed = applyEach(applyUnlocks, applySightings)(next);
  if (!_frozen) _ledger = processed;
  await marksStorage.setValue(processed.stack);
};

export const updateLedger = async (
  updateFn: Transform<ColormarkLedger>,
  onCold?: Transform<ColormarkLedger>,
) => saveLedger(updateFn(await resolveLedger(onCold)));

export const updateLedgerMaybe = async (
  updateFn: (ledger: ColormarkLedger) => ColormarkLedger | null | undefined,
  onCold?: Transform<ColormarkLedger>,
) => {
  const next = updateFn(await resolveLedger(onCold));
  return !next ? false : saveLedger(next).then(() => true);
};

export const nosedemon =
  (msg = 'o hellworld'): Transform<ColormarkLedger> =>
  ledger => {
    void console.warn(`NOSEDEMON: ${msg}`);
    return ledger.reduce('nosedemons', [msg]);
  };
