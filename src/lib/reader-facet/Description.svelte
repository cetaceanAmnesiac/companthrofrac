<script lang="ts">
  export type DescriptionProps = { paragraphs: string[] };
  const { paragraphs }: DescriptionProps = $props();
</script>

<div class="border-t border-gray-200 pt-2">
  {#each paragraphs as text, ix (ix)}
    <p
      class="font-sans text-xs leading-relaxed text-gray-600"
      class:mt-[0.6em]={ix > 0}
    >
      {text}
    </p>
  {/each}
</div>
