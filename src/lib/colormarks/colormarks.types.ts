import {
  type Colorshapes,
  type Colorword,
} from '𝕮⁂𝕮/colormarks/colormarks.model';

// mostly to get things straight in my head

/** colorwords of shape subtyping Shape (covariant; order-preserving) */
export type CovariantColorword<Shape> = {
  [W in Colorword]: Colorshapes[W] extends Shape ? W : never;
}[Colorword];

/** colorwords of shape supertyping Shape (contravariant; order-reversing) */
export type ContravariantColorword<Shape> = {
  [W in Colorword]: [Shape] extends [Colorshapes[W]] ? W : never;
}[Colorword];

/** colorwords of shape exactly Shape (mutual subtyping) */
export type InvariantColorword<Shape> = CovariantColorword<Shape> &
  ContravariantColorword<Shape>;

/** colorwords of shape comparable with Shape (bivariant) */
export type BivariantColorword<Shape> =
  CovariantColorword<Shape> | ContravariantColorword<Shape>;

// due to polymorphic quirks, avoid using these as generic params —
// inline the shape instead so TypeScript resolves to a concrete type
export type ꙮColormarkShapeꙮ<Word extends Colorword> = Colorshapes[Word];
export type ꙮColormarkValueꙮ<Word extends Colorword> = Colorshapes[Word] | null;
export type ꙮColormarkStateꙮ<Word extends Colorword> =
  Colorshapes[Word] | null | undefined;
export type ꙮResolveꙮ<T> = T extends infer U ? U : never;

// TODO: mostly unneeded but pleasing
export type BooleanColorword = InvariantColorword<boolean>;
// export type BooleanishColorword = ContravariantColorword<boolean>;
// export type BooleanableColorword = CovariantColorword<boolean>;
// export type BooleanoidColorword = BivariantColorword<boolean>;
// export type NumberColorword = InvariantColorword<number>;
// export type NumberishColorword = ContravariantColorword<number>;
// export type NumberableColorword = CovariantColorword<number>;
// export type NumberoidColorword = BivariantColorword<number>;
// export type StringColorword = InvariantColorword<string>;
// export type StringishColorword = ContravariantColorword<string>;
// export type StringableColorword = CovariantColorword<string>;
// export type StringoidColorword = BivariantColorword<string>;
