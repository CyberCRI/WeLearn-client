<script setup lang="ts">
import FrFlag from './FrFlag.vue';
import EnFlag from './EnFlag.vue';
defineProps<{ lang: string }>();
</script>
<template>
  <div class="flags">
    <FrFlag v-if="lang === 'fr'" />
    <EnFlag v-if="lang === 'en'" />
  </div>
</template>
<style scoped>
.flags {
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
}
</style>
