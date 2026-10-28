import { type Colorword } from '𝕮⁂𝕮/colormarks/colormarks.model';
import {
  getFolia,
  getNavKeys,
  type Legible,
} from '𝕮⁂𝕮/colormarks/colormarks.selectors';
import { NAV_KEYS, NAV_STEPS, type NavKey } from '𝕮⁂𝕮/nav/navigatrix';
import { countFoliaBy } from '𝕮⁂𝕮/reader-facet/folia';

const BASE_MARGINALIA: Partial<Record<Colorword, string | string[]>> = {
  companthrofacet: 'which side of cpθfrc is facing you.',
  anchor: 'the panel at which cpθfrc is stationed.',
  anthrofolia: 'a record of your passage through ANTHROFRACTAL.',
  navigatrix: 'it tallies your navigation actions for some reason.',
  extremal: 'whether to fullscreenify the panel.',
  extreme: [
    'in what sense the panel is or would be fullscreenified.',
    "- MIN: fullscreenify along your device's smaller dimension for exact fit.",
    "- MAX: fullscreenify along your device's larger dimension for 1D scroll.",
    '- PIX: set the panel to its exact pixel dimensions, which may entail 2D scroll.',
  ],
  readout:
    'whether to inject the title & alt text below each panel. a little janky.',
  uiMode: [
    'which website rows are shown.',
    '- normal: show everything.',
    "- zen: hide stuff that isn't the comic.",
    '- custom: displayed rows are determined by the pall colormark.',
  ],
  pall: 'which rows of the website are shown when uiMode is set to custom.',
  credited: 'whether to hide the credits section for more real estate.',
  eyes: 'whether internal colormarks are rendered visible.',
  nosedemons: 'uh-oh',
  version: 'the version of the colormark system.',
  riverline: 'click a revealed panel on the map to go there.',
  panelSpan: 'how many panels per row on the anthrofolia map.',
  acme: 'the most recent ANTHROFRACTAL panel.',
  expandiosity: 'which colormark chips are expanded.',
  sightings: [
    'which colormarks you have ever seen.',
    'they will always remain visible.',
  ],
  showMarginalia: [
    'whether to show these notes!',
    'btw, a colormark comprises a colorword and a colorshape.',
    "a colorword is a colormark's name, and",
    'a colorshape is its domain of possible values.',
    "if you're still confused about this colorblank nonsense —",
    "it's a morphological construction we use when there is one-per-colormark of something.",
    // 'for example, every colormark has a colorwrit that defines its structural properties.',
    // "so you could even say this colormark determines whether to show each mark's colormarginalia, though that's a bit much.",
  ],

  // forceDiegesis: 'suppress static panel metadata.',
  // beachball: "show a panel's arc colors on the map.",
  // omnifolia: 'Expands the map to show all known panels, including unvisited.',
  // panoptic: 'Reveals all colormarks, including internal system state.',
  // chroma: 'Accumulated resonance from revealed panels.',
};

export const getDynamicMarginalia = (word: Colorword, ledger: Legible) => {
  switch (word) {
    case 'navigatrix':
      return getNavigatrixMarginalia(ledger);
    case 'anthrofolia':
      return getAnthrofoliaMarginalia(ledger);
    default:
      return [];
  }
};

const NAV_KEY_HINTS: readonly (readonly [NavKey, string])[] = [
  ['☉', '- have you followed the riverline?'],
  [
    '★',
    '- anything under the anthrofractal.com/comic/ path is a valid anchor.',
  ],
  ['⊘', '- your navigatrix will even count its failures.'],
];

const getNavigatrixMarginalia = (ledger: Legible) => {
  const keys = getNavKeys(ledger);
  if (NAV_STEPS.some(k => k !== '⭯' && !keys.has(k)))
    return ['you have at least 4 navigation actions: ≪ ≺ ≻ ≫'];
  if (!keys.has('⭯'))
    return [
      'there is a way to directly return to your anchor.',
      "however, you can't return to somewhere you already are...",
    ];
  if (!NAV_KEYS.every(k => keys.has(k)))
    return NAV_KEY_HINTS.reduce<string[]>(
      (acc, [k, hint]) => (!keys.has(k) && acc.push(hint), acc),
      [`there are ${NAV_KEYS.length - keys.size} keys unfound.`],
    );
  return ['all nav keys have been found!'];
};

const getAnthrofoliaMarginalia = (ledger: Legible) => {
  const { seen, revealed } = countFoliaBy(getFolia(ledger)).indexed;
  if (seen > revealed)
    return [`${seen - revealed} panels seen but not revealed.`];
  if (seen > 0 && !ledger.produce('eyes'))
    return ["every panel you've seen, you've revealed."];
  return [];
};

export const getMarginalia = (word: Colorword, ledger: Legible) => {
  const m = BASE_MARGINALIA[word] ?? [];
  return [
    ...(Array.isArray(m) ? m : [m]),
    ...getDynamicMarginalia(word, ledger),
  ];
};
