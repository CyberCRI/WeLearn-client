<script lang="ts" setup>
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import { renderMarkdown } from '@/utils/markdown';
import { PRIVACY_POLICY_UPDATED_AT, PRIVACY_POLICY_VERSION } from '@/utils/privacyPolicy';
import { formatDay } from '@/utils/time';
import termsEn from '/public/terms_en.md?raw';
import termsFr from '/public/terms_fr.md?raw';

// bundled rather than fetched, so the page shows the text that matches the deployed app and its
// version, with no request to a third party
const TERMS: Record<string, string> = { en: termsEn, fr: termsFr };

// another language (?lang= is free text) gets the english text
const termsHtml = computed(() => renderMarkdown(TERMS[i18n.global.locale.value] ?? termsEn));
const updatedAt = computed(() => formatDay(PRIVACY_POLICY_UPDATED_AT, i18n.global.locale.value));
</script>

<template>
  <div class="terms-page">
    <h1 class="title is-3">{{ $t('privacyPolicy.title') }}</h1>
    <p class="subtitle is-6" data-testid="privacy-policy-version">
      {{ $t('privacyPolicy.lastUpdated', { date: updatedAt, version: PRIVACY_POLICY_VERSION }) }}
    </p>
    <div v-html="termsHtml"></div>
  </div>
</template>

<style scoped>
.terms-page {
  max-width: 48rem;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
