<script setup lang="ts">
import { ref } from 'vue';
import type { MythStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';

const props = defineProps<{ step: MythStep }>();
const emit = defineEmits<{ done: [] }>();

const answers = ref<Record<number, boolean>>({});

function handleAnswer(i: number, value: boolean) {
  answers.value[i] = value;
  if (Object.keys(answers.value).length === props.step.statements.length) emit('done');
}
</script>

<template>
  <ul class="myths">
    <li v-for="(s, i) in step.statements" :key="i" class="myth">
      <p class="statement">“{{ s.text }}”</p>
      <div class="buttons">
        <button
          v-for="value in [true, false]"
          :key="String(value)"
          class="button is-small"
          :class="{
            'is-primary': answers[i] === value && value === s.answer,
            'is-warning': answers[i] === value && value !== s.answer
          }"
          :aria-pressed="answers[i] === value"
          @click="handleAnswer(i, value)"
        >
          {{ value ? step.trueLabel : step.falseLabel }}
        </button>
      </div>
      <Transition name="reveal">
        <p
          v-if="i in answers"
          class="feedback"
          :class="{ right: answers[i] === s.answer }"
          aria-live="polite"
        >
          {{ answers[i] === s.answer ? '✓' : '✗' }} {{ s.feedback }}
          <SourceChip :cites="s.cite" />
        </p>
      </Transition>
    </li>
  </ul>
</template>

<style scoped>
.myths {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.myth {
  padding: 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 10px;
  background: var(--neutral-0);
}

.statement {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feedback {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background: var(--warning-10);
}

.feedback.right {
  background: var(--primary-lighter);
}

.reveal-enter-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
