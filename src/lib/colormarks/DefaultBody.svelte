<script lang="ts">
  import { type BodyProps } from '𝕮⁂𝕮/colormarks/body-registry';
  import Marginalia from '𝕮⁂𝕮/colormarks/Marginalia.svelte';

  const { word }: BodyProps = $props();
</script>

<Marginalia {word} />
