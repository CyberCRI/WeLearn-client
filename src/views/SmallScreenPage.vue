<template>
  <div class="background is-flex is-flex-direction-column">
    <img src="@/assets/imac.png" alt="Mobile Testing" />
    <h3 class="title is-3 has-text-centered mx-4 my-3 has-text-dark-gray">
      {{ $t('smallScreenPage.title') }}
    </h3>
    <p class="has-text-centered mx-6 subtitle has-text-dark-gray">
      {{ $t('smallScreenPage.subtitle') }}
    </p>
  </div>
</template>
<style scoped>
.background {
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  color: var(--neutral-10);
}
</style>
