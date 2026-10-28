import { updateLedger as update } from '𝕮⁂𝕮/colormarks/colormarks.storage';
import {
  cycleFacet,
  restation,
  STATION_FACETS,
} from '𝕮⁂𝕮/colormarks/companthrofacet';
import { cycleExtreme } from '𝕮⁂𝕮/colormarks/extreme';
import { getKeyActionCode } from '𝕮⁂𝕮/keys/actions';
import { getKey, isKeyCode } from '𝕮⁂𝕮/keys/key-codes';
import { patchKeybinder } from '𝕮⁂𝕮/keys/keybinder';
import { getDefaultAction } from '𝕮⁂𝕮/keys/keymap';
import { getGlyphs, getModifierSet } from '𝕮⁂𝕮/keys/mods';
import { NAV } from '𝕮⁂𝕮/nav/nav';

export type KeyHandlerOptions = {
  onSight: () => void;
  onReveal: () => void;
  toast?: (msg: string) => void;
};

export const createKeyHandler =
  ({ onSight, onReveal, toast }: KeyHandlerOptions) =>
  async (event: KeyboardEvent) => {
    if (event.defaultPrevented || isTypingInField()) return;

    if (!isKeyCode(event.code)) return;
    const key = getKey(event.code);

    const modifierSet = getModifierSet(event);
    const mod = modifierSet.has('Shift');
    if (modifierSet.size > +mod) return;

    const glyphs = getGlyphs(modifierSet);
    const action = getDefaultAction(`${glyphs}${key}`);
    const actionCode = action === null ? null : getKeyActionCode(action);

    const WANT_TOAST = false;
    if (WANT_TOAST && actionCode !== null) toast?.(actionCode);

    await update(l =>
      l.reduce('keybinder', patchKeybinder(key, glyphs, actionCode)),
    );

    event.preventDefault(); // TODO: when/where?

    if (action === null) return;
    switch (action.type) {
      case 'nav':
        return NAV[action.step]();
      case 'reveal':
        return onReveal();
      case 'moor':
        return onSight();

      // ledger actions
      case 'restation':
        return await update(l => {
          const prev = l.produce('companthrofacet');
          const next = restation(STATION_FACETS[action.key], prev);
          return l.mark('companthrofacet', next);
        });

      case 'cycleFacet':
        return await update(l => {
          const prev = l.produce('companthrofacet');
          const next = cycleFacet(prev);
          return l.mark('companthrofacet', next);
        });

      case 'extremify':
        return await update(l => l.toggle('extremal'));

      case 'cycleExtreme':
        return await update(l => {
          const prev = l.produce('extreme');
          const next = cycleExtreme(prev);
          return l.mark('extreme', next).mark('extremal', true);
        });

      case 'setUiMode':
        return await update(l =>
          l.mark('uiMode', action.mode).mark('extremal', false),
        );

      case 'panopticalize':
        return await update(l => l.toggle('panoptic'));
    }
  };

const isTypingInField = () =>
  !!document.activeElement?.matches('input, textarea, [contenteditable]');
