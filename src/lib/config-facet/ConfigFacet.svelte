<script lang="ts">
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import ColorstackPanel from '𝕮⁂𝕮/config-facet/ColorstackPanel.svelte';
  import FullscreenWidget from '𝕮⁂𝕮/config-facet/FullscreenWidget.svelte';
  import Toggle from '𝕮⁂𝕮/config-facet/Toggle.svelte';
  import UiModeWidget from '𝕮⁂𝕮/config-facet/UiModeWidget.svelte';
  import StampLog from '𝕮⁂𝕮/utils/StampLog.svelte';

  const ledger = useColormarkLedger();
  const readout = $derived(ledger.produceBit('readout'));
  const toggleReadout = (): void => void ledger.toggle('readout');
</script>

<div class="border-b border-gray-300 px-4 py-3 w-full space-y-3">
  <div class="cfg-row mb-0!">
    <span class="cfg-label">Fullscreen</span>
    <FullscreenWidget />
  </div>

  <div class="cfg-row">
    <div class="flex flex-col self-stretch">
      <span class="cfg-label mt-1.5">Layout</span>
      <div class="flex-1"></div>
    </div>
    <UiModeWidget />
  </div>

  <div
    class="cfg-row cursor-pointer"
    role="button"
    tabindex="0"
    onclick={toggleReadout}
    onkeydown={e => ['Enter', ' '].includes(e.key) && toggleReadout()}
  >
    <span class="cfg-label">Show readout</span>
    <Toggle on={readout} aria-label="Toggle readout" />
  </div>
</div>

<ColorstackPanel />

<div class="border-t border-gray-300 pt-1.5">
  <StampLog />
</div>

<style>
  @reference "../../assets/tailwind.css";

  .cfg-row {
    @apply flex w-full justify-between items-center gap-4;
  }

  .cfg-label {
    @apply text-sm text-gray-600;
  }
</style>
