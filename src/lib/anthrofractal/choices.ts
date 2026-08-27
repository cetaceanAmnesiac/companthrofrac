export type Choice = [color: WRBYG, action: ActionCode, pragma: string];

void 'RBYG';
void 'WRBYG';
export type RBYG = 'R' | 'B' | 'Y' | 'G';
export type WRBYG = 'W' | RBYG;
export const rbyg: readonly RBYG[] = ['R', 'B', 'Y', 'G'];
export const wrbyg: readonly WRBYG[] = ['W', ...rbyg];

void '*">-';
export type ActionCode = '*' | '"' | '>' | '-';
export const ACTION_CODES: readonly ActionCode[] = ['*', '"', '>', '-'];

export type Resolution =
  | number[] // array of choice indices -- plural in a tie
  | TagResolution;

// eg '<unknown>' or '<tbd>'
export type TagResolution = `<${string}>`;

//? necessary after parsing?
export type IndexCode = 1 | 2 | 3 | 4;
export type ChoiceCode = `${IndexCode}-${WRBYG}`;
