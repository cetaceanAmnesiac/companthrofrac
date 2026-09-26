<script lang="ts">
  import { sendAction } from '𝕮⁂𝕮/actions';
  import { ColormarkLedger } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { saveLedger } from '𝕮⁂𝕮/colormarks/colormarks.storage';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { toast } from '𝕮⁂𝕮/toast';

  const ALLOW_RESET = false;

  const ledger = useColormarkLedger();

  const exportStack = async () => {
    await navigator.clipboard.writeText(ledger.serialize());
    void toast('colorstack copied');
  };

  const resetStack = async () => {
    if (!ALLOW_RESET) return;
    await saveLedger(new ColormarkLedger());
    sendAction({ action: 'sight' });
  };
</script>

<div class="px-6 py-4">
  <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
    Colorstack
  </h3>

  <div class="flex flex-wrap gap-2">
    <button
      class="flex items-center gap-1.5 rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 cursor-pointer"
      onclick={exportStack}
    >
      📋 Copy
    </button>
    <button
      class="flex items-center gap-1.5 rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-200s {ALLOW_RESET
        ? 'cursor-pointer'
        : 'cursor-not-allowed'}"
      onclick={resetStack}
    >
      🔄 Reset
    </button>
  </div>
</div>
