<script lang="ts">
  import {
    type Colorshapes,
    type Colorword,
  } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { getNavigatrix } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { type Navigatrix, type NavKey } from '𝕮⁂𝕮/nav/navigatrix';

  export type Props<Word extends Colorword> = {
    override?: Colorshapes[Word];
  };

  const { override }: Props<'navigatrix'> = $props();

  const ledger = useColormarkLedger();
  const nav: Navigatrix = $derived(override ?? getNavigatrix(ledger));

  const TOP_ROW: readonly NavKey[] = ['≺', '≻', '☉', '★'];
  const BOT_ROW: readonly NavKey[] = ['≪', '≫', '⭯', '⊘'];
  const HIDDEN_WHEN_ZERO = new Set<NavKey>(['☉', '★', '⊘', '⭯']);
</script>

{#snippet cell(key: NavKey, countPos: 'above' | 'below')}
  {@const n = nav[key] ?? 0}
  {@const hide = HIDDEN_WHEN_ZERO.has(key) && n === 0}
  <div class="cell" class:invisible={hide}>
    {#if countPos === 'above'}
      {@render count(n)}
    {/if}
    <span class="key" class:lit={n > 0}>{key}</span>
    {#if countPos === 'below'}
      {@render count(n)}
    {/if}
  </div>
{/snippet}

{#snippet count(n: number)}
  <span class="count">{n}</span>
{/snippet}

<div class="grid">
  {#each TOP_ROW as key (key)}
    {@render cell(key, 'above')}
  {/each}
  {#each BOT_ROW as key (key)}
    {@render cell(key, 'below')}
  {/each}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    @apply font-mono text-lg gap-x-3;
  }

  .cell {
    @apply flex flex-col items-center;
  }

  .key {
    @apply text-gray-600;
  }

  .key.lit {
    @apply text-teal-600;
  }

  .count {
    @apply text-gray-600 text-sm leading-tight;
  }
</style>
