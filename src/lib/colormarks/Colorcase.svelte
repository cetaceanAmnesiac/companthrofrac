<script lang="ts">
  import { getBody } from '𝕮⁂𝕮/colormarks/body-registry';
  import BooleanButton from '𝕮⁂𝕮/colormarks/BooleanButton.svelte';
  import {
    isBooleanColorword,
    type Colorword,
  } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { tw } from '𝕮⁂𝕮/utils';

  export type Props = {
    word: Colorword;
    open: boolean;
    seen: boolean;
    onToggle: () => void;
  };

  const { word, open, seen, onToggle }: Props = $props();

  const ledger = useColormarkLedger();

  const CASE = tw(
    'colorcase relative flex flex-col transition-colors duration-150',
    'before:absolute before:left-0 before:-top-1 before:-bottom-1',
    'before:w-[2px] before:transition-colors before:duration-200',
    '[&+.open]:mt-1 [&.open+.colorcase]:mt-1',
  );

  const CASE_OPEN = tw('bg-white/35 before:bg-teal-500 before:z-10');
  const CASE_CLOSED = tw('bg-white/20 before:bg-gray-400');
</script>

<div class:open class="{CASE} {open ? CASE_OPEN : CASE_CLOSED}">
  <div
    class="flex flex-row items-center gap-2 pl-3 pr-4 py-2.5 cursor-pointer"
    role="button"
    tabindex="0"
    onclick={onToggle}
    onkeydown={e => ['Enter', ' '].includes(e.key) && onToggle()}
  >
    <span
      class="font-mono text-lg leading-none shrink-0 {seen
        ? 'text-teal-600'
        : 'text-gray-500'}"
    >
      {seen ? '◈' : '◇'}
    </span>

    <span class="font-mono text-lg text-gray-600">{word}</span>

    {#if isBooleanColorword(word)}
      <BooleanButton {word} />
    {:else}
      {@const glossed = ledger.gloss(word)}
      <span class="ml-auto font-mono text-base text-gray-600 truncate">
        {glossed}
      </span>
    {/if}
  </div>

  {#if open}
    {@const Body = getBody(word)}
    <div class="pl-8 pr-4 pb-3">
      <Body {word} />
    </div>
  {/if}
</div>
