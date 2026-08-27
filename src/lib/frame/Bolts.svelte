<script lang="ts">
  import Bolt from '@/lib/frame/Bolt.svelte';
  import { ArcColor } from '𝕮⁂𝕮/anthrofractal/arc-colors';
</script>

<Bolt --color={ArcColor.RED} --top="0" --left="0" />
<Bolt --color={ArcColor.BLUE} --bottom="0" --left="0" />
<Bolt --color={ArcColor.YELLOW} --top="0" --right="0" />
<Bolt --color={ArcColor.GREEN} --bottom="0" --right="0" />
