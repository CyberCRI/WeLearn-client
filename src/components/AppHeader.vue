<template>
  <div class="app-header">
    <router-link to="/">
      <img alt="logo" class="logo" src="@/assets/logo.png" />
    </router-link>
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
    margin-left: 2rem;
    margin-bottom: 0.5rem;
  }
}
</style>
