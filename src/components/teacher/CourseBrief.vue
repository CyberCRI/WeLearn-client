<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';

// creating a course from scratch starts with a short brief: the course idea (the only required
// answer), then discipline and level, format and goals if the teacher has them. no topics or
// objectives are asked for: WeLearn proposes them
const store = useCourseDesignStore();
const texts = 'journey.teach.scratch.brief';
const canDraft = computed(() => store.brief.idea.trim().length > 0);
</script>
<template>
  <form class="course-brief" data-testid="course-brief" @submit.prevent="store.draftProposal()">
    <h2 class="brief-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="brief-intro">{{ $t(`${texts}.intro`) }}</p>

    <div class="field">
      <label class="label" for="brief-idea">{{ $t(`${texts}.idea`) }}</label>
      <textarea
        id="brief-idea"
        v-model="store.brief.idea"
        class="textarea"
        rows="3"
        required
        :placeholder="$t(`${texts}.ideaPlaceholder`)"
        data-testid="brief-idea"
      />
    </div>
    <div class="field">
      <label class="label" for="brief-discipline">{{ $t(`${texts}.disciplineLevel`) }}</label>
      <input
        id="brief-discipline"
        v-model="store.brief.disciplineLevel"
        class="input"
        type="text"
        :placeholder="$t(`${texts}.disciplineLevelPlaceholder`)"
        data-testid="brief-discipline"
      />
    </div>
    <div class="field">
      <label class="label" for="brief-format">
        {{ $t(`${texts}.format`) }}
        <span class="optional">{{ $t(`${texts}.optional`) }}</span>
      </label>
      <input
        id="brief-format"
        v-model="store.brief.format"
        class="input"
        type="text"
        :placeholder="$t(`${texts}.formatPlaceholder`)"
        data-testid="brief-format"
      />
    </div>
    <div class="field">
      <label class="label" for="brief-goals">
        {{ $t(`${texts}.goals`) }}
        <span class="optional">{{ $t(`${texts}.optional`) }}</span>
      </label>
      <textarea
        id="brief-goals"
        v-model="store.brief.goals"
        class="textarea"
        rows="2"
        :placeholder="$t(`${texts}.goalsPlaceholder`)"
        data-testid="brief-goals"
      />
    </div>

    <p class="notice">{{ $t(`${texts}.notice`) }}</p>
    <ButtonComponent color="primary" :disabled="!canDraft" data-testid="draft-button">
      {{
        store.status === 'error' || store.status === 'unavailable'
          ? $t(`${texts}.retry`)
          : $t(`${texts}.submit`)
      }}
    </ButtonComponent>
  </form>
</template>

<style scoped>
.course-brief {
  max-width: 40rem;
}

.brief-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.brief-intro {
  margin: 0.25rem 0 1.25rem;
  color: var(--neutral-80);
}

.optional {
  margin-left: 0.25rem;
  font-weight: 400;
  color: var(--neutral-70);
}

.notice {
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}
</style>
