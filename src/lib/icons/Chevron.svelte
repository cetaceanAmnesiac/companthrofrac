<script lang="ts">
  import { type SVGAttributes } from 'svelte/elements';
  import { type LineProps } from '𝕮⁂𝕮/utils';

  type SvgProps = SVGAttributes<SVGSVGElement>;
  export type Props = SvgProps & LineProps & { open?: boolean };

  const {
    class: className,
    open,
    linecap = 'round',
    linejoin = 'miter',
    ...rest
  }: Props = $props();

  const S = 16;
  const PATH = 'M4 10l4-4 4 4';
</script>

<svg
  class="size-3.5 shrink-0 transition-transform duration-200 {open
    ? '-rotate-180'
    : ''} {className}"
  viewBox={`0 0 ${S} ${S}`}
  fill="none"
  stroke="currentColor"
  stroke-width={2}
  {...rest}
>
  <path d={PATH} stroke-linecap={linecap} stroke-linejoin={linejoin} />
</svg>
