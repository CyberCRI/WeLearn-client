<script setup lang="ts">
import { WL_FEEDBACK_FORM_URL } from '@/utils/constants';
</script>

<template>
  <div class="footer-wrapper">
    <router-link class="terms" to="/terms">
      <span class="item-name">{{ $t('terms') }}</span>
    </router-link>

    <a target="_blank" :href="WL_FEEDBACK_FORM_URL">{{ $t('giveFeedback') }}</a>
  </div>
</template>

<style scoped>
.footer-wrapper {
  padding: 0 5rem;
  display: flex;
  justify-content: center;
  color: var(--neutral-70);
  font-size: 0.9rem;
}

a {
  all: unset;
  cursor: pointer;
}

a.terms {
  margin-right: 1rem;
  padding-right: 1rem;
  border-right: 1px solid var(--neutral-70);
}

a:hover {
  text-decoration: underline;
}
</style>
