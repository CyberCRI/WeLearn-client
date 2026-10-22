<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SpaceLabel from '@/components/SpaceLabel.vue';
import AiLabel from '@/components/AiLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import {
  ACTIVITY_PARTS,
  TEACHER_SPACE_COLOURS,
  type TeacherSpace
} from '@/components/teacher/teacherSpaces';

// mock page of a module that does not exist yet (the router only lets preview modules through)
const route = useRoute();
const space = computed(() => route.params.space as TeacherSpace);
const module = computed(() => route.params.module as string);
const colours = computed(() => TEACHER_SPACE_COLOURS[space.value]);
const texts = computed(() => `journey.teach.spaces.${space.value}.modules.${module.value}`);
const isActivity = computed(() => module.value === 'activity');

// the invented example, shown part by part (keys under the activity texts)
const EXAMPLE_FIELDS: Record<
  (typeof ACTIVITY_PARTS)[number],
  { label: string; values: string[] }[]
> = {
  context: [
    { label: 'steps.context', values: ['example.context'] },
    { label: 'steps.connection', values: ['example.connection'] }
  ],
  intention: [{ label: 'steps.intention', values: ['example.intention'] }],
  develop: [
    { label: 'steps.type', values: ['example.type'] },
    { label: 'example.resourcesLabel', values: ['example.resource1', 'example.resource2'] },
    { label: 'example.assessmentLabel', values: ['example.assessment'] }
  ]
};
</script>
<template>
  <div class="teach-page">
    <div class="teach-content" :style="{ '--tint': colours.tint }">
      <router-link class="back-link" :to="{ name: 'teach-space', params: { space } }">
        ← {{ $t(`journey.teach.spaces.${space}.pageTitle`) }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t(`journey.teach.spaces.${space}.name`)" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.title`) }}</h1>

      <!-- design an activity: three parts, each with the matching piece of one invented example -->
      <template v-if="isActivity">
        <p class="subtitle is-6 mt-2 intro">{{ $t(`${texts}.intro`) }}</p>
        <PreviewIntro />

        <div class="example-head mt-5">
          <SpaceLabel :text="$t('journey.teach.exampleLabel')" tint="var(--lpi-yellow-lighter)" />
          <h2 class="example-title mt-2">{{ $t(`${texts}.example.title`) }}</h2>
          <p class="example-origin">{{ $t(`${texts}.example.startsFrom`) }}</p>
        </div>

        <ol class="parts mt-4">
          <li
            v-for="(part, index) in ACTIVITY_PARTS"
            :key="part"
            class="part"
            :data-testid="`activity-${part}`"
          >
            <span class="part-number" aria-hidden="true">{{ index + 1 }}</span>
            <div class="part-body">
              <h3 class="part-title">{{ $t(`${texts}.parts.${part}.title`) }}</h3>
              <p class="part-text">{{ $t(`${texts}.parts.${part}.text`) }}</p>
              <p v-if="part === 'develop'" class="draft-label mt-3">
                {{ $t(`${texts}.example.draftLabel`) }}
                <AiLabel :text="$t('journey.teach.ai.draft')" />
              </p>
              <dl class="part-example mt-3" :data-testid="`example-${part}`">
                <template v-for="field in EXAMPLE_FIELDS[part]" :key="field.label">
                  <dt>{{ $t(`${texts}.${field.label}`) }}</dt>
                  <dd v-if="field.values.length === 1">{{ $t(`${texts}.${field.values[0]}`) }}</dd>
                  <dd v-else>
                    <ul class="example-list">
                      <li v-for="value in field.values" :key="value">
                        {{ $t(`${texts}.${value}`) }}
                      </li>
                    </ul>
                  </dd>
                </template>
              </dl>
            </div>
          </li>
        </ol>

        <p class="later-note mt-5">{{ $t(`${texts}.note`) }}</p>
      </template>
      <PreviewIntro
        v-else
        :question="$t(`${texts}.question`)"
        :objective="$t(`${texts}.objective`)"
      />
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

.intro {
  max-width: 44rem;
}

.example-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.example-origin {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.parts {
  max-width: 48rem;
  list-style: none;
}

/* parts separated by a thin line, no boxes */
.part {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--neutral-20);
}

.part-number {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--tint);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--neutral-90);
}

.part-body {
  flex: 1;
  min-width: 0;
}

.part-title {
  font-size: 1.05rem;
  font-weight: 600;
}

.part-text {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.draft-label {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
}

/* the example piece: a quiet indented block */
.part-example {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 0.5rem 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.95rem;
}

.part-example dt {
  font-weight: 600;
  color: var(--neutral-80);
}

.example-list {
  list-style: disc;
  padding-left: 1.1rem;
}

.later-note {
  max-width: 48rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1.5rem 1rem 2rem;
  }

  .part {
    gap: 0.75rem;
  }

  .part-example {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .part-example dd + dt {
    margin-top: 0.5rem;
  }
}
</style>
