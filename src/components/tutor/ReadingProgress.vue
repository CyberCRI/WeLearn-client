<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

// while WeLearn reads the syllabus: only real operations, sending the syllabus (its real
// progress) then WeLearn reading it (seconds elapsed, never a made-up percentage).
// adapted from the reading view of the "design your course" prototype
const props = defineProps<{
  fileName: string;
  phase: 'sending' | 'reading';
  uploadProgress: number;
  startedAt: number | null;
}>();

const emit = defineEmits<{ cancel: [] }>();

const isSent = computed(() => props.phase === 'reading');

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;
watch(
  () => props.phase,
  (phase) => {
    clearInterval(timer);
    if (phase === 'reading') timer = setInterval(() => (now.value = Date.now()), 1000);
  },
  { immediate: true }
);
onBeforeUnmount(() => clearInterval(timer));
const elapsed = computed(() =>
  props.startedAt ? Math.max(0, Math.round((now.value - props.startedAt) / 1000)) : 0
);
</script>

<template>
  <section class="processing" aria-live="polite" data-testid="reading">
    <div class="processing-head">
      <p class="processing-file">{{ fileName }}</p>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="cancel-reading"
        @click="emit('cancel')"
      >
        {{ $t('tutor.reading.cancel') }}
      </button>
    </div>
    <ol class="processing-steps">
      <li :class="isSent ? 'is-done' : 'is-active'" data-testid="step-sending">
        <span class="step-dot" aria-hidden="true">{{ isSent ? '✓' : '1' }}</span>
        <div class="step-body">
          <p class="step-title">
            {{ isSent ? $t('tutor.reading.sent') : $t('tutor.reading.sending') }}
          </p>
          <div
            v-if="!isSent"
            class="bar"
            role="progressbar"
            :aria-valuenow="uploadProgress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span class="bar-fill" :style="{ width: `${uploadProgress}%` }" />
          </div>
        </div>
      </li>
      <li :class="isSent ? 'is-active' : 'is-pending'" data-testid="step-reading">
        <span class="step-dot" aria-hidden="true">2</span>
        <div class="step-body">
          <p class="step-title">
            {{ $t('tutor.reading.reading') }}
            <span v-if="isSent" class="elapsed" data-testid="elapsed">
              {{ $t('tutor.reading.elapsed', { seconds: elapsed }) }}
            </span>
          </p>
          <div v-if="isSent" class="bar is-indeterminate" role="progressbar">
            <span class="bar-fill" />
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.processing {
  max-width: 36rem;
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.processing-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.processing-file {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  list-style: none;
}

.processing-steps li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.step-dot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid var(--neutral-20);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neutral-70);
}

.is-active .step-dot {
  border-color: var(--primary);
  color: var(--primary-dark);
  animation: pulse 1.6s ease-in-out infinite;
}

.is-done .step-dot {
  border-color: var(--primary-dark);
  background: var(--primary-dark);
  color: var(--neutral-0);
}

.step-body {
  flex: 1;
  min-width: 0;
  padding-top: 0.2rem;
}

.step-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.is-pending .step-title {
  color: var(--neutral-70);
}

.is-active .step-title,
.is-done .step-title {
  font-weight: 600;
}

.elapsed {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--neutral-70);
}

.bar {
  position: relative;
  height: 0.35rem;
  margin-top: 0.5rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--neutral-10);
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
  transition: width 0.2s;
}

/* while WeLearn reads, nothing is measurable: a quiet moving segment, never a percentage */
.bar.is-indeterminate .bar-fill {
  position: absolute;
  width: 30%;
  animation: slide 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 4px var(--primary-lighter);
  }
}

@keyframes slide {
  from {
    left: -30%;
  }
  to {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-active .step-dot,
  .bar.is-indeterminate .bar-fill,
  .bar-fill {
    animation: none;
    transition: none;
  }
}
</style>
