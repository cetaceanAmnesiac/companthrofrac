<script lang="ts">
  // import logo from '@/assets/icon.png';
</script>

<header class="cc-banner">
  <!-- <img src={logo} class="cc-logo" /> -->
  <div class="cc-banner-text">
    <h1 class="cc-panel-title">COMPANTHROFRAC</h1>
  </div>
</header>

<style>
  .cc-banner {
    box-sizing: inherit;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;

    margin: 0.5em 0;

    color: #333;
    font-size: 1em;
  }

  .cc-banner-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }

  .cc-panel-title {
    font-family: var(--font-onesize-reverse);
    color: #284469;
    filter: drop-shadow(0 0 1px #284469);
    margin: 0;
    font-size: 30px;
  }

  /* .cc-logo {
    box-sizing: inherit;

    width: 72px;
    height: 72px;
    will-change: filter;
    transition: filter 300ms;

    &:hover {
      filter: drop-shadow(0 0 1em #df070777);
    }
  } */
</style>
