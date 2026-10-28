import { type Haversack } from '𝕮⁂𝕮/haversack';
import { NULL_ACTION_CODE, type KeyActionCode } from '𝕮⁂𝕮/keys/actions';
import { type Chord } from '𝕮⁂𝕮/keys/keymap';
import { type Key } from '𝕮⁂𝕮/keys/keys';
import { type Glyphs, type ℳ } from '𝕮⁂𝕮/keys/mods';

export type Keybinder = {
  keys: Haversack<Key>;
  mods: Haversack<ℳ>;
  actions: Haversack<KeyActionCode>;
  map: { [C in Chord]?: KeyActionCode };
};

export const createBottomKeybinder = (): Keybinder => ({
  keys: {},
  mods: {},
  actions: {},
  map: {},
});

export const patchKeybinder = (
  key: Key,
  glyphs: Glyphs,
  actionCode: KeyActionCode | null,
): Keybinder => ({
  keys: { [key]: true },
  mods: Object.fromEntries(
    glyphs.split('').map<[ℳ, true]>(g => [g as ℳ, true]),
  ),
  actions: { [actionCode ?? NULL_ACTION_CODE]: true },
  map: { [`${glyphs}${key}` as Chord]: actionCode ?? NULL_ACTION_CODE },
});
