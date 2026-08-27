import {
  type MetadatumDto,
  type PanelMetadata,
} from '@/data/metadata/metadata.model';
import { Effrontery, stamp, timer } from '𝕮⁂𝕮/utils';
import {
  type Asχnma,
  createIdleAsχnma,
  createPendingAsχnma,
  createRejectedAsχnma,
  createResolvedAsχnma,
} from '𝕮⁂𝕮/utils/asynchronema';

export type MetadataAsχnma = Asχnma<PanelMetadata>;

let _task = $state<MetadataAsχnma>(createIdleAsχnma<PanelMetadata>());

_task = createPendingAsχnma();
void stamp('metadata: import starting', 'debug');

const stop = timer();
void import('@/data/metadata/metadata.model')
  .then(m => {
    const ms = stop();
    const msg = `⏱ metadata resolved in ${ms.toFixed(1)}ms`;
    onMsg(msg, 'info');
    _task = createResolvedAsχnma(m.PANEL_METADATA, ms);
  })
  .catch<void>((e: unknown) => {
    const error = e instanceof Error ? e : new Error(String(e));
    const ms = stop();
    const msg = `⏱ metadata rejected in ${ms.toFixed(1)}ms: ${error}`;
    onMsg(msg, 'warn');
    _task = createRejectedAsχnma(error, ms);
  });

const onMsg = (msg: string, eff: Effrontery) => (
  stamp(msg, eff),
  console[eff](msg)
);

export const useMetadata = (): MetadataAsχnma => _task;

export const getMetadata = (): PanelMetadata | null =>
  _task.status === 'resolved' ? _task.resolution : null;

export const getMetadatum = (index: number): MetadatumDto | null =>
  getMetadata()?.get(index) ?? null;

export const countMetadata = () => getMetadata()?.size ?? null;
