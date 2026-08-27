<script lang="ts">
  import { type Colorword } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { getMarginalia } from '𝕮⁂𝕮/colormarks/marginalia';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { tw } from '𝕮⁂𝕮/utils';

  export type Props = { word: Colorword };
  const { word }: Props = $props();

  const ledger = useColormarkLedger();
  const showMarginalia = $derived(ledger.produceBit('showMarginalia'));
  const marginalia = $derived(getMarginalia(word, ledger));

  const MARGINALIUM = tw(
    'text-sm -indent-4 pl-4 leading-snug font-mono text-gray-500',
  );
</script>

{#if showMarginalia && marginalia.length > 0}
  <div class="flex flex-col gap-0.5">
    {#each marginalia as line, ix (ix)}
      <span class={MARGINALIUM}>{line}</span>
    {/each}
  </div>
{/if}
