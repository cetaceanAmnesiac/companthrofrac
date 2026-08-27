<script lang="ts">
  import { fly } from 'svelte/transition';
  import {
    getPanelLabel,
    getPanelTooltip,
    isIndexedPanel,
    type PanelId,
  } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import {
    getAcme,
    getAnchor,
    getHighestFolium,
  } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { NAV, resolveStep } from '𝕮⁂𝕮/nav/nav';
  import { type NavStep } from '𝕮⁂𝕮/nav/navigatrix';

  export type NavControlsProps = {
    offsite: boolean;
  };

  const { offsite }: NavControlsProps = $props();

  const ledger = useColormarkLedger();
  const anchor = $derived(getAnchor(ledger));
  const acme = $derived(getAcme(ledger));
  const highestFolium = $derived(getHighestFolium(ledger));
  const last = $derived(acme ?? highestFolium);

  const disabled = $derived<Record<NavStep, boolean>>({
    '≪': anchor === 1,
    '≺': offsite || !isIndexedPanel(anchor) || anchor <= 1,
    '⭯': !offsite || anchor === null,
    '≻':
      offsite || !isIndexedPanel(anchor) || (acme !== null && anchor >= acme),
    '≫': last === null || (isIndexedPanel(anchor) && anchor >= last),
  });

  const ANIM_DISTANCE = 200;
  const FADE_DURATION = 150;
  const FLY_DURATION = 300;
  let prevAnchor = $state<PanelId | null>(null);
  const dir = $derived(
    !isIndexedPanel(anchor) || !isIndexedPanel(prevAnchor)
      ? 0
      : anchor < prevAnchor
        ? -1
        : 1,
  );
  $effect(() => void (prevAnchor = anchor));
</script>

{#snippet navBtn(step: NavStep)}
  <button
    class="btn"
    onclick={NAV[step]}
    disabled={disabled[step]}
    title={disabled[step] ? undefined : `${resolveStep(step, anchor, last)}`}
  >
    {step}
  </button>
{/snippet}

<div class="row">
  {@render navBtn('≪')}
  {@render navBtn('≺')}

  <button
    class="id"
    onclick={NAV['⭯']}
    disabled={disabled['⭯']}
    title={getPanelTooltip(anchor)}
  >
    {#key anchor}
      <span
        in:fly={{
          x: ANIM_DISTANCE * dir,
          duration: dir === 0 ? FADE_DURATION : FLY_DURATION,
        }}
        out:fly={{
          x: -ANIM_DISTANCE * dir,
          duration: dir === 0 ? FADE_DURATION : FLY_DURATION,
        }}
      >
        {getPanelLabel(anchor)}
      </span>
    {/key}
  </button>

  {@render navBtn('≻')}
  {@render navBtn('≫')}
</div>

<style>
  @reference "../../assets/tailwind.css";

  .row {
    @apply flex w-full divide-x border-y;
    @apply divide-teal-700/15;
    @apply border-teal-500/40;
    @apply bg-white/10;
  }
  .btn,
  .id {
    @apply flex items-center justify-center py-2.5;
    @apply font-mono font-bold text-3xl;
  }
  .btn {
    @apply flex-1 text-teal-600 transition-all;
    @apply hover:text-teal-500 hover:bg-white/50;
    @apply active:text-teal-700 active:bg-teal-50 active:scale-95;
    @apply disabled:text-gray-400 disabled:hover:bg-transparent;
    @apply cursor-pointer;
    @apply disabled:cursor-not-allowed;
  }
  .id {
    @apply flex-[1.2] font-thin text-teal-800 transition-all;
    @apply relative overflow-hidden;
    @apply not-disabled:hover:text-teal-600 not-disabled:hover:bg-white/50;
    @apply not-disabled:active:text-teal-800 not-disabled:active:bg-teal-50 not-disabled:active:scale-95;
  }
  .id > span {
    @apply absolute inset-0 flex items-center justify-center;
  }
  .id:not(:disabled) > span {
    @apply underline underline-offset-2 decoration-2;
    @apply cursor-pointer;
  }
</style>
