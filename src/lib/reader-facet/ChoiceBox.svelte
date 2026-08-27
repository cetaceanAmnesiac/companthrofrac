<script lang="ts">
  import { WRBYG_HEX } from '𝕮⁂𝕮/anthrofractal/arc-colors';
  import { type ActionCode, type Choice } from '𝕮⁂𝕮/anthrofractal/choices';

  export type ChoiceBoxProps = { choices: Choice[]; revealed: boolean };
  const { choices, revealed }: ChoiceBoxProps = $props();

  const prefix = (action: ActionCode) => (action === '>' ? '>' : '-');
  const display = (action: ActionCode, text: string) =>
    action === '"' ? `"${text}"` : text;
</script>

<div class="panel">
  {#if revealed}
    {#each choices as [c, action, text], ix (ix)}
      <div class="choice-row" style="color: {WRBYG_HEX[c]}">
        <span>{prefix(action)}</span>
        <span>{display(action, text)}</span>
      </div>
    {/each}
  {:else}
    <div class="spoilerlog">
      <span>[ SPOILERLOG ]</span>
      <span>SPACE</span>
    </div>
  {/if}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .panel {
    @apply bg-gray-900/95 px-3 py-2.5;
  }

  .choice-row {
    @apply flex items-start gap-2 font-mono text-sm font-bold;
    filter: brightness(1.5);
    /* text-shadow: 0 0 6px currentColor; */
    /* -webkit-text-stroke: 0.5px white; */
  }

  .spoilerlog {
    @apply flex items-center justify-between font-mono text-sm text-gray-200;
  }
</style>
