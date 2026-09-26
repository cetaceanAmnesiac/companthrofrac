import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { defineConfig } from 'wxt';

// TODO:
const isDev = process.env.NODE_ENV !== 'production';

// TODO: emitter.setMaxListeners(12) ?
// cf. https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  alias: { '𝕮⁂𝕮': 'src/lib/' },
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  autoIcons: { baseIconPath: './assets/icon.png' },
  manifest: {
    name: 'COMPANTHROFRAC',
    short_name: 'CPΘFC',
    description: 'Reader companion for anthrofractal.com',
    version: '0.0.1',
    homepage_url: 'https://github.com/cetaceanAmnesiac/companthrofrac',
    // update_url: '',

    host_permissions: ['https://anthrofractal.com/*'],
    permissions: [
      'storage',
      'sidePanel',
      // NOTE: clipboardRead required for colorstack import, removed for now.
      // 'clipboardRead',
    ],

    commands: {
      open_panel: {
        // TODO: choose final keybinding
        // NOTE: Chrome/etc reserve many Ctrl+Shift combos
        // also consider making it unset by default so users bind their own?
        suggested_key: { default: 'Ctrl+Shift+Y', mac: 'Command+Shift+Y' },
        description: 'Open side panel',
      },
    },
  },

  // only applies to dev
  // cf. https://wxt.dev/api/reference/wxt/interfaces/WebExtConfig.html
  webExt: {
    startUrls: ['https://anthrofractal.com/'],

    // cf. .gitignore (blank .gitkeep files track skeleton)
    chromiumProfile: resolve('./.chromium/user-data'),
    keepProfileChanges: true,

    // cf. https://chromium.googlesource.com/chromium/src/+/main/chrome/common/pref_names.h
    chromiumPref: {
      download: { default_directory: resolve('./.chromium/downloads') },
    },
  },

  vite: async () => ({
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
});
