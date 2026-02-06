<script setup lang="ts">
import { WL_FEEDBACK_FORM_URL } from '@/utils/constants';
</script>

<template>
  <div class="footer-wrapper">
    <a target="_blank" :href="WL_FEEDBACK_FORM_URL">{{ $t('giveFeedback') }}</a>
    <router-link class="terms" to="/terms">
      <span class="item-name">{{ $t('terms') }}</span>
    </router-link>
  </div>
</template>

<style scoped>
.footer-wrapper {
  padding: 0 5rem;
  padding-right: 1.7rem;
  display: flex;
  justify-content: flex-end;
  color: var(--neutral-70);
  font-size: 0.9rem;
}

a {
  all: unset;
  cursor: pointer;
}

a:first-child {
  margin-right: 1rem;
  padding-right: 1rem;
  border-right: 1px solid var(--neutral-70);
}

a:hover {
  text-decoration: underline;
}

@media screen and (max-width: 767px) {
  .footer-wrapper {
    padding: 0 1rem;
    justify-content: center;
    font-size: 0.8rem;
  }

  a:first-child {
    margin-right: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
