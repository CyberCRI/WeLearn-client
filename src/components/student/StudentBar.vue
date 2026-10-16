<script setup lang="ts">
import LanguageSelector from '@/components/nav/LanguageSelector.vue';
</script>
<template>
  <header class="student-bar">
    <router-link class="home-link" :to="{ name: 'learn' }">
      <img alt="WeLearn" class="logo" src="@/assets/logo.png" />
      <span class="divider" aria-hidden="true"></span>
      <span class="space-title">{{ $t('student.bar.title') }}</span>
    </router-link>
    <LanguageSelector />
  </header>
</template>

<style scoped>
.student-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--neutral-20);
}

.home-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
}

.logo {
  height: 2.25rem;
  width: auto;
}

.divider {
  width: 1px;
  height: 1.5rem;
  background: var(--neutral-20);
}

.space-title {
  font-weight: 600;
  color: var(--primary-dark);
}

@media (max-width: 480px) {
  .student-bar {
    padding: 0.5rem 1rem;
  }

  .logo {
    height: 1.75rem;
  }
}
</style>
