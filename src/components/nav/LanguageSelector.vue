<template>
  <div class="language-selector">
    <select v-model="$i18n.locale">
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

<script setup lang="ts"></script>

<style scoped>
.language-selector {
  all: unset;
  flex-direction: row;
  justify-self: flex-end;
  margin-top: auto;
  font-size: 0.75rem;
  margin-left: auto;
  margin-right: 1rem;
}

select,
::picker(select) {
  appearance: base-select;
}

select {
  border: 2px solid var(--neutral-0);

  padding: 10px;
  transition: 0.4s;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
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
