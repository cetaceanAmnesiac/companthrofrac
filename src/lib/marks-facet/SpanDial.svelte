<script lang="ts">
  import {
    PANEL_SPAN_MAX,
    PANEL_SPAN_MIN,
  } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { updateLedger } from '𝕮⁂𝕮/colormarks/colormarks.storage';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';

  const ledger = useColormarkLedger();
  const span = $derived(ledger.produce('panelSpan') ?? 12);

  const oninput = (e: Event) => {
    const value = Number((e.target as HTMLInputElement).value);
    void updateLedger(l => l.mark('panelSpan', value));
  };
</script>

<div class="dial">
  <span class="lbl">stride</span>
  <input
    type="range"
    min={PANEL_SPAN_MIN}
    max={PANEL_SPAN_MAX}
    value={span}
    {oninput}
  />
  <span class="val">{span}</span>
</div>

<style>
  @reference "../../assets/tailwind.css";

  .dial {
    @apply flex items-center gap-2 font-mono text-xs text-gray-500;
  }

  .lbl {
    @apply shrink-0 text-gray-400;
  }

  .val {
    @apply w-5 shrink-0 text-right tabular-nums text-gray-400;
  }

  input[type='range'] {
    @apply flex-1 accent-teal-500 cursor-pointer;
    height: 2px;
  }
</style>
