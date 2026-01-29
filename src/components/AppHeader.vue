<template>
  <router-link class="app-header-link" to="/">
    <div class="app-header">
      <img alt="App large logo" class="logo" src="@/assets/logo.png" />

      <span class="is-title has-text-weight-semibold has-text-success ml-1">Beta</span>
    </div>
  </router-link>
</template>

<style scoped>
.app-header {
  margin: 1rem 0 1em 1rem;
  z-index: 1;
  display: flex;
  margin-left: 2%;
  margin-bottom: 0rem;
}

.logo {
  height: 100%;
  width: auto;
  max-height: clamp(24px, 5vw, 3.5em);
}

@media (max-width: 1600px) {
  .app-header-link {
    display: none;
  }
}
</style>
