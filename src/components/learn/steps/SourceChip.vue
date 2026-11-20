<script setup lang="ts">
import i18n from '@/localisation/i18n';
import { SOURCES, sourceUrl } from '@/learn/sources';
import type { Cite } from '@/types/learn/modules';
import { track } from '@/utils/analytics';

// inline citations: "UN, 2015 · preamble"
defineProps<{ cites?: Cite[] }>();
const { locale } = i18n.global;
</script>

<template>
  <span v-if="cites?.length" class="cites">
    <a
      v-for="(c, i) in cites"
      :key="i"
      class="chip"
      :href="sourceUrl(c.src, locale)"
      target="_blank"
      rel="noopener noreferrer"
      :title="SOURCES[c.src].full"
      @click="track('Source Opened', { origin: 'learn' })"
    >
      {{ SOURCES[c.src].short }}<template v-if="c.loc"> · {{ c.loc }}</template>
    </a>
  </span>
</template>

<style scoped>
.cites {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  vertical-align: middle;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.05rem 0.45rem;
  border-radius: 999px;
  background: var(--neutral-10);
  border: 1px solid var(--neutral-20);
  color: var(--neutral-70);
  font-size: 0.72rem;
  white-space: nowrap;
}

.chip:hover {
  border-color: var(--primary);
  color: var(--primary-dark);
}
</style>
