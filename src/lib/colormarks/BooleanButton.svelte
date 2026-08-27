<script lang="ts">
  import { type BooleanColorword } from '𝕮⁂𝕮/colormarks/colormarks.types';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { tw } from '𝕮⁂𝕮/utils';

  export type Props = { word: BooleanColorword };
  const { word }: Props = $props();

  const ledger = useColormarkLedger();
  const on = $derived(ledger.produceBit(word));

  const BTN = tw(
    'font-mono text-base px-2 py-0.5 rounded border transition-colors cursor-pointer',
  );
  const BTN_ON = tw('border-teal-600 bg-teal-900/60 text-teal-300');
  const BTN_OFF = tw(
    'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400',
  );
</script>

<button
  class="ml-auto {BTN} {on ? BTN_ON : BTN_OFF}"
  onclick={e => (e.stopPropagation(), ledger.toggle(word))}
>
  {on ? '⊤' : '⊥'}
</button>
