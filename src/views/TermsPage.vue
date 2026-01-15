<script lang="ts" setup>
import i18n from '@/localisation/i18n';
import { marked } from 'marked';
import { onMounted, ref, watch, type Ref } from 'vue';
import terms_en from '/public/terms_en.md?raw';

const termsHtml: Ref<string | Promise<string>> = ref('Loading...');
const fetchMarkdown = async (locale: string) => {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/CyberCRI/WeLearn-client/refs/heads/main/public/terms_${locale}.md`
    );
    if (!res.ok) throw new Error('Failed to fetch Markdown');
    const md = await res.text();

    termsHtml.value = marked(md);
  } catch (err) {
    termsHtml.value = marked(terms_en);
    console.error(err);
  }
};

onMounted(async () => {
  fetchMarkdown(i18n.global.locale.value);
});

watch(
  () => i18n.global.locale.value,
  (newLocale: string) => {
    fetchMarkdown(newLocale);
  }
);
</script>

<template>
  <div class="terms-page">
    <div v-html="termsHtml"></div>
  </div>
</template>

<style scoped>
.terms-page {
  max-width: 70%;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
