export type Companthroflag = 'progress-thumb';

export type Haversack<Flag extends string = string> = {
  readonly [F in Flag]?: true;
};

export const raise = <Flag extends string = string>(
  bag: Haversack<Flag>,
  flag: Flag,
): Haversack<Flag> => ({ ...bag, [flag]: true });

export const lower = <Flag extends string = string>(
  bag: Haversack<Flag>,
  flag: Flag,
): Haversack<Flag> => {
  const { [flag]: _, ...next } = bag;
  return next as Haversack<Flag>;
};

export const has = <Flag extends string = string>(
  bag: Haversack<Flag>,
  flag: Flag,
) => !!bag[flag];
