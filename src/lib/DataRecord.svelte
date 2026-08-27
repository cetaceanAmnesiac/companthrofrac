<script lang="ts">
  type Props = { data: unknown; label?: string };
  const { data, label }: Props = $props();
</script>

{#snippet val(v: unknown, depth: number)}
  {#if v === null}
    <span class="v-null">∅</span>
  {:else if v === undefined}
    <span class="v-undef">—</span>
  {:else if typeof v === 'boolean'}
    <span class={v ? 'v-true' : 'v-false'}>{String(v)}</span>
  {:else if typeof v === 'number'}
    <span class="v-num">{v}</span>
  {:else if typeof v === 'string'}
    <span class="v-str">'{v}'</span>
  {:else if Array.isArray(v)}
    {#if v.length === 0}
      <span class="v-punct">[]</span>
    {:else}
      <span class="v-punct">[</span>{#each v as item, i}{@render val(
          item,
          depth + 1,
        )}{#if i < v.length - 1}<span class="v-punct">, </span>{/if}{/each}<span
        class="v-punct">]</span
      >
    {/if}
  {:else if typeof v === 'object' && depth < 2}
    {#each Object.entries(v as { [key: string]: unknown }) as [k, sub]}
      <div class="kv-row nested">
        <span class="key">{k}</span><span class="v-punct colon">:</span
        >{@render val(sub, depth + 1)}
      </div>
    {/each}
  {:else}
    <span class="v-fallback">{JSON.stringify(v)}</span>
  {/if}
{/snippet}

<div class="data-record">
  {#if label}
    <div class="record-label">{label}</div>
  {/if}
  {#if typeof data === 'object' && data !== null && !Array.isArray(data)}
    {#each Object.entries(data) as [k, v]}
      <div class="kv-row">
        <span class="key">{k}</span><span class="v-punct colon">:</span
        >{@render val(v, 0)}
      </div>
    {/each}
  {:else}
    {@render val(data, 0)}
  {/if}
</div>

<style>
  .data-record {
    font-family: var(--font-onesize);
    font-size: 10px;
    line-height: 1.7;
    background: #060a0f;
    padding: 5px 8px;
    border: 1px solid #141e28;
  }

  .record-label {
    font-size: 8px;
    letter-spacing: 0.14em;
    color: #8caac5;
    text-transform: uppercase;
    margin-bottom: 3px;
    user-select: none;
  }

  .kv-row {
    display: flex;
    align-items: baseline;
    gap: 0;
    min-width: 0;
    flex-wrap: wrap;
  }

  .kv-row.nested {
    padding-left: 10px;
  }

  .key {
    color: #2d5060;
    flex-shrink: 0;
  }
  .v-punct {
    color: #1e3040;
  }
  .colon {
    margin: 0 3px 0 1px;
  }

  .v-str {
    color: #5eaaa0;
  }
  .v-num {
    color: #7bafd4;
  }
  .v-true {
    color: #5a9e70;
  }
  .v-false {
    color: #3d4f58;
  }
  .v-null {
    color: #2a3a44;
  }
  .v-undef {
    color: #2a3a44;
  }
  .v-fallback {
    color: #4a6070;
  }
</style>
