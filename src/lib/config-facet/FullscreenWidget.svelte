<script lang="ts">
  import { updateLedger } from '𝕮⁂𝕮/colormarks/colormarks.storage';
  import { EXTREME_HANDLES, type Extreme } from '𝕮⁂𝕮/colormarks/extreme';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import AdorningToggle from '𝕮⁂𝕮/config-facet/AdorningToggle.svelte';
  import PillSelector from '𝕮⁂𝕮/config-facet/PillSelector.svelte';

  const ledger = useColormarkLedger();
  const extremal = $derived(ledger.produceBit('extremal'));
  const extreme = $derived(ledger.produce('extreme') ?? 'min');

  const toggleMaximizePanel = () => ledger.toggle('extremal');
  const onExtremeClick = (ex: Extreme) => () =>
    updateLedger(l =>
      l.mark('extreme', ex).mark('extremal', !extremal || ex !== extreme),
    );
</script>

<div class="inline-flex">
  <AdorningToggle
    on={extremal}
    onclick={toggleMaximizePanel}
    aria-label="Toggle maximize panel"
  />
  <PillSelector
    on={extremal}
    class="rounded-tl-none rounded-bl-none rounded-br-none"
  >
    {#each EXTREME_HANDLES as { extreme: ex, desc } (ex)}
      {@const active = ex === extreme}
      <button
        type="button"
        class="pill-btn"
        class:active
        title={desc}
        onclick={onExtremeClick(ex)}>{ex}</button
      >
    {/each}
  </PillSelector>
</div>
