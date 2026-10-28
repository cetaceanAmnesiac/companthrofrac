import {
  type Digit,
  type Direction,
  isPunctuation,
  type Key,
  type Letter,
  type Punctuation,
} from '𝕮⁂𝕮/keys/keys';

export type KeyCode =
  LetterKeyCode | DigitKeyCode | ArrowKeyCode | PunctKeyCode;

export type LetterKeyCode = `Key${Letter}`;
export type DigitKeyCode = `Digit${Digit}`;
export type ArrowKeyCode = `Arrow${Direction}`;
export type PunctKeyCode = `${Punctuation}`;

export const isKeyCode = (k: string): k is KeyCode =>
  isLetterKeyCode(k) ||
  isDigitKeyCode(k) ||
  isArrowKeyCode(k) ||
  isPunctKeyCode(k);

export const isLetterKeyCode = (k: string): k is LetterKeyCode =>
  /^Key[A-Z]$/.test(k);
export const isDigitKeyCode = (k: string): k is DigitKeyCode =>
  /^Digit[0-9]$/.test(k);
export const isArrowKeyCode = (k: string): k is ArrowKeyCode =>
  /^Arrow(?:Up|Down|Left|Right)$/.test(k);
export const isPunctKeyCode = (k: string): k is PunctKeyCode =>
  isPunctuation(k);

export const getKey = (k: KeyCode): Key => {
  switch (true) {
    case isLetterKeyCode(k):
      return k.slice('Key'.length) as Letter;
    case isDigitKeyCode(k):
      return k.slice('Digit'.length) as Digit;
    case isArrowKeyCode(k):
      return k.slice('Arrow'.length) as Direction;
    case isPunctKeyCode(k):
      return k as Punctuation;
    default:
      return null as never;
  }
};
