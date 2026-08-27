import { sumOver } from '𝕮⁂𝕮/utils/morphism';

export type Canon<K extends CanonKey, V> = Partial<Record<K, V>>;
export type CanonKey = Exclude<keyof any, number>;

export const createEmptyCanon = <K extends CanonKey, V>(): Canon<K, V> => ({});

const canonKeys = <K extends CanonKey, V>(canon: Canon<K, V>): K[] =>
  [...Object.keys(canon), ...Object.getOwnPropertySymbols(canon)] as K[];

const canonValues = <K extends CanonKey, V>(canon: Canon<K, V>) =>
  Object.values(canon) as V[];

const canonEntries = <K extends CanonKey, V>(canon: Canon<K, V>): [K, V][] =>
  canonKeys(canon).map(k => [k, canon[k as K]!]);

export const Canon = {
  empty: createEmptyCanon,
  keys: canonKeys,
  values: canonValues,
  entries: canonEntries,
};

export type IntCanon<K extends CanonKey> = Canon<K, number>;

const isEmptyIntCanon = <K extends CanonKey>(canon: IntCanon<K>) =>
  totalIntCanon(canon) === 0;

const reduceIntCanon = <K extends CanonKey>(
  current: IntCanon<K> | null,
  incoming: IntCanon<K>,
): IntCanon<K> =>
  Canon.entries(incoming).reduce<IntCanon<K>>(
    (canon, [k, v]) => ({ ...canon, [k]: (canon[k] ?? 0) + v }),
    { ...(current ?? Canon.empty()) },
  );

const totalIntCanon = <K extends CanonKey>(canon: IntCanon<K>) =>
  sumOver(Canon.values(canon));

export const IntCanon = {
  empty: createEmptyCanon,
  isEmpty: isEmptyIntCanon,
  reduce: reduceIntCanon,
  total: totalIntCanon,
};
