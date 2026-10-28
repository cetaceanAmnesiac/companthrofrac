import { type KeyAction } from '𝕮⁂𝕮/keys/actions';
import { type Key } from '𝕮⁂𝕮/keys/keys';
import { type Glyphs } from '𝕮⁂𝕮/keys/mods';

export type Chord = `${Glyphs}${Key}`;

export type Keymap = { [K in Chord]?: KeyAction };
const DEFAULT_KEYMAP: Keymap = {
  // TODO:
};

export const getDefaultAction = (chord: Chord): KeyAction | null =>
  DEFAULT_KEYMAP[chord] ?? null;
