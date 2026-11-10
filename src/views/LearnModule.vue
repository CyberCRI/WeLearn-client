<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import i18n from '@/localisation/i18n';
import ProgressBar from '@/components/learn/ProgressBar.vue';
import TrailNavigation from '@/components/learn/TrailNavigation.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ConfidenceCheck from '@/components/learn/ConfidenceCheck.vue';
import ConceptExplorer from '@/components/learn/steps/ConceptExplorer.vue';
import DimensionsDiagram from '@/components/learn/steps/DimensionsDiagram.vue';
import SortActivity from '@/components/learn/steps/SortActivity.vue';
import TimelineStep from '@/components/learn/steps/TimelineStep.vue';
import SdgMap from '@/components/learn/steps/SdgMap.vue';
import GreenCompMap from '@/components/learn/steps/GreenCompMap.vue';
import WorkedExample from '@/components/learn/steps/WorkedExample.vue';
import MythCheck from '@/components/learn/steps/MythCheck.vue';
import { getModuleCard, isModuleId, nextModule, useModuleContent } from '@/learn/modules';
import { getProgress, saveProgress, type ModuleProgress } from '@/learn/progress';
import { SOURCES, sourceUrl, type SourceId } from '@/learn/sources';
import type { Cite, Step } from '@/types/learn/modules';
import { calculateProgress } from '@/utils/progress';
import { track } from '@/utils/analytics';

// runs the typed-step modules (foundations, frameworks): intro + confidence, steps, wrap-up
const STEP_COMPONENTS = {
  concepts: ConceptExplorer,
  dimensions: DimensionsDiagram,
  sort: SortActivity,
  timeline: TimelineStep,
  sdgs: SdgMap,
  greencomp: GreenCompMap,
  example: WorkedExample,
  myth: MythCheck
} as const;

const route = useRoute();
const router = useRouter();
const { t, locale } = i18n.global;

const moduleId = computed(() => (isModuleId(route.params.id) ? route.params.id : null));
const content = useModuleContent(() => moduleId.value ?? 'foundations');

// the next module on the Learn page, with its title in the current language
const next = computed(() => {
  const mod = moduleId.value && nextModule(moduleId.value);
  if (!mod) return null;
  return { to: mod.to, title: getModuleCard(mod.id, locale.value).title };
});

// -1 = intro, 0..n-1 = steps, n = wrap-up. steps report "done" once their interaction is completed
const pos = ref(-1);
const doneSteps = ref<Record<number, boolean>>({});
const steps = computed(() => content.value.steps);
const step = computed<Step | undefined>(() => steps.value[pos.value]);
const isWrapUp = computed(() => pos.value === steps.value.length);

const confidenceBefore = ref<number | null>(null);
const confidenceAfter = ref<number | null>(null);

const labels = computed(() => [
  t('learn.module.introLabel'),
  ...steps.value.map((s) => s.short),
  t('learn.module.wrapUpLabel')
]);

// every source cited in the module, for the list at the end
const allSources = computed(() => {
  const ids = new Set<SourceId>();
  const collect = (cites?: Cite[]) => cites?.forEach((c) => ids.add(c.src));
  for (const s of steps.value) {
    collect(s.cite);
    if (s.type === 'concepts') s.items.forEach((i) => collect(i.cite));
    if (s.type === 'timeline') [...s.events.map((e) => e.cite), s.closingCite].forEach(collect);
    if (s.type === 'sdgs') [s.psCite, s.focus.cite].forEach(collect);
    if (s.type === 'greencomp') collect(s.noteCite);
    if (s.type === 'myth') s.statements.forEach((m) => collect(m.cite));
  }
  return [...ids];
});

watch(
  moduleId,
  (id) => {
    pos.value = -1;
    doneSteps.value = {};
    confidenceBefore.value = id ? (getProgress(id).confidenceBefore ?? null) : null;
    confidenceAfter.value = null;
  },
  { immediate: true }
);

function save(patch: ModuleProgress) {
  if (moduleId.value) saveProgress(moduleId.value, patch);
}

function handleNext() {
  const id = moduleId.value;
  if (!id) return;
  if (pos.value === -1) {
    track('Learn Module Started', { module: id });
    if (confidenceBefore.value) {
      save({ confidenceBefore: confidenceBefore.value });
      track('Learn Confidence Rated', {
        module: id,
        moment: 'before',
        value: confidenceBefore.value
      });
    }
  }
  pos.value++;
  if (isWrapUp.value) {
    save({ completedAt: new Date().toISOString() });
    track('Learn Module Completed', { module: id });
  }
  document.querySelector('.learn-module')?.scrollIntoView({ block: 'start' });
}

watch(confidenceAfter, (value) => {
  if (!value || !moduleId.value) return;
  save({ confidenceAfter: value });
  track('Learn Confidence Rated', { module: moduleId.value, moment: 'after', value });
});
</script>

