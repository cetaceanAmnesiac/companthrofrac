<script lang="ts">
  import { type BodyProps } from '𝕮⁂𝕮/colormarks/body-registry';
  import Marginalia from '𝕮⁂𝕮/colormarks/Marginalia.svelte';
  import NavigatrixColorlet from '𝕮⁂𝕮/colormarks/NavigatrixColorlet.svelte';

  const { word }: BodyProps = $props();
</script>

<div class="flex flex-row gap-3">
  <NavigatrixColorlet />
  <Marginalia {word} />
</div>
