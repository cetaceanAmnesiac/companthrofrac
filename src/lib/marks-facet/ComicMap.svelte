<script lang="ts">
  import { getMetadata } from '@/data/metadata/metadata.lazy.svelte';
  import { SPECIAL_PANEL_IDS } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import { type BodyProps } from '𝕮⁂𝕮/colormarks/body-registry';
  import { PANEL_SPAN_DEFAULT } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import {
    getAcme,
    getFolia,
    getPanelBadgeProps,
    getSpecialBadgeProps,
  } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import SpecialPanelBadge from '𝕮⁂𝕮/colormarks/SpecialPanelBadge.svelte';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import PanelMapTile from '𝕮⁂𝕮/marks-facet/PanelMapTile.svelte';
  import SpanDial from '𝕮⁂𝕮/marks-facet/SpanDial.svelte';
  import { countFoliaBy } from '𝕮⁂𝕮/reader-facet/folia';

  const { word: _word }: BodyProps = $props();

  const ledger = useColormarkLedger();
  const acme = $derived(getAcme(ledger));
  const metadata = $derived.by(getMetadata);
  const { indexed } = $derived(countFoliaBy(getFolia(ledger)));
  const hasPanelSpan = $derived(ledger.isInked('panelSpan'));
  const panelSpan = $derived(ledger.produce('panelSpan') ?? PANEL_SPAN_DEFAULT);
  const panelBadgeProps = $derived(getPanelBadgeProps(ledger, metadata));
  const specialBadgeProps = $derived(getSpecialBadgeProps(ledger));
</script>

<div
  class="flex-1 flex flex-col -ml-4 mr-0 min-h-0 max-h-100 overflow-hidden rounded bg-white/40 px-2.5 py-3"
>
  <div
    class=" p-1 flex-1 min-h-0 overflow-x-hidden overflow-y-auto grid content-start gap-px"
    style="grid-template-columns: repeat({panelSpan}, 1fr)"
  >
    {#each panelBadgeProps as badge (badge.index)}
      <PanelMapTile {...badge} />
    {/each}
  </div>

  {#if specialBadgeProps.length > 0}
    <div
      class="grid gap-px mt-2 pt-2 border-t border-dashed border-gray-600"
      style="grid-template-columns: repeat({SPECIAL_PANEL_IDS.length}, 1fr)"
    >
      {#each specialBadgeProps as badge (badge.panelId)}
        <SpecialPanelBadge {...badge} />
      {/each}
    </div>
  {/if}

  <div
    class="flex items-baseline gap-2 font-mono text-sm text-gray-400 mt-2 pt-2 border-t border-gray-600"
  >
    <span>{indexed.seen} seen</span>
    <span class="text-teal-500">{indexed.revealed} revealed</span>
    <span class="ml-auto text-gray-600">/ {acme ?? '…?'}</span>
  </div>

  {#if hasPanelSpan}<SpanDial />{/if}
</div>
