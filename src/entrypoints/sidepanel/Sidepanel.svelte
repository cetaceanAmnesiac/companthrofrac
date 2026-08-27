<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onAction, sendAction } from '𝕮⁂𝕮/actions';
  import Banner from '𝕮⁂𝕮/Banner.svelte';
  import { type Colorword } from '𝕮⁂𝕮/colormarks/colormarks.model';
  import { getFacet } from '𝕮⁂𝕮/colormarks/colormarks.selectors';
  import { watchSightings } from '𝕮⁂𝕮/colormarks/colormarks.storage';
  import { useColormarkLedger } from '𝕮⁂𝕮/colormarks/useColormarkLedger.svelte';
  import ConfigFacet from '𝕮⁂𝕮/config-facet/ConfigFacet.svelte';
  import Credits from '𝕮⁂𝕮/Credits.svelte';
  import Frame from '𝕮⁂𝕮/frame/Frame.svelte';
  import { createKeyHandler } from '𝕮⁂𝕮/keybindings';
  import MarksFacet from '𝕮⁂𝕮/marks-facet/MarksFacet.svelte';
  import AspectRail from '𝕮⁂𝕮/nav/AspectRail.svelte';
  import NavControls from '𝕮⁂𝕮/nav/NavControls.svelte';
  import ProgressBar from '𝕮⁂𝕮/reader-facet/ProgressBar.svelte';
  import ReaderFacet from '𝕮⁂𝕮/reader-facet/ReaderFacet.svelte';
  import { toast } from '𝕮⁂𝕮/toast';
  import { stamp } from '𝕮⁂𝕮/utils';

  const ledger = useColormarkLedger();
  const facet = $derived(getFacet(ledger));
  const credited = $derived(ledger.produceBit('credited'));

  const isOffsite = (url?: string) => {
    try {
      return new URL(url ?? '').hostname !== 'anthrofractal.com';
    } catch {
      return true;
    }
  };

  let offsite = $state(false);
  browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    offsite = isOffsite(tab?.url);
  });

  $effect(() => {
    const onActivated = async ({ tabId }: Browser.tabs.OnActivatedInfo) => {
      const tab = await browser.tabs.get(tabId);
      offsite = isOffsite(tab.url);
    };
    const onUpdated = (_: number, { url }: Browser.tabs.OnUpdatedInfo) => {
      if (url !== undefined) offsite = isOffsite(url);
    };
    browser.tabs.onActivated.addListener(onActivated);
    browser.tabs.onUpdated.addListener(onUpdated);
    return () => {
      browser.tabs.onActivated.removeListener(onActivated);
      browser.tabs.onUpdated.removeListener(onUpdated);
    };
  });

  const handleKeydown = createKeyHandler({
    onSight: () => sendAction({ action: 'sight' }),
    onReveal: () => sendAction({ action: 'reveal' }),
    setFacet: facet => void ledger.mark('companthrofacet', facet),
    getFacet: () => facet,
    setUiMode: mode => void ledger.mark('uiMode', mode),
    toast,
  });

  $effect(() =>
    onAction(cpθfr => {
      if (cpθfr.action === 'toast') toast(cpθfr.msg);
      if (cpθfr.action === 'stamp') stamp(cpθfr.msg, cpθfr.eff);
    }),
  );

  const seeWord = (word: Colorword) => toast(`◈ ${word}`);
  // i'll leave when i'm good and ready!

  $effect(() => watchSightings(newWords => newWords.forEach(seeWord)));
</script>

<svelte:window onkeydown={handleKeydown} />

<main class="cc-panel">
  <Frame>
    <!-- <button onclick={() => seeWord('test' as Colorword)}>Test</button> -->
    <Banner />
    <ProgressBar {offsite} />
    <NavControls {offsite} />
    <AspectRail />

    <div class="cc-facet">
      {#key facet}
        <div
          in:fade={{ duration: 150 }}
          class="flex flex-1 flex-col min-h-0 w-full"
        >
          {#if facet === 'reader'}
            <ReaderFacet />
          {:else if facet === 'marks'}
            <MarksFacet />
          {:else if facet === 'config'}
            <ConfigFacet />
          {:else}
            <!-- ??? -->
          {/if}
        </div>
      {/key}
    </div>

    {#if credited}<Credits />{/if}
  </Frame>
</main>

<style>
  .cc-facet {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .cc-panel {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    font-family: var(--font-onesize);

    padding: 6px;
    width: 100%;
    height: 100%;
  }
</style>
