<script lang="ts">
  import { getMetadatum } from '@/data/metadata/metadata.lazy.svelte';
  import { wrbygToHex } from '𝕮⁂𝕮/anthrofractal/arc-colors';
  import { getPanelLabel, isIndexedPanel } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import {
    getAcme,
    getAnchor,
    getHighestFolium,
  } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';

  export type ProgressBarProps = {
    offsite: boolean;
  };

  const { offsite }: ProgressBarProps = $props();

  const ledger = useColormarkLedger();
  const anchor = $derived(getAnchor(ledger));
  const acme = $derived(getAcme(ledger));
  const highestFolium = $derived(getHighestFolium(ledger));
  const last = $derived(acme ?? highestFolium);
  const beachball = $derived(ledger.produceBit('beachball'));

  const progressPct = $derived(
    last !== null && isIndexedPanel(anchor)
      ? last === 1
        ? 100
        : (((anchor - 1) / (last - 1)) * 100).toFixed(1)
      : 0,
  );

  const thumbHex = $derived.by(() => {
    if (!beachball || !isIndexedPanel(anchor)) return null;
    const meta = getMetadatum(anchor);
    return meta?.nomianiColor
      ? (wrbygToHex(meta.nomianiColor[0]) ?? null)
      : null;
  });
</script>

<div class="w-full px-5 pb-2 pt-1.5">
  <div
    class="mb-1 flex justify-between font-mono text-xs font-light transition-colors duration-300 {offsite
      ? 'text-gray-200'
      : 'text-gray-400'}"
  >
    <span>
      panel {getPanelLabel(anchor).replace(/#/, '')}
    </span>
    <span>{acme !== null ? 'latest' : 'furthest'} {last ?? '—'}</span>
  </div>
  <div class="track">
    <div
      class="fill {offsite ? 'fill-off' : 'fill-on'}"
      style:width="{progressPct}%"
    ></div>
    {#if !offsite && isIndexedPanel(anchor) && last !== null}
      <div
        class="thumb"
        style:left="{progressPct}%"
        style:border-color={thumbHex}
      ></div>
    {/if}
  </div>
</div>

<style>
  @reference "../../assets/tailwind.css";

  .track {
    @apply relative h-1.5 bg-gray-200 overflow-visible;
  }
  .fill {
    @apply h-full transition-all duration-300;
  }
  .fill-on {
    @apply bg-linear-to-r from-teal-400 to-teal-600;
  }
  .fill-off {
    @apply bg-gray-200;
  }
  .thumb {
    @apply absolute top-1/2 -translate-x-1/2 -translate-y-1/2;
    @apply w-3 h-3 rounded-full;
    @apply bg-white border-2 border-gray-600;
    @apply transition-all duration-300;
    @apply shadow-lg;
  }
</style>
