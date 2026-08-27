<script lang="ts">
  import Colorcase from '𝕮⁂𝕮/colormarks/Colorcase.svelte';
  import { COLORWORDS, type Colorword } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { getExpandiosity } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { toast } from '𝕮⁂𝕮/toast';

  const ledger = useColormarkLedger();
  const panoptic = $derived(ledger.produceBit('panoptic'));
  const shownMarks = $derived(panoptic ? COLORWORDS : ledger.shownMarks());
  const expandiosity = $derived(getExpandiosity(ledger));

  const WANT_TOAST = !true;
  const toggleCase = (w: Colorword) => () => {
    const next = !expandiosity[w];
    ledger.reduce('expandiosity', { ...expandiosity, [w]: next });
    if (WANT_TOAST) void toast(`${next ? '+' : '-'} ${w}`);
  };
</script>

<div
  class="flex flex-col px-2.5 gap-0 select-none overflow-y-auto overflow-x-hidden"
>
  {#each shownMarks as word (word)}
    <Colorcase
      {word}
      open={!!expandiosity[word]}
      seen={ledger.isSeen(word)}
      onToggle={toggleCase(word)}
    />
  {/each}
</div>
