<script lang="ts">
  import { type MouseEventHandler } from 'svelte/elements';

  export type ToggleProps = {
    on: boolean;
    onclick?: MouseEventHandler<HTMLElement>;
    'aria-label': string;
    disabled?: boolean;
  };

  let {
    on,
    onclick,
    'aria-label': ariaLabel,
    disabled = false,
  }: ToggleProps = $props();
</script>

<button
  type="button"
  class="toggle"
  class:on
  {onclick}
  {disabled}
  aria-label={ariaLabel}
>
  <span class="thumb" class:on></span>
</button>

<style>
  @reference "../../assets/tailwind.css";

  .toggle {
    @apply relative h-4 w-7;
    @apply shrink-0 rounded-full;
    @apply bg-gray-400 transition-colors cursor-pointer;
  }
  .toggle.on {
    @apply bg-teal-500;
  }

  .thumb {
    @apply absolute top-0.5 left-0.5;
    @apply h-3 w-3 rounded-full;
    @apply bg-white shadow transition-transform;
  }
  .thumb.on {
    @apply translate-x-3;
  }
</style>
