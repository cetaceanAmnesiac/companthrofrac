export type Palimpsest<T> = [] | [curr: T] | [curr: T, prev: T];

export const createPal = <T>(): Palimpsest<T> => [];
export const updatePal = <T>(p: Palimpsest<T>, next: T): Palimpsest<T> =>
  p.length === 0 ? [next] : [next, p[0]];

export const justChanged = <T>(p: Palimpsest<T>) =>
  p.length === 1 || (p.length === 2 && p[0] !== p[1]);

export const calligraphPal = <T>(p: Palimpsest<T>) =>
  p.length === 0 ? '[]' : p.length === 1 ? `[${p[0]}]` : `[${p[0]}, ${p[1]}]`;
