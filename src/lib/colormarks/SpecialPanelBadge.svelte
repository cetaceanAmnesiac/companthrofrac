<script lang="ts">
  import { type SpecialPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import { type Folium } from '𝕮⁂𝕮/reader-facet/folia';

  export type SpecialBadgeProps = {
    panelId: SpecialPanelId;
    folium: Folium | null;
    isCurrent: boolean;
    onclick?: () => void;
  };

  const LABEL: Record<SpecialPanelId, string> = {
    '<archive>': 'Archive',
    '<about>': 'How to Play',
    '<Resolver404>': '404',
    '<noComicPanel>': 'panel?',
    '<noPanelTag>': 'tag?',
  };

  const isError = (id: SpecialPanelId) =>
    ['<Resolver404>', '<noComicPanel>', '<noPanelTag>'].includes(id);

  const { panelId, folium, isCurrent, onclick }: SpecialBadgeProps = $props();

  const label = $derived(LABEL[panelId]);
  const title = $derived(folium?.title || panelId);
  const error = $derived(isError(panelId));
  const revealed = $derived(!!folium?.revealed);
</script>

{#if onclick}
  <button
    {title}
    {onclick}
    class="tile"
    class:error
    class:unrevealed={!revealed}
    class:current={isCurrent}>{label}</button
  >
{:else}
  <div
    {title}
    class="tile"
    class:error
    class:unrevealed={!revealed}
    class:current={isCurrent}
  >
    {label}
  </div>
{/if}

<style>
  @reference "../../assets/tailwind.css";

  .tile {
    @apply flex items-center justify-center text-center rounded-sm font-mono text-xs leading-tight px-1 py-1 w-full transition-colors;
    @apply bg-teal-900 text-teal-400;
    container-type: inline-size;
  }

  .tile.unrevealed {
    @apply bg-teal-950 text-teal-700;
  }

  .tile.error {
    @apply bg-amber-900 text-amber-400;
  }

  .tile.error.unrevealed {
    @apply bg-amber-950 text-amber-700;
  }

  .tile.current {
    @apply ring-1 ring-white ring-offset-2 ring-offset-gray-900 z-10;
  }

  button.tile {
    @apply cursor-pointer;

    &:hover {
      @apply brightness-125;
    }
  }

  @container (min-width: 32px) {
    .tile {
      @apply text-xs;
    }
  }
</style>
