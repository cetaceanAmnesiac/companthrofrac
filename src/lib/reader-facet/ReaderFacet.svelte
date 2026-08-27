<script lang="ts">
  import { getMetadatum } from '@/data/metadata/metadata.lazy.svelte';
  import { isIndexedPanel, isSpecialPanel } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import { getAnchor, getFolium } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import DataRecord from '𝕮⁂𝕮/DataRecord.svelte';
  import ChoiceBox from '𝕮⁂𝕮/reader-facet/ChoiceBox.svelte';
  import Description from '𝕮⁂𝕮/reader-facet/Description.svelte';

  const ledger = useColormarkLedger();
  const anchor = $derived(getAnchor(ledger));
  const special = $derived(isSpecialPanel(anchor));
  const panoptic = $derived(ledger.produceBit('panoptic'));

  const metadatum = $derived(
    isIndexedPanel(anchor) ? getMetadatum(anchor) : null,
  );

  const folium = $derived(anchor !== null ? getFolium(ledger, anchor) : null);

  const paragraphs = $derived(
    metadatum?.description
      ?.split(/\n+/)
      .map(p => p.trim())
      .filter(Boolean),
  );
</script>

<div class="flex flex-1 flex-col min-h-0 px-2.5 py-3">
  {#if !anchor}
    <div class="placeholder">Navigate to a panel to begin.</div>
  {:else if !metadatum}
    <div class="placeholder">Panel #{anchor} — no data yet.</div>
  {:else}
    {#if panoptic}
      <DataRecord data={folium ?? { panelId: anchor }} label="folium" />
    {/if}
    <div class="card">
      <div
        class="flex items-baseline justify-between font-mono text-sm text-gray-400"
      >
        <span>#{metadatum.index}</span>
        {#if metadatum.date}<span>{metadatum.date}</span>{/if}
      </div>

      {#if folium?.title}
        <div class="mt-1 font-mono text-base font-medium text-gray-700">
          {folium.title}
        </div>
      {/if}

      {#if folium?.altText}
        <div class="mt-1 font-mono text-sm text-gray-500">
          &gt; <em>{folium.altText}</em>
        </div>
      {/if}

      <div class="mt-2 min-h-0 flex-1 overflow-y-auto">
        {#if paragraphs?.length}
          <Description {paragraphs} />
        {/if}
      </div>
    </div>

    {#if metadatum?.choices && folium}
      <ChoiceBox choices={metadatum.choices} revealed={folium.revealed} />
    {/if}
  {/if}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .placeholder {
    @apply px-6 text-sm text-gray-400;
  }

  .card {
    @apply flex flex-1 flex-col overflow-hidden;
    @apply bg-white/60 p-3 transition-colors hover:bg-white/70;
  }
</style>
