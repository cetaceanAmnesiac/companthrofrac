<script lang="ts">
  import { updateLedger } from '𝕮⁂𝕮/colormarks/colormarks.storage';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { EMPTY_PALL, resolveWebrowPall } from '𝕮⁂𝕮/colormarks/webrow-pall';
  import PillSelector from '𝕮⁂𝕮/config-facet/PillSelector.svelte';
  import Toggle from '𝕮⁂𝕮/config-facet/Toggle.svelte';
  import Chevron from '𝕮⁂𝕮/icons/Chevron.svelte';
  import { type UiMode } from '𝕮⁂𝕮/ui-mode';
  import { displayBits, readBit, toggleBit } from '𝕮⁂𝕮/utils/bitmask';
  import { Webrow, WEBROWS } from '𝕮⁂𝕮/webrows';

  const ledger = useColormarkLedger();
  let rowsOpen = $state(false);

  const uiMode = $derived(ledger.produce('uiMode'));
  const customPall = $derived(ledger.produce('pall') ?? EMPTY_PALL);
  const extremal = $derived(ledger.produceBit('extremal'));
  const effectivePall = $derived(
    resolveWebrowPall(uiMode, customPall, extremal),
  );

  const onUiModeClick = (mode: UiMode) => () => {
    if (mode === 'custom') rowsOpen = uiMode !== 'custom' || !rowsOpen;
    updateLedger(l =>
      l
        .mark('uiMode', mode)
        .mark('extremal', !extremal && mode === uiMode && mode !== 'custom'),
    );
  };

  const toggleWebrow = (ix: number) => () =>
    ledger.mark('pall', toggleBit(customPall, ix));
</script>

<div class="mode-widget" class:extremal>
  <PillSelector on={!extremal} class="rounded-tr-none">
    <button
      class="pill-btn"
      class:active={uiMode === 'normal'}
      onclick={onUiModeClick('normal')}>Normal</button
    >
    <button
      class="pill-btn"
      class:active={uiMode === 'zen'}
      onclick={onUiModeClick('zen')}>Zen</button
    >
    <button
      class="pill-btn cust-btn"
      class:active={uiMode === 'custom'}
      onclick={onUiModeClick('custom')}
    >
      Custom
      <Chevron open={rowsOpen} />
    </button>
  </PillSelector>

  {#if rowsOpen}
    {@const disabled = extremal || uiMode !== 'custom'}
    <div class="rows-body" class:disabled>
      {#each WEBROWS as ww, ix (ww)}
        {@const on = !readBit(effectivePall, ix)}
        {#if !extremal || ww === Webrow.PANEL}
          <div class="row">
            <span class="row-label">{ww}</span>
            <Toggle
              {on}
              {disabled}
              onclick={toggleWebrow(ix)}
              aria-label="Toggle {ww}"
            />
          </div>
        {/if}
      {/each}
      <p class="readout">
        0b{displayBits(effectivePall, WEBROWS.length)} = {effectivePall}
      </p>
    </div>
  {/if}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .mode-widget {
    @apply inline-flex flex-col rounded-lg bg-gray-100 space-y-1;
  }

  .cust-btn {
    @apply flex items-center gap-1;
  }

  .rows-body {
    @apply flex flex-col gap-1.5 px-2 pb-2;
  }
  .rows-body.disabled {
    @apply opacity-40 pointer-events-none;
  }

  .row {
    @apply flex items-center justify-between gap-3;
  }

  .row-label {
    @apply text-xs text-gray-600;
  }

  .readout {
    @apply font-mono text-[11px] text-gray-400;
  }
</style>
