<template>
  <router-link class="app-header-link" to="/">
    <div class="app-header">
      <!-- both loaded up front and toggled by CSS: a <picture> swap lags behind the size change and flickers -->
      <img alt="App large logo" class="logo logo-full" src="@/assets/logo.png" />
      <img alt="App large logo" class="logo logo-symbol" src="@/assets/logo-symbol.png" />

      <span class="is-title has-text-weight-semibold has-text-success ml-1">Beta</span>
    </div>
  </router-link>
</template>

<style scoped>
.app-header {
  margin: 1rem 0 0 1rem;
  z-index: 1;
  display: flex;
}

.app-header-link {
  margin-right: 2.5rem;
}

.logo {
  height: 100%;
  width: auto;
  max-height: 3.5em;
}
.logo-symbol {
  display: none;
}

/* 1330px = where full logo + labelled nav stop fitting (measured ~1280px in FR); below it the logo is
   swapped for the symbol, nav labels become tooltips (BaseNavItem) and the nav loses its top space (NavComponent).
   Keep the three breakpoints in sync */
@media (max-width: 1330px) {
  /* bottom-align with the nav: the 2.5rem logo's centre then sits 1.25rem up, same as the nav icons'
     (1.5rem icon + 0.5rem padding under it), so they stay level whatever the nav's top padding */
  .app-header-link {
    margin-right: 0.5rem;
    flex-shrink: 0;
    align-self: flex-end;
  }
  .app-header {
    margin: 0 0 0 1rem;
  }
  .logo {
    height: 2.5rem;
    max-height: none;
  }
  .logo-full {
    display: none;
  }
  .logo-symbol {
    display: block;
  }
  .app-header > span {
    display: none;
  }
}
</style>
