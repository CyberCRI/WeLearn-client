<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import LearnModuleCard from '@/components/learn/LearnModuleCard.vue';
import { MODULES, getModuleCard, isModuleId } from '@/learn/modules';
import { getProgress } from '@/learn/progress';

const cards = computed(() =>
  MODULES.map((m) => ({
    ...m,
    ...getModuleCard(m.id, i18n.global.locale.value),
    // ponytail: no completion state for the discipline module until progress moves to the API
    isDone: isModuleId(m.id) && !!getProgress(m.id).completedAt
  }))
);
</script>

<template>
  <div class="learn-page py-5 px-4">
    <h1 class="title is-3 is-size-4-mobile">{{ $t('learn.title') }}</h1>
    <p class="subtitle is-6">{{ $t('learn.intro') }}</p>

    <div class="cards">
      <LearnModuleCard
        v-for="(card, i) in cards"
        :key="card.id"
        :index="i + 1"
        :to="card.to"
        :title="card.title"
        :subtitle="card.subtitle"
        :duration="card.duration"
        :isDone="card.isDone"
      />
    </div>
  </div>
</template>

<style scoped>
.learn-page {
  max-width: 60rem;
  margin: 0 auto;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
