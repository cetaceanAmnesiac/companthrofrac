<script lang="ts">
  import { type SVGAttributes } from 'svelte/elements';
  import { stringify } from '𝕮⁂𝕮/utils';

  type PreProps = SVGAttributes<HTMLPreElement>;
  export type Props = PreProps & { value: unknown };

  const { class: className, value }: Props = $props();
</script>

<pre class="json-view {className}">{stringify(value)}</pre>

<style>
  .json-view {
    font-family: var(--font-onesize);
    font-size: 12px;
    line-height: 1.6;
    color: #4a6070;
    background: #060a0f;
    border: 1px solid #141e28;
    padding: 5px 8px;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-y: auto;
  }
</style>
