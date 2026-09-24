<template>
  <div class="language-selector">
    <select v-model="$i18n.locale" @change="storeLanguage">
      <option
        class="nav-lang"
        v-for="locale in $i18n.availableLocales"
        :key="`locale-${locale}`"
        :value="locale"
      >
        {{ locale.toLocaleUpperCase() }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const storeLanguage = (e: Event) => {
  localStorage.setItem('language', (e.target as HTMLSelectElement).value);
};
</script>

<style scoped>
.language-selector {
  all: unset;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
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
