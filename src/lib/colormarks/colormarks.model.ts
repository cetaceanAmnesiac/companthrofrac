import { type IndexedPanelId, type PanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
import { type BooleanColorword } from '𝕮⁂𝕮/colormarks/colormarks.types';
import {
  DEFAULT_COMPANTHROFACET,
  type Companthrofacet,
} from '𝕮⁂𝕮/colormarks/companthrofacet';
import { DEFAULT_EXTREME, type Extreme } from '𝕮⁂𝕮/colormarks/extreme';
import { EMPTY_PALL, type WebrowPall } from '𝕮⁂𝕮/colormarks/webrow-pall';
import { type Haversack } from '𝕮⁂𝕮/haversack';
import { type Navigatrix } from '𝕮⁂𝕮/nav/navigatrix';
import {
  countIndexedFolia,
  createBottomFolia,
  glossFolia,
  reduceFolia,
  type Folia,
} from '𝕮⁂𝕮/reader-facet/folia';
import { DEFAULT_UI_MODE, type UiMode } from '𝕮⁂𝕮/ui-mode';
import {
  calligraph,
  Canon,
  clamp,
  IntCanon,
  stringify,
  type Dimensions,
} from '𝕮⁂𝕮/utils';

export type Colorword = keyof Colorshapes;
export type Colorshapes = {
  anchor: PanelId;
  companthrofacet: Companthrofacet;
  anthrofolia: Folia;
  navigatrix: Navigatrix;
  extreme: Extreme;
  extremal: boolean;
  readout: boolean;
  uiMode: UiMode;
  pall: WebrowPall;
  credited: boolean;
  counted: number;
  eyes: true;
  nosedemons: string[];
  version: 1;
  maxInfocaccia: number;
  forceDiegesis: boolean;
  omnifolia: boolean;
  beachball: boolean;
  riverline: boolean;
  panelSpan: number;
  innerDimensions: Dimensions;
  panoptic: boolean;
  acme: IndexedPanelId;
  // arcChroma: IntCanon<RBYG>;
  expandiosity: SparseColormap<boolean>;
  sightings: ColorwordSet;
  harrowingWindow: number; // ms
  haversack: Haversack;
  showMarginalia: boolean;
  // everlocked: null;
  // occulted: undefined;
};

export type Colorreducer<Word extends Colorword> = (
  current: Colorshapes[Word] | null,
  incoming: Colorshapes[Word],
) => Colorshapes[Word];

export type StackSelector<T, Word extends Colorword> =
  | T
  | ((stack: ColormarkStack, word: Word, value: Colorshapes[Word] | null) => T);

export type BitSelector<Word extends Colorword> = StackSelector<boolean, Word>;

const justCheck =
  <Word extends Colorword>(
    fn: (value: Colorshapes[Word]) => boolean,
  ): BitSelector<Word> =>
  (_, __, v) =>
    v !== null && fn(v);

export type Colorwrit<Word extends Colorword> = {
  bottom?: Colorshapes[Word];
  default?: Colorshapes[Word];
  unit?: Colorshapes[Word];
  // group?: WordGroup;

  isApparent?: BitSelector<Word>;
  isBottom?: BitSelector<Word>;
  reducer?: Colorreducer<Word>;

  gloss?: (value: Colorshapes[Word]) => string;
};

// --- game data ---

const reduceArray = <T>(current: T[] | null, incoming: T[]) => [
  ...(current ?? []),
  ...incoming,
];

const NEEDS_EYES: BitSelector<Colorword> = stack =>
  ColormarkLedger.hasEyes(stack);

export type Colorwrits = { [Word in Colorword]: Colorwrit<Word> };

export type Colormap<T> = { [Word in Colorword]: T };
export type SparseColormap<T> = { [Word in Colorword]?: T };
export type ColorwordSet = SparseColormap<true>;

const createWrit = <W extends Colorword>(
  defaultValue: Colorshapes[W],
): Colorwrit<W> => ({ default: defaultValue });

const createBooleanWrit = <W extends BooleanColorword>(): Colorwrit<W> => ({
  bottom: false,
  default: false,
  unit: true,
});

export const PANEL_SPAN_MIN = 1;
export const PANEL_SPAN_DEFAULT = 4;
export const PANEL_SPAN_MAX = 12;

const COLORWRITS: Colorwrits = {
  anchor: {
    isApparent: NEEDS_EYES,
    gloss: v => `Panel ${v}`,
  },
  companthrofacet: {
    isApparent: NEEDS_EYES,
    bottom: DEFAULT_COMPANTHROFACET,
  },
  anthrofolia: {
    bottom: createBottomFolia(),
    isApparent: justCheck(v => countIndexedFolia(v) >= 10),
    reducer: reduceFolia,
    gloss: glossFolia,
  },
  navigatrix: {
    bottom: Canon.empty(),
    isBottom: justCheck(IntCanon.isEmpty),
    isApparent: justCheck(v => Canon.keys(v).length >= 2),
    reducer: IntCanon.reduce,
    gloss: v => {
      const k = Canon.keys(v).length;
      const t = IntCanon.total(v);
      return `${t} (${k}⚷)`;
    },
  },
  extremal: {
    isApparent: NEEDS_EYES,
    bottom: false,
    unit: true,
  },
  extreme: {
    isApparent: NEEDS_EYES,
    bottom: DEFAULT_EXTREME,
  },
  readout: createBooleanWrit(),
  uiMode: {
    isApparent: NEEDS_EYES,
    default: DEFAULT_UI_MODE,
  },
  pall: {
    isApparent: NEEDS_EYES,
    bottom: EMPTY_PALL,
    gloss: v => v.toString(2).padStart(7, '0'),
  },
  credited: {
    isApparent: NEEDS_EYES,
    bottom: true,
    default: true,
    unit: true,
  },
  counted: {
    bottom: 0,
    unit: 1,
  },
  eyes: {
    unit: true as true,
    gloss: _ => '👀',
  },
  nosedemons: {
    bottom: [],
    isBottom: justCheck(ns => ns.length === 0),
    isApparent: justCheck(ns => ns.length > 0),
    reducer: reduceArray,
  },
  version: {
    isApparent: false,
    bottom: 1,
    reducer: () => 1,
  },
  maxInfocaccia: {
    bottom: 0,
    default: Infinity,
    unit: 1,
  },
  forceDiegesis: createWrit(false),
  omnifolia: createBooleanWrit(),
  beachball: createBooleanWrit(),
  riverline: createBooleanWrit(),
  panelSpan: {
    bottom: PANEL_SPAN_MIN,
    default: PANEL_SPAN_DEFAULT,
    unit: PANEL_SPAN_DEFAULT,
    reducer: (_, incoming) => clamp(incoming, [PANEL_SPAN_MIN, PANEL_SPAN_MAX]),
  },
  innerDimensions: {
    // isApparent: false,
    gloss: v => `${v.width}×${v.height}`,
  },
  panoptic: createBooleanWrit(),
  acme: { gloss: v => `▲${v}` },
  // arcChroma: {
  //   bottom: Canon.empty(),
  //   isBottom: justCheck(v => IntCanon.isEmpty(v)),
  //   isApparent: NEEDS_EYES,
  //   reducer: IntCanon.reduce,
  //   gloss: v => rbyg.map(k => `${k}:${v[k] ?? 0}`).join(' '),
  // },

  expandiosity: {
    bottom: {},
    isBottom: justCheck(v => !Object.values(v).some(Boolean)),
    default: { anthrofolia: true },
    isApparent: justCheck(v => Object.keys(v).length >= 5),
    reducer: (current, incoming) => {
      const r = (Object.entries(incoming) as [Colorword, boolean][]).reduce(
        (acc, [w, e]) => (e ? (acc[w] = true) : delete acc[w], acc),
        { ...current },
      );
      calligraph({ prev: current, next: r });
      return r;
    },
    gloss: v => {
      const c = Object.keys(v).length;
      return c === 0 ? '∅' : `+${c}`;
    },
  },

  sightings: {
    bottom: {},
    isBottom: justCheck(v => Object.keys(v).length === 0),
    // default: {},
    isApparent: () => true,
    reducer: (current, incoming) => ({ ...(current ?? {}), ...incoming }),
    gloss: v => `${Object.keys(v).length} colormarks`,
  },

  harrowingWindow: {
    bottom: 0,
    default: 0,
    unit: 1000,
    isApparent: false,
    reducer: (_, incoming) => clamp(incoming, [0]),
    gloss: v => `${v} ms`,
  },

  haversack: {
    bottom: {},
    isBottom: justCheck(v => Object.keys(v).length === 0),
    isApparent: v => Object.keys(v).length > 0,
    reducer: (current, incoming) => ({ ...(current ?? {}), ...incoming }),
    gloss: v => `${Object.keys(v).length} ⚐`,
  },
  showMarginalia: createBooleanWrit(),
};

export const COLORWORDS = Object.keys(COLORWRITS) as readonly Colorword[];

// TODO: simplify
// source of truth: errors if BooleanColorword gains a member without a matching key
const _booleanColorwords: Record<BooleanColorword, true> = {
  extremal: true,
  readout: true,
  credited: true,
  forceDiegesis: true,
  omnifolia: true,
  beachball: true,
  riverline: true,
  panoptic: true,
  showMarginalia: true,
};

export const BOOLEAN_COLORWORDS = Object.keys(
  _booleanColorwords,
) as readonly BooleanColorword[];

export const isBooleanColorword = (word: Colorword): word is BooleanColorword =>
  word in _booleanColorwords;

export const DEFAULT_COLORMARK_STACK: ColormarkStack = {};
export type ColormarkStack = {
  [Word in Colorword]?: Colorshapes[Word] | null;
};

export class ColormarkLedger {
  private static WRITS = COLORWRITS;

  constructor(readonly stack: ColormarkStack = DEFAULT_COLORMARK_STACK) {}

  get _stack(): ColormarkStack {
    return { ...this.stack };
  }

  getState = <Word extends Colorword>(
    word: Word,
  ): Colorshapes[Word] | null | undefined => this.stack[word];

  produce = <Word extends Colorword>(word: Word): Colorshapes[Word] | null =>
    this.stack[word] ??
    ColormarkLedger.WRITS[word].default ??
    this.getBottom(word);

  produceBit = <Word extends BooleanColorword>(word: Word) =>
    !!this.produce(word);

  hasExplicitBottom = <Word extends Colorword>(word: Word) =>
    ColormarkLedger.WRITS[word].bottom !== undefined;
  getBottom = <Word extends Colorword>(word: Word): Colorshapes[Word] | null =>
    ColormarkLedger.WRITS[word].bottom ?? null;

  hasUnit = <Word extends Colorword>(word: Word) =>
    ColormarkLedger.WRITS[word].unit !== undefined;
  getUnit = <Word extends Colorword>(word: Word): Colorshapes[Word] | null =>
    this.hasUnit(word)
      ? (ColormarkLedger.WRITS[word].unit as Colorshapes[Word])
      : null;

  isInked = <Word extends Colorword>(word: Word) =>
    this.stack[word] !== undefined;

  isUnitish = <Word extends Colorword>(word: Word) => !this.isBottomish(word);
  isBottomish = <Word extends Colorword>(word: Word) => {
    const value = this.produce(word);
    const { isBottom } = ColormarkLedger.WRITS[word];
    return (
      value === null ||
      value === this.getBottom(word) ||
      // (isBottom?.(this.stack, word, value) ?? false)
      (typeof isBottom === 'function'
        ? isBottom(this.stack, word, value)
        : (isBottom ?? false))
    );
  };

  isApparent = <Word extends Colorword>(word: Word) => {
    const { isApparent } = ColormarkLedger.WRITS[word];
    return typeof isApparent === 'function'
      ? isApparent(this.stack, word, this.produce(word))
      : (isApparent ?? true);
  };

  isSeen = <Word extends Colorword>(word: Word) =>
    this.isInked(word) && this.isApparent(word);

  hide = (word: Colorword, keepWord = false) => {
    const { [word]: _, ...rest } = this.stack;
    return new ColormarkLedger({
      ...rest,
      ...(keepWord && { [word]: undefined }),
    });
  };

  mark = <Word extends Colorword>(
    word: Word,
    providedValue: Colorshapes[Word] | null,
  ) => {
    const value = providedValue === null ? this.getBottom(word) : providedValue;
    return new ColormarkLedger({ ...this.stack, [word]: value });
  };

  lock = (word: Colorword) => this.mark(word, null);

  reduce = <Word extends Colorword>(
    word: Word,
    incoming: Colorshapes[Word],
  ) => {
    const { reducer } = ColormarkLedger.WRITS[word];
    return this.mark(
      word,
      reducer ? reducer(this.produce(word), incoming) : incoming,
    );
  };

  toggle = (word: BooleanColorword) => this.mark(word, !this.produce(word));

  unitize = <Word extends Colorword>(word: Word) =>
    this.hasUnit(word) ? this.mark(word, this.getUnit(word)!) : null;

  isChromatic = <Word extends Colorword>(word: Word) =>
    this.isInked(word) && this.isUnitish(word);

  isAmbient = <Word extends Colorword>(word: Word) =>
    !this.isInked(word) && this.isUnitish(word);

  inkedMarks = () => COLORWORDS.filter(this.isInked);
  seenMarks = () => COLORWORDS.filter(this.isSeen);
  apparentMarks = () => COLORWORDS.filter(this.isApparent);
  bottomishMarks = () => COLORWORDS.filter(this.isBottomish);
  unitishMarks = () => COLORWORDS.filter(this.isUnitish);
  chromaticMarks = () => COLORWORDS.filter(this.isChromatic);
  ambientMarks = () => COLORWORDS.filter(this.isAmbient);

  shownMarks = () =>
    COLORWORDS.filter(
      word => this.isSeen(word) || this.produce('sightings')?.[word],
    );

  serialize = () => stringify(this.stack);

  gloss = <Word extends Colorword>(word: Word) => {
    const value = this.produce(word);
    const { gloss } = ColormarkLedger.WRITS[word];
    return value !== null && gloss
      ? gloss(value)
      : ColormarkLedger.displayValue(value);
  };

  static hasEyes = (stack: ColormarkStack) => stack.eyes === true;

  static displayValue = (value: unknown) => {
    if (value === undefined) return '—';
    if (value === null) return '∅';
    switch (typeof value) {
      case 'string':
        return value;
      // return `'${value}'`;
      case 'boolean':
      case 'number':
      case 'bigint':
        return `${value}`;
      case 'symbol':
        return value.toString();
      case 'function':
        return 'ƒ()';
      case 'object':
        if (Array.isArray(value)) return `[${value.length}]`;
        return '{…}';
      default:
        return '???';
    }
  };
}
