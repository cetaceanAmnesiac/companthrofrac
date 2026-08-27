export type Bitmask<_K extends number = number> = number;

export const toBitmask = <K extends number = number>(bits: boolean[]) =>
  bits.reduce<Bitmask<K>>((mask, bit, ix) => mask | (bit ? 1 << ix : 0), 0);

export const readBit = <K extends number = number>(
  mask: Bitmask<K>,
  ix: number,
) => !!(mask & (1 << ix));

export const writeBit = <K extends number = number>(
  mask: Bitmask<K>,
  ix: number,
  value: boolean,
): Bitmask<K> => (value ? mask | (1 << ix) : mask & ~(1 << ix));

export const toggleBit = <K extends number = number>(
  mask: Bitmask<K>,
  ix: number,
): Bitmask<K> => mask ^ (1 << ix);

export const allZeroes = <K extends number = number>(): Bitmask<K> => 0;
export const allOnes = <K extends number = number>(
  length: number,
): Bitmask<K> => (1 << length) - 1;

export const displayBits = <K extends number = number>(
  mask: Bitmask<K>,
  length: number,
) =>
  [...Array(length)]
    .map((_, ix) => `${+readBit(mask, ix)}`)
    .reverse()
    .join('');
