<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<!-- pages reached from the keycloak login, shown without the header and nav bar
     (meta.hideTemplate): the same layout as the login page, logo on top -->
<template>
  <div class="auth-page">
    <router-link to="/" class="auth-logo" data-testid="auth-logo-link">
      <img src="@/assets/logo.png" :alt="$t('authentication.logoAlt')" />
    </router-link>
    <h1 class="title is-4 is-size-5-mobile">{{ title }}</h1>
    <div class="box">
      <slot />
    </div>
  </div>
</template>

<style lang="css" scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem 2rem;
}

.auth-logo img {
  display: block;
  height: 5.5rem;
  width: auto;
}

h1 {
  margin-top: 2rem;
  text-align: center;
}

.box {
  width: 25%;
  min-width: 420px;
  padding: 4rem;
}

@media (max-width: 750px) {
  .auth-page {
    padding-top: 1.5rem;
  }

  .auth-logo img {
    height: 3.5rem;
  }

  h1 {
    margin-top: 1rem;
  }

  .box {
    width: 100%;
    min-width: unset;
    padding: 1rem 2rem;
  }
}
</style>
