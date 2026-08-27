<script lang="ts">
  import Bolts from '𝕮⁂𝕮/frame/Bolts.svelte';
  import { GRAYS, MIDPOINT } from '𝕮⁂𝕮/frame/colors';

  export type ReadoutProps = {
    titleText: string;
    altText: string;
  };

  const { titleText, altText }: ReadoutProps = $props();

  const [, BORDER_COLOR] = GRAYS;

  const styleVars = [
    `--border-color: ${BORDER_COLOR}`,
    `--bg-color: ${MIDPOINT}`,
  ].join('; ');
</script>

<div class="cc-readout" style={styleVars}>
  <div class="cc-readout-row">
    <span class="font-sans font-extralight">title &ndash; </span>
    <span>{titleText}</span>
  </div>

  <div class="cc-readout-row">
    <span class="font-sans font-extralight">alt &ndash; </span>
    <span>{altText}</span>
  </div>

  <Bolts />
</div>

<style>
  .cc-readout {
    /* box-sizing: border-box; */
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;

    margin: 0.75em 4em 0;
    padding: 0.35em 0;

    /* gap: 0.25em; */
    border: 1px solid var(--border-color);
    border-radius: 1px;
    /* background-color: #f9f9f9; */
    /* background-color: #45666c; */
    /* background-color: #4d6e78; */
    /* background-color: #a0bcd0ee; */
    background-color: var(--bg-color);
    font-size: 1em;
    color: #333;

    .cc-readout-row {
      display: flex;
      flex-direction: row;
      justify-content: stretch;
      align-items: center;
      gap: 0.5em;
    }
  }
</style>
