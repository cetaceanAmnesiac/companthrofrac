<script lang="ts">
  export type AdorningToggleProps = {
    on: boolean;
    onclick: () => void;
    'aria-label': string;
    disabled?: boolean;
  };

  let {
    on,
    onclick,
    'aria-label': ariaLabel,
    disabled = false,
  }: AdorningToggleProps = $props();
</script>

<button
  type="button"
  class="toggle"
  {onclick}
  {disabled}
  aria-label={ariaLabel}
>
  <div class="bg-left"></div>
  <div class="bg-right"></div>
  <span class="thumb" class:on></span>
</button>

<style>
  @reference "../../assets/tailwind.css";

  .toggle {
    @apply relative h-8 w-15;
    @apply shrink-0;
    @apply bg-gray-100;
    @apply transition-[border-radius] duration-400;
    @apply rounded-l-full;
  }

  .thumb {
    @apply absolute top-0.5 left-0.5;
    @apply h-7 w-7;
    @apply bg-white;
    @apply border-2 border-gray-300;
    @apply transition-[translate,rotate,box-shadow,border-radius,border-color] duration-400;
    @apply rounded-t-full;
    @apply rounded-b-full;
    @apply translate-x-0;
    @apply rotate-0;
  }

  .thumb.on {
    @apply translate-x-7;
    @apply border-teal-500;
    @apply rounded-r-none;
  }
</style>
