<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SpaceLabel from '@/components/SpaceLabel.vue';
import ActivityContextForm from '@/components/teacher/ActivityContextForm.vue';
import ActivityIdeas from '@/components/teacher/ActivityIdeas.vue';
import ActivityResult from '@/components/teacher/ActivityResult.vue';
import { useActivityDesignStore } from '@/stores/activityDesign';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';

// "design a learning activity": the context (or the course from Course Design), WeLearn's ideas,
// then the chosen one as a one-page activity with the WeLearn resources it really uses
const store = useActivityDesignStore();
const design = useCourseDesignStore();
const colours = TEACHER_SPACE_COLOURS.design;
const texts = 'journey.teach.activity';

// a course confirmed in Course Design becomes the context, so nothing is typed twice; a practice
// adapted from TEACH brings its subject and students
const route = useRoute();
onMounted(() => {
  if (design.status === 'ready' && design.isConfirmed) store.useCourse(design.confirmedCourse);
  const { subject, students } = route.query;
  if (typeof subject === 'string' && !store.context.subject.trim()) {
    store.context.subject = subject;
    if (typeof students === 'string') store.context.students = students;
  }
});

const isAskingContext = computed(
  () => ['idle', 'unavailable', 'error'].includes(store.ideasStatus) && !store.ideas.length
);
const contextLine = computed(() =>
  [store.context.subject, store.context.students, store.context.time]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' · ')
);
const handleChangeContext = () => store.$reset();

const IDEAS_STEPS = ['planning', 'searching', 'thinking'];
const ideasStep = computed(() => IDEAS_STEPS.indexOf(store.ideasStatus));
</script>
<template>
  <div class="activity-design">
    <div class="activity-design-content">
      <router-link class="back-link" :to="{ name: 'teach-space', params: { space: 'design' } }">
        ← {{ $t('journey.teach.spaces.design.pageTitle') }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t('journey.teach.spaces.design.name')" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">
        {{ $t('journey.teach.spaces.design.modules.activity.title') }}
      </h1>
      <p class="intro">{{ $t(`${texts}.intro`) }}</p>

      <template v-if="isAskingContext">
        <div
          v-if="store.ideasStatus === 'unavailable' || store.ideasStatus === 'error'"
          class="problem"
          role="alert"
          :data-testid="`ideas-${store.ideasStatus}`"
        >
          {{ $t(`${texts}.ideas.${store.ideasStatus}`) }}
        </div>
        <ActivityContextForm />
      </template>

      <template v-else>
        <p class="context-line" data-testid="context-line">
          <span class="muted">{{ $t(`${texts}.contextLabel`) }}</span>
          {{ contextLine }}
          <button type="button" class="button is-small is-text" @click="handleChangeContext">
            {{ $t('journey.teach.courseStart.change') }}
          </button>
        </p>

        <!-- only the real steps: search questions, the search, the check of what was found -->
        <ol v-if="ideasStep !== -1" class="waiting" aria-live="polite" data-testid="ideas-waiting">
          <li
            v-for="(step, index) in IDEAS_STEPS"
            :key="step"
            :class="
              index === ideasStep ? 'is-active' : index < ideasStep ? 'is-done' : 'is-pending'
            "
          >
            {{
              step === 'searching' && ideasStep > index
                ? $t(`${texts}.ideas.found`, { count: store.candidates.length })
                : $t(`${texts}.ideas.${step}`)
            }}
          </li>
        </ol>
        <div
          v-else-if="store.ideasStatus === 'unavailable' || store.ideasStatus === 'error'"
          class="problem"
          role="alert"
        >
          {{ $t(`${texts}.ideas.${store.ideasStatus}`) }}
          <button type="button" class="button is-small" @click="store.suggestIdeas(true)">
            {{ $t('journey.teach.adapt.connections.retry') }}
          </button>
        </div>
        <ActivityResult v-else-if="store.chosen" />
        <ActivityIdeas v-else />
      </template>
    </div>
  </div>
</template>

<style scoped>
.activity-design {
  height: 100%;
  overflow-y: auto;
}

.activity-design-content {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.activity-design-content > :not(.back-link):not(div.mt-5):not(h1) {
  max-width: 48rem;
}

.back-link {
  font-size: 0.9rem;
}

.intro {
  margin: -0.75rem 0 1.5rem;
  color: var(--neutral-80);
}

.context-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}

.muted {
  color: var(--neutral-70);
}

.waiting {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
}

.waiting li {
  position: relative;
  padding-left: 1.5rem;
}

.waiting li::before {
  position: absolute;
  left: 0;
  content: '○';
  color: var(--neutral-70);
}

.waiting li.is-done::before {
  content: '✓';
  color: var(--primary);
}

.waiting li.is-active {
  font-weight: 600;
}

.waiting li.is-active::before {
  content: '●';
  color: var(--lpi-violet);
}

.waiting li.is-pending {
  color: var(--neutral-70);
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}
</style>
