export const maybe = () => ifRng(0.5);
export const ifRng = (p: number) => Math.random() < p;

// d(N) ∈ [N] = {1,2,..N}
export const d = (sides = 826) => Math.floor(Math.random() * sides) + 1;

export const pick = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];
