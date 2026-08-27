<script lang="ts">
  import { type Snippet } from 'svelte';
  import Bolts from '𝕮⁂𝕮/frame/Bolts.svelte';
  import { GRAYS, MIDPOINT } from '𝕮⁂𝕮/frame/colors';

  export type FrameProps = { children: Snippet };
  const { children }: FrameProps = $props();

  const [, BORDER_COLOR] = GRAYS;

  const styleVars = [
    `--border-color: ${BORDER_COLOR}`,
    `--bg-color: ${MIDPOINT}`,
  ].join('; ');
</script>

<div class="cc-frame" style={styleVars}>
  {@render children()}
  <Bolts />
</div>

<style>
  .cc-frame {
    box-sizing: border-box;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;

    width: 100%;
    height: 100%;
    /* flex: 1; */
    min-height: 0;

    /* margin: 0.75em 4em 0; */
    /* padding: 0.35em 0; */

    /* gap: 0.25em; */
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    font-size: 1em;
    /* color: #333; */
  }
</style>
