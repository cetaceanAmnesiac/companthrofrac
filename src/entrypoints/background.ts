import { onAction, type CompanthrofrAction } from '𝕮⁂𝕮/actions';
import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';

export default defineBackground({
  main: () => {
    browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    browser.commands.onCommand.addListener(handleBrowserCommand);
    onAction(handleCompanthrofrAction);
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
      return void updateActiveTab(cpθfr.url);

    case 'sight':
    case 'reveal':
      return void relayToActiveTab(cpθfr);

    case 'toast':
    case 'stamp':
      // sidepanel receives via runtime.onMessage directly
      return;
  }
};

const goToIndexedPanel = (id: IndexedPanelId) =>
  updateActiveTab(`https://anthrofractal.com/comic/${id}/`);

const goToTag = (tag: string) =>
  updateActiveTab(`https://anthrofractal.com/comic/search/tag/${tag}/`);

const updateActiveTab = async (url: string) => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) void browser.tabs.update(tab.id, { url });
};

const relayToActiveTab = async (msg: CompanthrofrAction) => {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) void browser.tabs.sendMessage(tab.id, msg);
};
