<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    compareEffronteries,
    connectPrinter,
    type Effrontery,
    formatClock,
    getStamps,
    type Stamp,
  } from '𝕮⁂𝕮/utils/time';

  const MIN_EFFRONTERY: Effrontery = 'info';

  let logEl = $state<HTMLElement | null>(null);
  let stamps = $state<Stamp[]>(getStamps());
  const shownStamps = $derived(
    stamps.filter(([, eff]) => compareEffronteries(eff, MIN_EFFRONTERY) >= 0),
  );

  // must wrap, do not `connectPrinter(stamps.push)`
  const unsub = connectPrinter(ts => stamps.push(ts));
  onDestroy(unsub);

  $effect(() => {
    void stamps.length;
    logEl?.scrollTo({ top: logEl.scrollHeight });
  });
</script>

<div class="log" bind:this={logEl}>
  {#each shownStamps as [t, eff, msg], ix (ix)}
    <div class="entry {eff}">
      <span class="time">{formatClock(t)}</span>
      <span class="msg">{msg}</span>
    </div>
  {/each}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .log {
    @apply font-mono text-sm leading-snug;
    @apply max-h-40 overflow-y-auto;
    @apply flex flex-col gap-px;
    @apply px-4 py-2;
  }

  .entry {
    @apply flex gap-2;
  }

  .time {
    @apply shrink-0 text-gray-500 w-18 text-right;
  }

  .entry.debug .msg {
    @apply text-gray-500;
  }
  .entry.warn .msg {
    @apply text-amber-600;
  }
  .entry.error .msg {
    @apply text-red-600;
  }
</style>
