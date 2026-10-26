import { indexedFolia } from '@/test/folia';
import { describe, expect, test } from 'bun:test';
import {
  ColormarkLedger,
  type ColormarkStack,
  PANEL_SPAN_BOUNDS,
  PANEL_SPAN_DEFAULT,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import { DEFAULT_EXTREME } from '𝕮⁂𝕮/colormarks/extreme';

const L = (stack: ColormarkStack = {}) => new ColormarkLedger(stack);

describe('produce', () => {
  test.each([
    ['credited', true],
    ['panelSpan', PANEL_SPAN_DEFAULT],
    ['maxInfocaccia', Infinity], // default over bottom
    ['readout', false],
    ['extreme', DEFAULT_EXTREME],
    ['anchor', null], // neither default nor bottom
    ['expandiosity', { anthrofolia: true }], // default
  ] as const)('uninked %s → %p', (word, expected) => {
    expect(L().produce(word)).toEqual(expected);
  });

  test('inked value wins over default', () => {
    expect(L({ credited: false }).produce('credited')).toBe(false);
  });
});

describe('mark', () => {
  test('stores value as-is and inks', () => {
    const l = L().mark('uiMode', 'zen');
    expect(l.produce('uiMode')).toBe('zen');
    expect(l.isInked('uiMode')).toBe(true);
  });

  test('is immutable', () => {
    const l0 = L();
    l0.mark('readout', true);
    expect(l0.isInked('readout')).toBe(false);
  });

  test('null → bottom', () => {
    expect(L().mark('panelSpan', null).produce('panelSpan')).toBe(
      PANEL_SPAN_BOUNDS[0],
    );
    expect(L().mark('navigatrix', null).produce('navigatrix')).toEqual({});
  });

  test('null without bottom stores null (still inked)', () => {
    const l = L({ anchor: 7 }).mark('anchor', null);
    expect(l.getState('anchor')).toBeNull();
    expect(l.isInked('anchor')).toBe(true);
  });

  test('replaces accumulator values (no accumulation)', () => {
    const l = L({ navigatrix: { '≻': 3 } }).mark('navigatrix', { '≺': 1 });
    expect(l.produce('navigatrix')).toEqual({ '≺': 1 });
  });

  test('normalizes: panelSpan clamp', () => {
    const [min, max] = PANEL_SPAN_BOUNDS;
    expect(L().mark('panelSpan', 0).produce('panelSpan')).toBe(min);
    expect(L().mark('panelSpan', 99).produce('panelSpan')).toBe(max);
  });

  test('normalizes: harrowingWindow clamp', () => {
    expect(L().mark('harrowingWindow', -5).produce('harrowingWindow')).toBe(0);
  });

  test('normalizes: version pin', () => {
    expect(
      L()
        .mark('version', 7 as 1)
        .produce('version'),
    ).toBe(1);
  });
});

describe('lock / hide / toggle / unitize', () => {
  test('lock → bottom', () => {
    const l = L({ navigatrix: { '≻': 3 }, readout: true });
    expect(l.lock('navigatrix').produce('navigatrix')).toEqual({});
    expect(l.lock('readout').produce('readout')).toBe(false);
  });

  test('hide removes the key', () => {
    const l = L({ readout: true }).hide('readout');
    expect(l.isInked('readout')).toBe(false);
    expect('readout' in l.stack).toBe(false);
  });

  test('toggle flips the produced value (default-aware)', () => {
    expect(L().toggle('readout').produce('readout')).toBe(true);
    expect(L().toggle('credited').produce('credited')).toBe(false);
  });

  test.each([
    ['readout', true],
    ['panelSpan', PANEL_SPAN_DEFAULT],
  ] as const)('unitize %s → %p', (word, expected) => {
    expect(L().unitize(word)?.produce(word)).toBe(expected);
  });

  test('unitize without unit → null', () => {
    expect(L().unitize('anchor')).toBeNull();
  });
});

describe('reduce: accumulators', () => {
  test('navigatrix sums counts', () => {
    const l = L()
      .reduce('navigatrix', { '≻': 1 })
      .reduce('navigatrix', { '≻': 1, '≺': 1 });
    expect(l.produce('navigatrix')).toEqual({ '≻': 2, '≺': 1 });
  });

  test('anthrofolia merges per-folium fields', () => {
    const l = L({ anthrofolia: indexedFolia(2) }).reduce('anthrofolia', {
      2: { panelId: 2, revealed: true, title: 'x' },
      3: { panelId: 3, revealed: false, title: '' },
    });
    const f = l.produce('anthrofolia')!;
    expect(Object.keys(f)).toEqual(['1', '2', '3']);
    expect(f[2]).toEqual({ panelId: 2, revealed: true, title: 'x' });
  });

  test('nosedemons appends', () => {
    const l = L().reduce('nosedemons', ['a']).reduce('nosedemons', ['b']);
    expect(l.produce('nosedemons')).toEqual(['a', 'b']);
  });

  test('expandiosity starts from default, sets true, deletes false', () => {
    const l = L().reduce('expandiosity', { navigatrix: true });
    expect(l.produce('expandiosity')).toEqual({
      anthrofolia: true,
      navigatrix: true,
    });
    expect(
      l.reduce('expandiosity', { anthrofolia: false }).produce('expandiosity'),
    ).toEqual({ navigatrix: true });
  });

  test('sightings merge', () => {
    expect(
      L({ sightings: { eyes: true } })
        .reduce('sightings', { anchor: true })
        .produce('sightings'),
    ).toEqual({ eyes: true, anchor: true });
  });
});

describe('reduce: normalizers & plain', () => {
  test('normalizes (via mark)', () => {
    expect(L().reduce('panelSpan', 99).produce('panelSpan')).toBe(
      PANEL_SPAN_BOUNDS[1],
    );
  });

  test('no reducer → replace', () => {
    expect(
      L({ uiMode: 'zen' }).reduce('uiMode', 'normal').produce('uiMode'),
    ).toBe('normal');
  });
});

describe('visibility', () => {
  test('NEEDS_EYES words are inked but not apparent without eyes', () => {
    const l = L({ uiMode: 'zen' });
    expect(l.isInked('uiMode')).toBe(true);
    expect(l.isSeen('uiMode')).toBe(false);
    expect(l.mark('eyes', true).isSeen('uiMode')).toBe(true);
  });

  test('anthrofolia appears', () => {
    [false, true].forEach(revealed => {
      expect(
        L({ anthrofolia: indexedFolia(9 + +revealed) }).isSeen('anthrofolia'),
      ).toBe(revealed);
    });
  });

  test('navigatrix appears', () => {
    [false, true].forEach(revealed => {
      const l = L({
        navigatrix: {
          '≻': 5,
          ...(revealed && {
            '≺': 1,
          }),
        },
      });
      expect(l.isSeen('navigatrix')).toBe(revealed);
    });
  });

  test('shownMarks includes words ever seen', () => {
    const l = L({ uiMode: 'zen', sightings: { uiMode: true } });
    expect(l.isSeen('uiMode')).toBe(false);
    expect(l.shownMarks()).toContain('uiMode');
  });

  test('navigatrix {} is bottomish', () => {
    expect(L({ navigatrix: {} }).isBottomish('navigatrix')).toBe(true);
    expect(L({ navigatrix: { '≻': 1 } }).isBottomish('navigatrix')).toBe(false);
  });
});
