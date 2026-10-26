import { type Folia } from '𝕮⁂𝕮/reader-facet/folia';

export const indexedFolia = (
  seen: number,
  revealed: 'all' | number = 0,
): Folia =>
  Object.fromEntries(
    Array.from({ length: seen }, (_, i) => [
      i + 1,
      {
        panelId: i + 1,
        revealed: revealed === 'all' || i < revealed,
        title: '',
      },
    ]),
  );
