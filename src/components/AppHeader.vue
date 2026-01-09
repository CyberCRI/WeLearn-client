<template>
  <div class="app-header">
    <router-link to="/">
      <img alt="logo" class="logo" src="@/assets/logo.png" />
    </router-link>
    <span class="is-title has-text-weight-semibold is-size-4 has-text-success ml-1">Beta</span>
  </div>
</template>

<style scoped>
.app-header {
  margin: 1rem 0 1em 1rem;
  z-index: 1;
  transition: height 0.5s;
}

@media screen and (min-width: 576px) {
  .logo {
    width: 100%;
    min-width: 4em;
    max-height: 2em;
  }
}

@media screen and (min-width: 768px) {
  .logo {
    font-size: 2rem;
  }
}

@media screen and (min-width: 992px) {
  .app-header {
    display: flex;
    margin-left: 2rem;
    margin-bottom: 0rem;
  }
}
</style>
