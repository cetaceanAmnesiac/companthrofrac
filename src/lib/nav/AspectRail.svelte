<script lang="ts">
  import { getFacet } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import {
    STATION_HANDLES,
    type Companthrofacet,
  } from '𝕮⁂𝕮/colormarks/companthrofacet';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';

  const ledger = useColormarkLedger();
  const facet = $derived(getFacet(ledger));
  const seen = $derived(ledger.seenMarks().length);
  const shown = $derived(ledger.shownMarks().length);
  const showMarksTab = $derived(ledger.isApparent('anthrofolia'));

  const station = (f: Companthrofacet) => () =>
    ledger.mark('companthrofacet', f);
</script>

<div class="flex w-full border-b border-gray-400">
  {#each STATION_HANDLES as [f, label] (f)}
    {@const isMarks = f === 'marks'}
    {@const hidden = isMarks && !showMarksTab}
    {#if !hidden}
      <button
        class="flex-1 py-1.5 font-mono text-xs transition-colors
          {f === facet
          ? 'border-b-3 border-teal-500 -mb-px text-teal-600'
          : 'text-gray-400 hover:text-gray-600'}"
        onclick={station(f)}
      >
        {label}{#if isMarks}&thinsp;{@render marksCount()}{/if}
      </button>
    {/if}
  {/each}
</div>

{#snippet marksCount()}
  <span class="text-gray-400"
    >{seen}{#if seen !== shown}/{shown}{/if}</span
  >
{/snippet}
