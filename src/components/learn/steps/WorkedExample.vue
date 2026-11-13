<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ExampleStep } from '@/types/learn/modules';
import SdgTile from '@/components/SdgTile.vue';

defineProps<{ step: ExampleStep }>();
const emit = defineEmits<{ done: [] }>();

const choices = ref(new Set<string>());
const current = ref<string | null>(null);
const shouldShowLesson = computed(() => choices.value.size >= 2);

function handleChoose(id: string) {
  current.value = id;
  choices.value.add(id);
  emit('done');
}
</script>

<template>
  <div class="worked">
    <div class="flow">
      <div class="box-step challenge">
        <span class="kicker">{{ step.challengeLabel }}</span>
        <strong>{{ step.challenge }}</strong>
      </div>
      <span class="arrow" aria-hidden="true">→</span>
      <div class="box-step sdg">
        <SdgTile :goal="step.sdg.goal" size="56" rounded="8" compact />
        <span>{{ step.sdg.text }}</span>
      </div>
    </div>

    <p class="question">{{ step.question }}</p>
    <div class="options">
      <button
        v-for="opt in step.options"
        :key="opt.id"
        class="option"
        :class="{ active: current === opt.id, tried: choices.has(opt.id) }"
        :aria-pressed="current === opt.id"
        @click="handleChoose(opt.id)"
      >
        {{ opt.intention }}
        <Transition name="reveal">
          <span v-if="choices.has(opt.id)" class="result">
            → <strong>{{ opt.competence }}</strong>
            <span class="area">({{ opt.area }})</span>
          </span>
        </Transition>
      </button>
    </div>

    <p v-if="current && !shouldShowLesson" class="is-size-7 has-text-grey">
      {{ $t('learn.module.tryAnother') }}
    </p>
    <Transition name="reveal">
      <p v-if="shouldShowLesson" class="lesson" aria-live="polite">{{ step.lesson }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.box-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: var(--neutral-10);
}

.challenge {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
}

.box-step.sdg {
  /* takes the rest of the row so the arrow always points at it; wraps only on narrow screens */
  flex: 1 1 18rem;
  align-self: stretch;
}

.challenge {
  align-self: stretch;
  justify-content: center;
}

.sdg :deep(.sdg-tile) {
  flex: none;
  cursor: default;
}

.kicker {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary-dark);
}

.arrow {
  font-size: 1.4rem;
  color: var(--neutral-50);
}

.question {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  text-align: left;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-50);
  border-radius: 10px;
  background: var(--neutral-0);
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.option.active {
  border-color: var(--primary);
  background: var(--primary-lighter);
}

.result {
  color: var(--primary-dark);
}

.area {
  margin-left: 0.35rem;
  color: var(--neutral-70);
  font-size: 0.85rem;
}

.lesson {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-left: 4px solid var(--primary);
  border-radius: 6px;
  background: var(--neutral-10);
  font-weight: 600;
}

.reveal-enter-active {
  transition:
    opacity 0.35s,
    transform 0.35s;
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
