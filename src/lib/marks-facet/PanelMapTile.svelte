<script lang="ts">
  import { getWrbygHex, wrbygToHex } from '𝕮⁂𝕮/anthrofractal/arc-colors';
  import { type Resolution, type WRBYG } from '𝕮⁂𝕮/anthrofractal/choices';
  import { type IndexedPanelId } from '𝕮⁂𝕮/anthrofractal/panel-id';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import { nTuple } from '𝕮⁂𝕮/utils';

  export type PanelMapTileProps = {
    index: IndexedPanelId;
    seen: boolean;
    revealed: boolean;
    nomianiColor: string | null;
    choices: WRBYG[] | null;
    resolution: Resolution | null;
    title?: string;
    onclick?: () => void;
    current: boolean;
  };

  const {
    index,
    seen,
    revealed,
    nomianiColor,
    choices,
    resolution,
    title,
    onclick,
    current,
  }: PanelMapTileProps = $props();

  const ledger = useColormarkLedger();
  const beachball = $derived(ledger.produceBit('beachball'));

  const showStripFor: 'all' | 'current' = 'all' as 'all' | 'current'; // TODO: ?

  const arcToBackground = (arc: string) => {
    const chars = [...arc];
    if (chars.length === 1) return wrbygToHex(arc) ?? TILE_MID;
    const hexes = chars.map(c => wrbygToHex(c) ?? TILE_MID);
    const seg = 360 / hexes.length;
    const stops = hexes.map((h, i) => `${h} ${i * seg}deg ${(i + 1) * seg}deg`);
    return `conic-gradient(${stops.join(', ')})`;
  };

  const TILE_DARK = '#1f2937';
  const TILE_MID = '#4b5563';
  const TILE_LIGHT = '#9ca3af';

  const lightBg = $derived(nomianiColor === 'W' || nomianiColor === 'Y');

  // TODO: beachball?
  const background = $derived(
    !revealed
      ? null
      : nomianiColor
        ? arcToBackground(nomianiColor)
        : choices?.length
          ? TILE_LIGHT
          : TILE_MID,
  );

  const stripStyle = $derived.by<string | null>(() => {
    if (
      !beachball ||
      !seen ||
      !revealed ||
      !choices?.length ||
      (showStripFor === 'current' && !current)
    )
      return null;

    if (choices.length === 1) return `background: ${getWrbygHex(choices[0])}`;
    if (choices.every(c => c === 'W'))
      return createAllWhiteStrip(choices.length);

    const seg = 100 / choices.length;
    const stops = choices
      .map(getWrbygHex)
      .flatMap((h, i) => [`${h} ${i * seg}%`, `${h} ${(i + 1) * seg}%`]);
    return `background: linear-gradient(to bottom, ${stops.join(', ')})`;
  });

  const createAllWhiteStrip = (n: number) => {
    const sep = TILE_DARK;
    const stops = nTuple(n - 1, i => (100 / n) * (i + 1)).flatMap(pct => [
      `white calc(${pct}% - 0.5px)`,
      `${sep} calc(${pct}% - 0.5px)`,
      `${sep} calc(${pct}% + 0.5px)`,
      `white calc(${pct}% + 0.5px)`,
    ]);
    return `background: linear-gradient(to bottom, white, ${stops.join(', ')}, white)`;
  };
</script>

{#snippet tileContents()}
  {#if stripStyle}
    <div class="strip delineator"></div>
    <div class="strip choices" style={stripStyle}></div>
    {#if choices?.length && Array.isArray(resolution)}
      {#each resolution as i}
        <div
          class="res-dot {choices[i] === 'W' ? 'bg-gray-600' : 'bg-white'}"
          style="top: {((i + 0.5) / choices.length) * 100}%"
        ></div>
      {/each}
    {/if}
  {/if}
  {#if revealed && !choices?.length}
    <div class="hiatus-dots">
      {#each Array(3) as _, i (i)}<span></span>{/each}
    </div>
  {/if}
  {#if revealed}
    <div class="index" class:light={lightBg}>
      <span>{index}</span>
    </div>
  {/if}
{/snippet}

{#if onclick}
  <button
    {title}
    {onclick}
    class="tile"
    class:unrevealed={seen && !revealed}
    class:current
    style:background
  >
    {@render tileContents()}
  </button>
{:else}
  <div
    {title}
    class="tile"
    class:unrevealed={seen && !revealed}
    class:current
    style:background
  >
    {@render tileContents()}
  </div>
{/if}

<style>
  @reference "../../assets/tailwind.css";

  .tile {
    --tile-dark: #1f2937;
    --tile-mid: #4b5563;

    @apply transition-colors;
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: var(--tile-dark);
    outline: 2px solid rgba(0, 0, 0, 0.15);
    outline-offset: -2px;
    container-type: inline-size;
  }

  .tile.unrevealed {
    background:
      radial-gradient(circle at 63% 63%, var(--tile-dark) 33%, transparent 33%),
      radial-gradient(circle at 50% 50%, var(--tile-mid) 44%, transparent 44%),
      var(--tile-dark);
  }

  .index {
    position: absolute;
    left: 3px;
    bottom: 3px;
    padding: 0 3px;
    border-radius: 3px;
    font-size: clamp(7px, 30cqi, 16px);
    font-weight: 600;
    line-height: 1;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: none;

    &.light {
      background: none;
      & span {
        color: #10202a;
      }
    }

    & span {
      position: relative;
      top: 1px;
    }
  }

  @container (min-width: 32px) {
    .index {
      display: block;
    }
  }

  button.tile {
    @apply cursor-pointer;

    &:hover {
      @apply scale-110 ring-3 ring-white/50 z-11 rounded-sm;
    }
  }

  .current {
    @apply ring-1 ring-white ring-offset-1 ring-offset-gray-900 z-10 rounded-sm;
  }

  .tile {
    --strip-w: clamp(3px, 20cqi, 8px);
  }

  .strip {
    position: absolute;
    top: 0;
    bottom: 0;

    &.delineator {
      @apply bg-gray-800;
      right: var(--strip-w);
      width: 1px;
    }

    &.choices {
      @apply right-0;
      width: var(--strip-w);
    }
  }

  .hiatus-dots {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(1px, 5cqi, 3px);
    pointer-events: none;

    span {
      width: clamp(2px, 10cqi, 6px);
      height: clamp(2px, 10cqi, 6px);
      border-radius: 50%;
      background: #7f97a0;
    }
  }

  .res-dot {
    position: absolute;
    right: calc(var(--strip-w) * 0.1);
    width: calc(var(--strip-w) * 0.8);
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
    transform: translateY(-50%);
    pointer-events: none;
  }
</style>
