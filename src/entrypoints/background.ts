import { onAction, type CompanthrofrAction } from '𝕮⁂𝕮/actions';
import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';

export default defineBackground({
  main: () => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    browser.commands.onCommand.addListener(handleBrowserCommand);
    onAction(handleCompanthrofrAction);

    // browser.omnibox.setDefaultSuggestion({ description: '' });
    browser.omnibox.onInputChanged.addListener((text, suggest) => {
      suggest([]);
      // suggest([
      //   {
      //     content: `panel-${text}`,
      //     description: `Go to panel ${text}`,
      //   },
      // ]);
    });
    browser.omnibox.onInputEntered.addListener(
      (text, disposition) =>
        void accessUrl(
          /^\d+$/.test(text)
            ? getPanelUrl(parseInt(text, 10))
            : getTagUrl(text),
          disposition,
        ),
    );
  },
});

const handleBrowserCommand = (command: string) => {
  if (command === 'open_panel') void openPanel();
};

const openPanel = async () =>
  browser.sidePanel.open({ windowId: browser.windows.WINDOW_ID_CURRENT });

const handleCompanthrofrAction = (cpθfr: CompanthrofrAction): void => {
  switch (cpθfr.action) {
    case 'navigate':
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
