<script lang="ts">
  import { ARC_COLORS } from '𝕮⁂𝕮/anthrofractal/arc-colors';

  export type ArcStripeProps = { count?: number };
  const { count = 1 }: ArcStripeProps = $props();

  const cycles = $derived(Array.from({ length: Math.max(1, count) }));
</script>

<div class="flex w-full" style="height: 1px; flex-shrink: 0">
  {#each cycles as _}
    {#each ARC_COLORS as color}
      <div class="flex-1" style="background-color: {color}"></div>
    {/each}
  {/each}
</div>
