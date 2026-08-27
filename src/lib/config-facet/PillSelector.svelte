<script lang="ts">
  import { type Snippet } from 'svelte';

  export type PillSelectorProps = {
    on?: boolean;
    children: Snippet;
    class?: string;
  };

  let {
    on = true,
    children,
    class: extraClass = '',
  }: PillSelectorProps = $props();
</script>

<div
  class="pill-row inline-flex rounded-lg bg-gray-100 p-1 {extraClass}"
  class:on
>
  {@render children()}
  <div class="outline-haver"></div>
</div>

<style>
  @reference "../../assets/tailwind.css";

  .pill-row {
    @apply relative;
  }

  .outline-haver {
    @apply absolute inset-0 rounded-lg z-10;
    @apply pointer-events-none;
    @apply border-2 border-transparent transition-[border-color];
  }

  .pill-row.on .outline-haver {
    @apply border-teal-500;
  }

  .pill-row :global(.pill-btn) {
    @apply rounded-md px-3 py-1;
    @apply text-xs font-medium uppercase;
    @apply text-gray-400 transition-all;
    @apply hover:bg-gray-200 hover:text-gray-700;
    @apply active:bg-gray-300 active:scale-95;
  }

  /* dormant: active pill is gray */
  .pill-row :global(.pill-btn.active) {
    @apply bg-gray-300 text-gray-600 shadow-none;
    @apply hover:bg-gray-400 hover:text-gray-700;
    @apply active:bg-gray-300 active:scale-95;
  }

  /* live: active pill is teal */
  .pill-row.on :global(.pill-btn.active) {
    @apply bg-teal-500 text-white shadow-sm;
    @apply hover:bg-teal-400 hover:text-white;
    @apply active:bg-teal-600 active:scale-95;
  }
</style>
