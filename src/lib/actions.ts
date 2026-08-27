import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
import { type Effrontery } from '𝕮⁂𝕮/utils/time';

export type CompanthrofrActionType = CompanthrofrAction['action'];
export type CompanthrofrAction =
  | { action: 'navigate'; panel: IndexedPanelId }
  | { action: 'navigateUrl'; url: string }
  | { action: 'navigateTag'; tag: string }
  | { action: 'sight' }
  | { action: 'reveal' }
  | { action: 'toast'; msg: string }
  | { action: 'stamp'; msg: string; eff?: Effrontery };

export const sendAction = (cpθfr: CompanthrofrAction): void =>
  void browser.runtime.sendMessage(cpθfr);

export const onAction = (handler: (cpθfr: CompanthrofrAction) => void) => (
  browser.runtime.onMessage.addListener(handler),
  () => browser.runtime.onMessage.removeListener(handler)
);
