import { indexedFolia } from '@/test/folia';
import { describe, expect, test } from 'bun:test';
import {
  ColormarkLedger,
  type ColormarkStack,
} from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  applySightings,
  applyUnlocks,
} from '𝕮⁂𝕮/colormarks/colormarks.unlocks';

const unlock = (stack: ColormarkStack) =>
  applyUnlocks(new ColormarkLedger(stack));

const withFolia = (...args: Parameters<typeof indexedFolia>) =>
  unlock({ anthrofolia: indexedFolia(...args) });

describe('applyUnlocks thresholds', () => {
  test('panelSpan unlocks', () => {
    expect(withFolia(13, 12).isInked('panelSpan')).toBe(false);
    expect(withFolia(13, 13).isInked('panelSpan')).toBe(true);
    expect(withFolia(26, 0).isInked('panelSpan')).toBe(true);
  });

  test('eyes unlocks', () => {
    expect(withFolia(25, 'all').isInked('eyes')).toBe(false);
    expect(withFolia(26, 25).isInked('eyes')).toBe(false);
    expect(withFolia(26, 'all').isInked('eyes')).toBe(true);
  });

  test('readout unlocks', () => {
    expect(withFolia(61).isInked('readout')).toBe(false);
    expect(withFolia(62).produce('readout')).toBe(true);
  });

  test('already-inked words are not re-unlocked', () => {
    const l = unlock({ anthrofolia: indexedFolia(62), readout: false });
    expect(l.produce('readout')).toBe(false);
  });

  test('special folia do not count', () => {
    const l = unlock({
      anthrofolia: {
        ...indexedFolia(25, 'all'),
        '<about>': { panelId: '<about>', revealed: true, title: '' },
      },
    });
    expect(l.isInked('eyes')).toBe(false);
  });

  test('showMarginalia unlocks', () => {
    const two: ColormarkStack = {
      anthrofolia: indexedFolia(10),
      navigatrix: { '≺': 1, '≻': 1 },
    };
    const three: ColormarkStack = { ...two, panelSpan: 4 };
    const open = (...ws: string[]) =>
      Object.fromEntries(ws.map(w => [w, true]));

    const showsMarginalia = (stack: ColormarkStack) =>
      unlock(stack).isInked('showMarginalia');

    expect(
      showsMarginalia({
        ...two,
        expandiosity: open('anthrofolia', 'navigatrix'),
      }),
    ).toBe(false);
    expect(
      showsMarginalia({
        ...three,
        expandiosity: open('anthrofolia', 'navigatrix'),
      }),
    ).toBe(false);
    expect(
      showsMarginalia({
        ...three,
        expandiosity: open('anthrofolia', 'navigatrix', 'panelSpan'),
      }),
    ).toBe(true);
  });

  test('riverline unlocks', () => {
    const four = { '≪': 1, '≺': 1, '≻': 1, '≫': 1 };
    expect(unlock({ navigatrix: four }).isInked('riverline')).toBe(false);
    expect(
      unlock({ navigatrix: { ...four, '⭯': 1 } }).isInked('riverline'),
    ).toBe(true);
  });

  test('empty ledger unlocks nothing', () => {
    expect(unlock({}).inkedMarks()).toEqual([]);
  });
});

describe('applySightings', () => {
  test('records seen marks', () => {
    const l = applySightings(
      new ColormarkLedger({ anthrofolia: indexedFolia(10) }),
    );
    expect(l.produce('sightings')).toEqual({ anthrofolia: true });
  });

  test('no-op when nothing is seen', () => {
    const l0 = new ColormarkLedger({ anthrofolia: indexedFolia(3) });
    expect(applySightings(l0)).toBe(l0);
  });
});
