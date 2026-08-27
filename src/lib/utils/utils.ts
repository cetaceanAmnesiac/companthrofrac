import { type SVGAttributes } from 'svelte/elements';

export const stringify = <T>(value: T, oneLine = false) =>
  JSON.stringify(value, replacer, oneLine ? 0 : 2);

const replacer = (key: string, value: any) => {
  if (key === '') return value;
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (value === Infinity) return '+Infinity';
    if (value === -Infinity) return '-Infinity';
  }
  return value;
};

export const calligraph = <T>(v: T, wrapperLabel: string | null = null) =>
  void console.log(
    wrapperLabel ? `${wrapperLabel}(${stringify(v)})` : stringify(v),
  );

export type Pivot<L, R> = [L, undefined] | [undefined, R];

// unsorted

export type Predicate<T> = (value: T) => boolean;

export const meetPreds =
  <T>(...ps: Predicate<T>[]): Predicate<T> =>
  (v: T) =>
    ps.every(p => p(v));

export const joinPreds =
  <T>(...ps: Predicate<T>[]): Predicate<T> =>
  (v: T) =>
    ps.some(p => p(v));

export const nTuple = <T>(n: number, fn: (k: number) => T): T[] =>
  Array.from({ length: n }, (_, k) => fn(k));

export type Reverie<T> = T | (() => T);

export const wake = <T>(rev: Reverie<T>): T =>
  typeof rev === 'function' ? (rev as () => T)() : rev;

export const symDiff = <T>(xs: T[], ys: T[]): [T[], T[]] => {
  const yset = new Set(ys);
  const xset = new Set(xs);
  return [xs.filter(x => !yset.has(x)), ys.filter(y => !xset.has(y))];
};

export type Transform<T> = (value: T) => T;
export const applyEach =
  <T>(...fns: Transform<T>[]): Transform<T> =>
  value =>
    fns.reduce((v, fn) => fn(v), value);

export type LineProps = {
  [K in 'linecap' | 'linejoin']?: SVGAttributes<SVGPathElement>[`stroke-${K}`];
};

export type Dimensions = { [A in 'width' | 'height']: number };
export type Axis = keyof Dimensions;

export type Bounds = [b0: number, b1: number];
export const clamp = (
  v: number,
  [min = -Infinity, max = +Infinity]: Partial<Bounds>,
) => Math.min(Math.max(v, min), max);

const _typeof = (value: any) => typeof value;
type JsType = ReturnType<typeof _typeof>;

// no-op for IntelliSense -- c.f. tailwindCSS.classFunctions
export const tw = (...classNames: string[]) => classNames.join(' ');
