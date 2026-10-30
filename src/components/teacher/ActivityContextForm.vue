<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useActivityDesignStore } from '@/stores/activityDesign';

// the teaching context of an activity: four short answers, only the first is required. coming
// from Course Design, the course already fills the first two
const store = useActivityDesignStore();
const texts = 'journey.teach.activity.context';
</script>
<template>
  <form
    class="activity-context"
    data-testid="activity-context"
    @submit.prevent="store.suggestIdeas()"
  >
    <p v-if="store.fromCourse" class="from-course" data-testid="from-course">
      {{ $t(`${texts}.fromCourse`, { title: store.fromCourse }) }}
    </p>
    <div class="field">
      <label class="label" for="activity-subject">{{ $t(`${texts}.subject`) }}</label>
      <input
        id="activity-subject"
        v-model="store.context.subject"
        class="input"
        type="text"
        required
        :placeholder="$t(`${texts}.subjectPlaceholder`)"
        data-testid="activity-subject"
      />
    </div>
    <div class="field">
      <label class="label" for="activity-students">{{ $t(`${texts}.students`) }}</label>
      <input
        id="activity-students"
        v-model="store.context.students"
        class="input"
        type="text"
        :placeholder="$t(`${texts}.studentsPlaceholder`)"
        data-testid="activity-students"
      />
    </div>
    <div class="field">
      <label class="label" for="activity-time">{{ $t(`${texts}.time`) }}</label>
      <input
        id="activity-time"
        v-model="store.context.time"
        class="input"
        type="text"
        :placeholder="$t(`${texts}.timePlaceholder`)"
        data-testid="activity-time"
      />
    </div>
    <div class="field">
      <label class="label" for="activity-goal">
        {{ $t(`${texts}.goal`) }}
        <span class="optional">{{ $t('journey.teach.scratch.brief.optional') }}</span>
      </label>
      <textarea
        id="activity-goal"
        v-model="store.context.goal"
        class="textarea"
        rows="2"
        :placeholder="$t(`${texts}.goalPlaceholder`)"
        data-testid="activity-goal"
      />
    </div>
    <p class="notice">{{ $t(`${texts}.notice`) }}</p>
    <ButtonComponent color="primary" :disabled="!store.hasContext" data-testid="ideas-button">
      {{ $t(`${texts}.submit`) }}
    </ButtonComponent>
  </form>
</template>

<style scoped>
.activity-context {
  max-width: 40rem;
}

.from-course {
  margin-bottom: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--neutral-10);
  font-size: 0.9rem;
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
