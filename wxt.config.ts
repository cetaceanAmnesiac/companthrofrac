import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'wxt';

const VERSION = '0.0.1';
const USE_VISUALIZER = false;
const OMNIBOX_KEYWORD = 'af';

// cf. https://wxt.dev/api/config.html
export default defineConfig({
  // imports: false, // TODO: ?
  targetBrowsers: ['chrome', 'firefox'],
  srcDir: 'src',
  alias: { '𝕮⁂𝕮': 'src/lib/' },
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  autoIcons: { baseIconPath: './assets/icon.png' },

  // cf. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
  manifestVersion: 3,
  manifest: ({
    browser,
    // manifestVersion,
    // mode
  }) => ({
    name: 'COMPANTHROFRAC',
    short_name: 'CPΘFC',
    description: 'Reader companion for anthrofractal.com',
    version: VERSION,
    author: { email: 'cetacean.amnesiac@gmail.com' },
    homepage_url: 'https://github.com/cetaceanAmnesiac/companthrofrac',
    // update_url: '', // TODO: ?
    omnibox: { keyword: OMNIBOX_KEYWORD },

    host_permissions: ['https://anthrofractal.com/*'],
    permissions: [
      'activeTab', // TODO: ?
      'sidePanel',
      'storage',
      // NOTE: clipboardRead required for colorstack import, removed for now.
      // 'clipboardRead',
    ],

    commands: {
      open_panel: {
        suggested_key: {
          default: 'Alt+Shift+C',
          mac: 'MacCtrl+Shift+C',
        },
        description: 'Open side panel',
        global: true, // TODO: ?
      },
    },

    ...(browser === 'firefox'
      ? {
          browser_specific_settings: {
            gecko: {
              id: 'companthrofrac@buffer.fish',
              strict_min_version: '140.0',
              data_collection_permissions: {
                required: ['websiteContent'],
              },
            },
          },
        }
      : {}),

    // storage: { managed_schema: '' }, // TODO: ?
  }),

  // cf. https://wxt.dev/api/reference/wxt/interfaces/InlineConfig.html#zip
  // zip: { exclude: [] }, // TODO: ?

  // only applies to dev
  // cf. https://wxt.dev/api/reference/wxt/interfaces/WebExtConfig.html
  webExt: {
    startUrls: ['https://anthrofractal.com/'],

    chromiumProfile: resolve('./.chromium/user-data'),
    keepProfileChanges: true,

    // cf. https://chromium.googlesource.com/chromium/src/+/main/chrome/common/pref_names.h
    chromiumPref: {
      download: { default_directory: resolve('./.chromium/downloads') },
    },
  },

  ...(USE_VISUALIZER
    ? {
        analysis: {
          enabled: true,
          open: true,
          template: 'treemap',
        },
      }
    : {}),

  vite: async ({ mode }) => ({
    build: { sourcemap: mode === 'development' },
    plugins: [
      tailwindcss(),
      // (await import('rollup-plugin-visualizer')).visualizer({
      //   filename: '.output/stats.html',
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
    ],
  }),

  hooks: {
    'build:manifestGenerated': ({ config: { browser, mode } }, manifest) => {
      if (mode === 'development') {
        manifest.name += ` [DEV-${browser}]`;
        manifest.short_name += `^D.${browser}`;
      }
    },
  },
});
