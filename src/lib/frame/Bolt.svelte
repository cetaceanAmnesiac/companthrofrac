<script lang="ts">
  import { GRAYS } from '𝕮⁂𝕮/frame/colors';

  const [DARK, MEDIUM, LIGHT] = GRAYS;

  const styleVars = [
    `--dark: ${DARK}`,
    `--medium: ${MEDIUM}`,
    `--light: ${LIGHT}`,
  ].join('; ');
</script>

<div class="cc-bolt" style={styleVars}></div>

<style>
  .cc-bolt {
    box-sizing: content-box;
    position: absolute;
    width: 3px;
    height: 3px;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--dark) var(--dark) var(--light) var(--light);
    outline: 0.5px solid var(--medium);

    background-color: var(--color);
    top: var(--top);
    right: var(--right);
    bottom: var(--bottom);
    left: var(--left);
  }
</style>
