import { onAction, type CompanthrofrAction } from '𝕮⁂𝕮/actions';
import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
import { type AnyOtherString } from '𝕮⁂𝕮/utils';

export default defineBackground({
  main: () => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    browser.commands.onCommand.addListener(handleExtensionCommand);
    onAction(handleCompanthrofrAction);

    // browser.omnibox.setDefaultSuggestion({ description: '' });
    browser.omnibox.onInputChanged.addListener((text, suggest) => {
      suggest([
        ...(/^\d+$/.test(text) ? [createPanelSuggestion(text)] : []),
        createTagSuggestion(text),
      ]);
    });
    browser.omnibox.onInputEntered.addListener(
      (text, disposition) =>
        void accessUrl(
          /^(?:panel-)?\d+$/.test(text)
            ? getPanelUrl(parseInt(text.replace(/^panel-/, ''), 10))
            : getTagUrl(encodeURIComponent(text.replace(/^tag-/, ''))),
          disposition,
        ),
    );
  },
});

const createPanelSuggestion = (
  text: string,
): Browser.omnibox.SuggestResult => ({
  content: `panel-${text}`,
  description: `Go to <url>panel <match>${text}</match></url>`,
});

const createTagSuggestion = (text: string): Browser.omnibox.SuggestResult => ({
  content: `tag-${text}`,
  description: `Search for <url>tag <match>${text}</match></url>`,
});

export type ExtensionCommand = 'open_panel' | AnyOtherString;
const handleExtensionCommand = (command: ExtensionCommand): void => {
  if (command === 'open_panel') return void openPanel();
};

const openPanel = async () =>
  browser.sidePanel.open({ windowId: browser.windows.WINDOW_ID_CURRENT });

const handleCompanthrofrAction = (cpθfr: CompanthrofrAction): void => {
  switch (cpθfr.action) {
    case 'navigatePanel':
      return void goToIndexedPanel(cpθfr.panel);

    case 'navigateTag':
      return void goToTag(cpθfr.tag);

    case 'navigateUrl':
      return void accessUrl(cpθfr.url);

    case 'sight':
    case 'reveal':
      return void relayToActiveTab(cpθfr);

    case 'toast':
    case 'stamp':
      // sidepanel receives via runtime.onMessage directly
      return;
  }
};

const relayToActiveTab = async (msg: CompanthrofrAction) => {
  const tabId = await getActiveTabId();
  if (tabId !== null) void browser.tabs.sendMessage(tabId, msg);
};

const goToIndexedPanel = (id: IndexedPanelId) => accessUrl(getPanelUrl(id));
const goToTag = (tag: string) => accessUrl(getTagUrl(tag));

const getPanelUrl = (id: IndexedPanelId) =>
  `https://anthrofractal.com/comic/${id}/`;
const getTagUrl = (tag: string) =>
  `https://anthrofractal.com/comic/search/tag/${tag}/`;

type UrlDisposition = `${Browser.omnibox.OnInputEnteredDisposition}`;
const accessUrl = async (
  url: string,
  disposition: UrlDisposition = 'currentTab',
): Promise<void> => {
  switch (disposition) {
    case 'currentTab':
      return void (await updateActiveTab(url));
    case 'newForegroundTab':
      return void (await browser.tabs.create({ url }));
    case 'newBackgroundTab':
      return void (await browser.tabs.create({ url, active: false }));
  }
};

const updateActiveTab = async (url: string) => {
  const tabId = await getActiveTabId();
  if (tabId !== null) void (await browser.tabs.update(tabId, { url }));
};

const getActiveTabId = async () => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
};
