export type Letter = (typeof LETTERS)[number];
// prettier-ignore
export const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
] as const;

export type Digit = (typeof DIGITS)[number];
// prettier-ignore
export const DIGITS = [
  '0', '1', '2', '3', '4',
  '5', '6', '7', '8', '9'
] as const;

export type Direction = (typeof DIRECTIONS)[number];
export const DIRECTIONS = ['Up', 'Down', 'Left', 'Right'] as const;

export type Punctuation = (typeof PUNCTUATION)[number];
export const PUNCTUATION = [
  'Space',
  'Comma',
  'Period',
  'Slash',
  'Semicolon',
  'Quote',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'Backquote',
  'Minus',
  'Equal',
] as const;

export type Key = (typeof KEYS)[number];
export const KEYS = [
  ...LETTERS,
  ...DIGITS,
  ...DIRECTIONS,
  ...PUNCTUATION,
] as const;

const typePredicateFromArray = <T extends string>(arr: readonly T[]) => {
  const set = new Set(arr);
  return (value: string): value is T => set.has(value as T);
};

export const isLetter = typePredicateFromArray<Letter>(LETTERS);
export const isDigit = typePredicateFromArray<Digit>(DIGITS);
export const isDirection = typePredicateFromArray<Direction>(DIRECTIONS);
export const isPunctuation = typePredicateFromArray<Punctuation>(PUNCTUATION);
export const isKey = typePredicateFromArray<Key>(KEYS);
