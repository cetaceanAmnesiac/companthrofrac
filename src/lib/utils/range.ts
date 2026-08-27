export type RangePart = number | [number, number];
export type DisjointRange = RangePart[];

export const toDisjointRange = (ns: number[]): DisjointRange =>
  [...new Set(ns)]
    .sort((a, b) => a - b)
    .reduce<DisjointRange>((acc, n) => {
      const last = acc.at(-1);
      if (Array.isArray(last) && n === last[1] + 1)
        return [...acc.slice(0, -1), [last[0], n]];
      if (typeof last === 'number' && n === last + 1)
        return [...acc.slice(0, -1), [last, n]];
      return [...acc, n];
    }, []);

export const countDisjointRange = (range: DisjointRange) =>
  range.reduce<number>(
    (count, part) => count + (Array.isArray(part) ? part[1] - part[0] + 1 : 1),
    0,
  );

export const formatDisjointRange = (range: DisjointRange) =>
  range
    .map(part => (Array.isArray(part) ? `${part[0]}-${part[1]}` : `${part}`))
    .join(',');

/** eg [1..5,8,10..12] → "1-5,8,10-12 (9)" */
export const stringifyRange = (range: DisjointRange) =>
  `${formatDisjointRange(range)} (${countDisjointRange(range)})`;

export const rangeMin = (range: DisjointRange) => {
  if (range.length === 0) return +Infinity;
  const first = range[0];
  return Array.isArray(first) ? first[0] : first;
};

export const rangeMax = (range: DisjointRange) => {
  if (range.length === 0) return -Infinity;
  const last = range.at(-1)!;
  return Array.isArray(last) ? last[1] : last;
};

export const rangeExtrema = (
  range: DisjointRange,
): [min: number, max: number] => [rangeMin(range), rangeMax(range)];
