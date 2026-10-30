<script setup lang="ts">
import { ref, watch } from 'vue';
import { useLearnerStore } from '@/stores/learner';
import { sourceLink } from '@/utils/connections';

// the learning thread, visible and in the learner's hands: the topic (editable), the confirmed
// purpose, the sources and notes they chose to keep, and "start over". it only lives in this tab
const store = useLearnerStore();
const topic = ref(store.thread.topic);
watch(
  () => store.thread.topic,
  (value) => (topic.value = value)
);
</script>
<template>
  <aside class="thread" data-testid="learning-thread">
    <p class="thread-title">{{ $t('student.thread.title') }}</p>
    <label class="field-label" for="thread-topic">{{ $t('student.thread.topic') }}</label>
    <input
      id="thread-topic"
      v-model="topic"
      class="input is-small"
      type="text"
      :placeholder="$t('student.thread.topicPlaceholder')"
      data-testid="thread-topic"
      @change="store.setTopic(topic)"
    />
    <p v-if="store.thread.purpose" class="purpose" data-testid="thread-purpose">
      <strong>{{ $t('student.thread.purpose') }} :</strong> {{ store.thread.purpose }}
    </p>

    <template v-if="store.thread.resources.length">
      <p class="field-label">{{ $t('student.thread.sources') }}</p>
      <ul class="items">
        <li v-for="doc in store.thread.resources" :key="doc.payload.document_id">
          <a :href="sourceLink(doc)" target="_blank" rel="noopener">{{
            doc.payload.document_title
          }}</a>
          <button
            type="button"
            class="delete is-small"
            :aria-label="$t('student.thread.removeNote')"
            @click="store.toggleResource(doc)"
          />
        </li>
      </ul>
    </template>

    <template v-if="store.thread.notes.length">
      <p class="field-label">{{ $t('student.thread.notes') }}</p>
      <ul class="items" data-testid="thread-notes">
        <li v-for="(note, index) in store.thread.notes" :key="index">
          <span>{{ note.text }}</span>
          <button
            type="button"
            class="delete is-small"
            :aria-label="$t('student.thread.removeNote')"
            @click="store.removeNote(index)"
          />
        </li>
      </ul>
    </template>

    <p class="session">{{ $t('student.thread.session') }}</p>
    <button
      type="button"
      class="button is-small is-text"
      data-testid="start-over"
      @click="store.startOver()"
    >
      {{ $t('student.thread.startOver') }}
    </button>
  </aside>
</template>

<style scoped>
.thread {
  padding: 1rem 1.25rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  font-size: 0.9rem;
}

.thread-title {
  font-weight: 700;
}

.field-label {
  display: block;
  margin-top: 0.75rem;
  font-weight: 600;
  color: var(--neutral-80);
}

.purpose {
  margin-top: 0.5rem;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.items li {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.session {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
</style>
