<script setup lang="ts">
import { computed, ref } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import FeatureRow from '@/components/teacher/FeatureRow.vue';
import BookIcon from '@/components/icons/BookIcon.vue';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';
import { TEACHING_PRACTICES, searchPractices } from '@/utils/teachingPractices';

// TEACH: real teaching practices shared by teachers, a readable list with one search, and a
// discreet way to share one's own. empty until approved contributions exist
const colours = TEACHER_SPACE_COLOURS.teach;
const texts = 'journey.teach.practices';
const query = ref('');
const practices = computed(() => searchPractices(TEACHING_PRACTICES, query.value));
</script>
<template>
  <div class="teach-page">
    <div class="teach-content" :style="{ '--accent': colours.accent }">
      <router-link class="back-link" :to="{ name: 'teach' }">
        ← {{ $t('journey.teach.allSpaces') }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t('journey.teach.spaces.teach.name')" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.title`) }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t(`${texts}.intro`) }}</p>

      <template v-if="TEACHING_PRACTICES.length">
        <input
          v-model="query"
          class="input search"
          type="search"
          :placeholder="$t(`${texts}.search`)"
          :aria-label="$t(`${texts}.search`)"
          data-testid="practice-search"
        />
        <ul class="feature-list" data-testid="practice-list">
          <li v-for="practice in practices" :key="practice.id" data-testid="practice">
            <FeatureRow
              :to="{ name: 'teach-practice', params: { id: practice.id } }"
              :icon="BookIcon"
              :tint="colours.tint"
              :title="`${practice.discipline} · ${practice.course}`"
              :description="`${practice.level} · ${practice.topic}`"
            />
          </li>
        </ul>
        <p v-if="!practices.length" class="muted mt-4" data-testid="no-match">
          {{ $t(`${texts}.noMatch`) }}
        </p>
      </template>

      <!-- no approved practice yet: said plainly, never filled with examples -->
      <div v-else class="empty" data-testid="practices-empty">
        <p class="empty-title">{{ $t(`${texts}.emptyTitle`) }}</p>
        <p class="muted">{{ $t(`${texts}.emptyText`) }}</p>
      </div>

      <p class="share-line">
        <router-link :to="{ name: 'teach-share' }" data-testid="share-practice">
          {{ $t(`${texts}.share`) }} →
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.teach-page {
  height: 100%;
  overflow-y: auto;
}

.teach-content {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.search {
  max-width: 32rem;
  margin-top: 1.5rem;
}

.feature-list {
  margin-top: 1.5rem;
  border-top: 1px solid var(--neutral-20);
  list-style: none;
}

.feature-list li {
  border-bottom: 1px solid var(--neutral-20);
}

.empty {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.empty-title {
  font-weight: 600;
}

.muted {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.share-line {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>
