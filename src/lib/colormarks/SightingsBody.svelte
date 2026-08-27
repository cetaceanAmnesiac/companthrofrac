<script lang="ts">
  import { type BodyProps } from '𝕮⁂𝕮/colormarks/body-registry';
  import { getSeenColorwords } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import Marginalia from '𝕮⁂𝕮/colormarks/Marginalia.svelte';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';

  const { word }: BodyProps = $props();

  const ledger = useColormarkLedger();
  const words = $derived([...getSeenColorwords(ledger)].sort());
</script>

<div class="flex flex-col gap-2">
  <div
    class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-gray-500"
  >
    {#each words as w, i (w)}
      {#if i > 0}<span class=" text-black">·</span>{/if}
      <span class="font-mono text-sm leading-none shrink-0 text-gray-700">
        {w}
      </span>
    {/each}
  </div>
  <Marginalia {word} />
</div>