<template>
  <div class="learn-module py-5 px-4">
    <div v-if="!moduleId" class="box">{{ $t('learn.module.notFound') }}</div>

    <template v-else>
      <ProgressBar
        :currentStep="pos + 1"
        :labels="labels"
        :progress="calculateProgress(pos + 1, labels.length)"
      />

      <header class="module-header">
        <p class="kicker">
          <RouterLink to="/learn" class="kicker-link">← {{ $t('learn.title') }}</RouterLink>
          · {{ content.duration }}
        </p>
        <h1 class="title is-4 mb-1">
          {{ pos === -1 || isWrapUp ? content.title : step?.title }}
        </h1>
        <p v-if="step?.instruction" class="instruction">{{ step.instruction }}</p>
      </header>

      <Transition name="screen" mode="out-in">
        <!-- intro -->
        <section v-if="pos === -1" key="intro" class="screen">
          <p class="subtitle is-6 mb-3">{{ content.subtitle }}</p>
          <p class="hook">{{ content.hook }}</p>
          <p class="goal">{{ content.goal }}</p>
          <ConfidenceCheck
            v-model="confidenceBefore"
            :question="content.confidenceBefore"
            name="before"
          />
        </section>

        <!-- wrap-up -->
        <section v-else-if="isWrapUp" key="wrap" class="screen">
          <h2 class="title is-5">{{ $t('learn.module.takeawaysTitle') }}</h2>
          <ul class="takeaways">
            <li
              v-for="(tk, i) in content.takeaways"
              :key="i"
              :style="{ animationDelay: `${i * 0.12}s` }"
            >
              {{ tk }}
            </li>
          </ul>

          <ConfidenceCheck
            v-model="confidenceAfter"
            :question="content.confidenceAfter"
            name="after"
          />
          <p v-if="confidenceAfter && confidenceBefore" class="is-size-7 has-text-grey mt-2">
            {{
              $t('learn.module.confidenceDelta', {
                before: confidenceBefore,
                after: confidenceAfter
              })
            }}
          </p>

          <details class="sources">
            <summary>{{ $t('learn.module.sourcesTitle', { n: allSources.length }) }}</summary>
            <ul>
              <li v-for="id in allSources" :key="id">
                <a
                  :href="sourceUrl(id, locale)"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="track('Source Opened', { origin: 'learn' })"
                  >{{ SOURCES[id].full }}</a
                >
              </li>
            </ul>
          </details>

          <div class="wrap-up-actions">
            <ButtonComponent color="primary" isDiscreet @click="router.push('/learn')">
              ← {{ $t('learn.module.backToLearn') }}
            </ButtonComponent>
            <ButtonComponent v-if="next" color="primary" @click="router.push(next.to)">
              {{ $t('learn.module.nextModule', { title: next.title }) }} →
            </ButtonComponent>
          </div>
        </section>

        <!-- steps -->
        <section v-else-if="step" :key="step.id" class="screen">
          <component
            :is="STEP_COMPONENTS[step.type] as Component"
            :step="step"
            :moduleId="moduleId"
            @done="doneSteps[pos] = true"
          />
        </section>
      </Transition>

      <TrailNavigation
        v-if="!isWrapUp"
        :showBack="pos > -1"
        :canNext="pos === -1 || !!doneSteps[pos]"
        :nextLabel="pos === -1 ? 'learn.module.start' : 'next'"
        hint="learn.module.nextHint"
        @back="pos--"
        @next="handleNext"
      />
    </template>
  </div>
</template>

<style scoped>
.learn-module {
  max-width: 60rem;
  margin: 0 auto;
}

.module-header {
  margin: 1rem 0 1.25rem;
}

.kicker {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary-dark);
  margin-bottom: 0.25rem;
}

.kicker-link {
  color: inherit;
}

.kicker-link:hover,
.kicker-link:focus-visible {
  text-decoration: underline;
}

.instruction {
  color: var(--neutral-70);
}

.hook,
.goal {
  line-height: 1.6;
}

.hook {
  margin-bottom: 0.75rem;
}

.goal {
  margin-bottom: 1.5rem;
}

.takeaways {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.takeaways li {
  padding: 0.6rem 0.9rem 0.6rem 2.2rem;
  border-radius: 8px;
  background: var(--primary-lighter);
  position: relative;
  opacity: 0;
  animation: rise 0.35s ease forwards;
}

.takeaways li::before {
  content: '✓';
  position: absolute;
  left: 0.85rem;
  color: var(--primary-dark);
  font-weight: 700;
}

.wrap-up-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.sources {
  margin-top: 1.5rem;
}

.sources summary {
  cursor: pointer;
  font-weight: 600;
}

.sources ul {
  margin: 0.5rem 0 0.5rem 1.25rem;
  list-style: disc;
  font-size: 0.85rem;
}

.screen-enter-active,
.screen-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.screen-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.screen-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .takeaways li {
    animation: none;
    opacity: 1;
  }
  .screen-enter-active,
  .screen-leave-active {
    transition: none;
  }
}
</style>
