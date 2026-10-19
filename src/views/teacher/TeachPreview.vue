<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SpaceLabel from '@/components/SpaceLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import {
  ACTIVITY_STEPS,
  TEACHER_SPACE_COLOURS,
  type TeacherSpace
} from '@/components/teacher/teacherSpaces';

// mock page of a module that does not exist yet (the router only lets preview modules through)
const route = useRoute();
const space = computed(() => route.params.space as TeacherSpace);
const module = computed(() => route.params.module as string);
const colours = computed(() => TEACHER_SPACE_COLOURS[space.value]);
const texts = computed(() => `journey.teach.spaces.${space.value}.modules.${module.value}`);
</script>
<template>
  <div class="teach-page">
    <div class="teach-content" :style="{ '--accent': colours.accent }">
      <router-link class="back-link" :to="{ name: 'teach-space', params: { space } }">
        ← {{ $t(`journey.teach.spaces.${space}.title`) }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t(`journey.teach.spaces.${space}.name`)" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.title`) }}</h1>
      <PreviewIntro :question="$t(`${texts}.question`)" :objective="$t(`${texts}.objective`)" />

      <!-- design an activity: the steps of the future flow, and where it could start from -->
      <template v-if="module === 'activity'">
        <ol class="steps mt-5">
          <li v-for="(step, index) in ACTIVITY_STEPS" :key="step" :data-testid="`activity-${step}`">
            <span class="step-number">{{ index + 1 }}</span>
            {{ $t(`${texts}.steps.${step}`) }}
          </li>
        </ol>

        <!-- one filled-in draft, so the team sees what the flow produces -->
        <article class="example-draft mt-5" data-testid="example-draft">
          <SpaceLabel :text="$t('journey.teach.exampleLabel')" tint="var(--lpi-yellow-lighter)" />
          <h2 class="draft-title mt-3">{{ $t(`${texts}.example.title`) }}</h2>
          <p class="draft-origin">{{ $t(`${texts}.example.startsFrom`) }}</p>
          <dl class="draft-fields mt-3">
            <dt>{{ $t(`${texts}.steps.intention`) }}</dt>
            <dd>{{ $t(`${texts}.example.intention`) }}</dd>
            <dt>{{ $t(`${texts}.steps.type`) }}</dt>
            <dd>{{ $t(`${texts}.example.type`) }}</dd>
            <dt>{{ $t(`${texts}.example.resourcesLabel`) }}</dt>
            <dd>
              <ul class="draft-resources">
                <li>{{ $t(`${texts}.example.resource1`) }}</li>
                <li>{{ $t(`${texts}.example.resource2`) }}</li>
              </ul>
            </dd>
            <dt>{{ $t(`${texts}.example.assessmentLabel`) }}</dt>
            <dd>{{ $t(`${texts}.example.assessment`) }}</dd>
          </dl>
        </article>

        <p class="notification is-info is-light mt-5">{{ $t(`${texts}.note`) }}</p>
      </template>
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

.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.75rem;
}

.steps li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--neutral-20);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  font-weight: 600;
}

/* arrow between two steps */
.steps li:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -1.35rem;
  color: var(--neutral-70);
}

.step-number {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.example-draft {
  padding: 1.25rem;
  border: 1px dashed var(--neutral-20);
  border-top: 4px solid var(--accent);
  border-radius: 8px;
}

.draft-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.draft-origin {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.draft-fields {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 0.6rem 1rem;
}

.draft-fields dt {
  font-weight: 600;
}

.draft-resources {
  list-style: disc;
  padding-left: 1.1rem;
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1.5rem 1rem 2rem;
  }

  .steps {
    flex-direction: column;
    gap: 0.5rem;
  }

  .steps li:not(:last-child)::after {
    content: none;
  }

  .draft-fields {
    grid-template-columns: 1fr;
  }
}
</style>
