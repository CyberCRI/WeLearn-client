<template>
  <div class="language-selector">
    <select v-model="$i18n.locale" @change="storeLanguage">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
        {{ locale.toLocaleUpperCase() }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { setAnalyticsProperties, track } from '@/utils/analytics';

const storeLanguage = (e: Event) => {
  const lang = (e.target as HTMLSelectElement).value;
  track('Language Changed', { language: lang });
  localStorage.setItem('language', lang);
  setAnalyticsProperties({ language: lang });
};
</script>

<style scoped>
/* same spacing as BaseNavItem (.link-wrapper + .router-link) at every width, so it lines up with the nav icons */
.language-selector {
  all: unset;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem 0.25rem;
}

select {
  margin: 0 0.5rem;
}

@media (max-width: 1450px) {
  .language-selector {
    padding-inline: 0.25rem;
  }
}

@media (max-width: 750px) {
  .language-selector select {
    padding-inline: 0.375rem 0.5rem;
  }
}

@media (max-width: 640px) {
  .language-selector {
    padding-inline: 0;
  }
  .language-selector select {
    margin: 0;
    padding-inline: 0.125rem 0.25rem;
  }
}

select,
::picker(select) {
  appearance: base-select;
}

select {
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  transition: 0.4s;
  font-size: 0.9rem;
  cursor: pointer;
}

select:hover {
  background: var(--neutral-10);
}

select::picker-icon {
  color: var(--neutral-50);
  transition: 0.4s rotate;
}

select:open::picker-icon {
  rotate: 180deg;
}
::picker(select) {
  /* open towards the left: the selector sits at the right edge of the screen */
  position-area: bottom span-left;
  border-radius: 8px;
  border: 1px solid #cccccc;
}

option {
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  border-bottom: 1px solid var(--neutral-10);
  padding: 10px;
  transition: 0.4s;
}

option:hover,
option:focus {
  background: var(--primary-light);
}
</style>
