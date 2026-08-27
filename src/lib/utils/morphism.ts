// --- objects ---

export type CreateObjectProps<Item, Key extends string, Value> = {
  items: readonly Item[];
  createKey?: (item: Item, ix: number) => Key;
  createValue?: (item: Item, ix: number) => Value;
};

export const createObject = <Item, Key extends string, Value = Item>({
  items,
  createKey = (item: Item) => `${item}` as unknown as Key,
  createValue = (item: Item) => item as unknown as Value,
}: CreateObjectProps<Item, Key, Value>): { [K in Key]: Value } =>
  Object.assign(
    {},
    ...items.map((item, ix) => ({
      [createKey(item, ix)]: createValue(item, ix),
    })),
  );

// --- fp algebra ---

export type Monoid<T> = [e: T, op: Binop<T>];
export type Binop<T> = (a: T, b: T) => T;
export type Eq<T> = (a: T, b: T) => boolean;

export const fold =
  <T>([e, op]: Monoid<T>) =>
  (items: T[]) =>
    items.reduce(op, e);

export const sumOver = fold([0, (a, b) => a + b]);
// export const productOver = fold([1, (a, b) => a * b]);
// export const minOver = fold([+Infinity, (a, b) => Math.min(a, b)]);
// export const maxOver = fold([-Infinity, (a, b) => Math.max(a, b)]);
