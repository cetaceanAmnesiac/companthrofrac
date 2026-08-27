<script lang="ts">
  import ArcStripe from '𝕮⁂𝕮/ArcStripe.svelte';
  import { getFolia } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { countIndexedFolia } from '𝕮⁂𝕮/reader-facet/folia';

  const ledger = useColormarkLedger();
  const creditState = $derived(ledger.getState('credited'));
  const credited = $derived(!!creditState);
  const visited = $derived(countIndexedFolia(getFolia(ledger)));
  const canUnlock = $derived(visited >= 12 && typeof creditState !== 'boolean');
</script>

<ArcStripe count={2} />

<footer class="cc-credits font-sans">
  <div class="cc-line">
    <span class="font-onesize-reverse cc-dim">COMPANTHROFRAC</span>
    <span> created by <code>cetaceanAmnesiac</code>.</span>
  </div>
  <div class="cc-line">
    <span class="font-onesize-reverse" class:cc-credited={credited}
      >ANTHROFRACTAL</span
    >
    {#if canUnlock}
      <button
        class="cc-unlock"
        onclick={() => void ledger.unitize('credited')}
        title="acknowledge authorship">◈</button
      >
    {:else if credited}
      <span class="cc-ack">◈</span>
    {/if}
    <span>is the creation &amp; property</span>
  </div>
  <span>of... well, who knows. not me.</span>
</footer>

<style>
  .cc-credits {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: 0.75em 1em;

    color: #888;
  }

  .cc-line {
    display: flex;
    align-items: baseline;
    gap: 0.3em;
  }

  .cc-dim {
    color: #666;
  }

  .font-onesize-reverse {
    color: #666;
    transition: color 0.2s;
  }

  .font-onesize-reverse.cc-credited {
    color: #284469;
  }

  .cc-unlock {
    background: none;
    border: none;
    padding: 0 0.2em;
    cursor: pointer;
    color: #bbb;
    font-size: 0.9em;
    transition: color 0.15s;
  }

  .cc-unlock:hover {
    color: #4fa8a0;
  }

  .cc-ack {
    color: #4fa8a0;
    font-size: 0.9em;
  }
</style>
