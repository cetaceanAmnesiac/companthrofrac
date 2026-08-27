import METADATA_DTO from '@/data/metadata/_output.dto.json';
import { type Choice, type Resolution } from '𝕮⁂𝕮/anthrofractal/choices';
import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';

export const PANEL_METADATA: PanelMetadata = new Map(
  (METADATA_DTO as MetadatumDto[]).map(p => [p.index, p]),
);

export type PanelMetadata = Map<IndexedPanelId, MetadatumDto>;
export type MetadatumDto = {
  index: IndexedPanelId;
  date: string;
  nomianiColor: string | null;
  choices: Choice[] | null;
  resolution: Resolution | null;
  metadata: string | null;
  tags: string[];
  description: string | null;
  tumblrPostId: string | null;
};
