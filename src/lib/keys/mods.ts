export type ℳ = (typeof ℳs)[number];
export const ℳs = ['^', '~', '$', '@'] as const;

export type ʼ<T extends ℳ> = '' | T;
export type Glyphs = `${ʼ<'^'>}${ʼ<'~'>}${ʼ<'$'>}${ʼ<'@'>}`;

export type Modifier = (typeof MODIFIERS)[number];
export const MODIFIERS = ['Control', 'Alt', 'Shift', 'Meta'] as const;

export const getModifierSet = (e: KeyboardEvent) =>
  MODIFIERS.reduce<Set<Modifier>>(
    (acc, mod) => (e.getModifierState(mod) && acc.add(mod), acc),
    new Set(),
  );

export const getGlyphs = (mods: Set<Modifier>): Glyphs => {
  const m = <M extends ℳ>(name: Modifier, symbol: M): ʼ<M> =>
    mods.has(name) ? symbol : '';
  return `${m('Control', '^')}${m('Alt', '~')}${m('Shift', '$')}${m('Meta', '@')}`;
};
