<script setup lang="ts">
import { computed, ref } from 'vue';
import AiNote from '@/components/tutor/AiNote.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import ReviewLine from '@/components/tutor/review/ReviewLine.vue';
import { useCourseStore } from '@/stores/course';

// the main topics: titles first, their subtopics one click away. one editor for the whole list,
// saved or cancelled at once
const store = useCourseStore();

const hasSubtopics = computed(() => store.courseTopics.some((topic) => topic.subtopics?.length));
const isSubtopicsShown = ref(false);

// subtopics are edited as one line, separated by commas
type Draft = { from: number | null; title: string; subtopics: string };
const drafts = ref<Draft[] | null>(null);

const addDraft = () => drafts.value?.push({ from: null, title: '', subtopics: '' });

const startEditing = () => {
  drafts.value = store.courseTopics.map((topic, index) => ({
    from: index,
    title: topic.value,
    subtopics: (topic.subtopics || []).join(', ')
  }));
  if (!drafts.value.length) addDraft();
};

const save = () => {
  store.saveTopics(
    (drafts.value || []).map(({ from, title, subtopics }) => ({
      from,
      title,
      subtopics: subtopics.split(',')
    }))
  );
  drafts.value = null;
};
</script>

<template>
  <ReviewLine :label="$t('tutor.check.topicsLabel')" data-testid="topics">
    <form v-if="drafts" class="topic-editor" @submit.prevent="save">
      <div
        v-for="(draft, index) in drafts"
        :key="index"
        class="topic-row"
        data-testid="topic-draft"
      >
        <div class="topic-fields">
          <input
            v-model="draft.title"
            class="input is-small"
            type="text"
            :placeholder="$t('tutor.check.topicTitle')"
            :aria-label="$t('tutor.check.topicTitle')"
            data-testid="topic-title"
          />
          <input
            v-model="draft.subtopics"
            class="input is-small subtopics-input"
            type="text"
            :placeholder="$t('tutor.check.subtopics')"
            :aria-label="$t('tutor.check.subtopics')"
            data-testid="topic-subtopics"
          />
        </div>
        <button
          type="button"
          class="delete mp-sensitive"
          :aria-label="$t('tutor.check.removeTopic', { topic: draft.title })"
          data-testid="remove-topic"
          @click="drafts.splice(index, 1)"
        />
      </div>
      <ButtonComponent
        type="button"
        is-discreet
        class="is-small mt-2"
        data-testid="add-topic"
        @click="addDraft"
      >
        + {{ $t('tutor.check.addTopic') }}
      </ButtonComponent>
      <div class="editor-actions">
        <ButtonComponent type="submit" color="primary" class="is-small" data-testid="save-topics">
          {{ $t('tutor.check.saveChanges') }}
        </ButtonComponent>
        <ButtonComponent
          type="button"
          is-discreet
          class="is-small"
          data-testid="cancel-topics"
          @click="drafts = null"
        >
          {{ $t('tutor.check.cancel') }}
        </ButtonComponent>
      </div>
    </form>

    <template v-else-if="!store.courseTopics.length">
      <p class="muted" data-testid="no-topics">{{ $t('tutor.check.noTopicsFound') }}</p>
      <ButtonComponent
        is-discreet
        class="is-small mt-1"
        data-testid="add-topics"
        @click="startEditing"
      >
        + {{ $t('tutor.check.addTopics') }}
      </ButtonComponent>
    </template>

    <template v-else>
      <EditButton
        class="line-action"
        :label="$t('tutor.check.editField', { field: $t('tutor.check.topicsLabel') })"
        data-testid="edit-topics"
        @click="startEditing"
      />
      <ul class="topic-list">
        <li v-for="(topic, index) in store.courseTopics" :key="index" data-testid="topic">
          <span class="topic-title">{{ topic.value }}</span>
          <AiNote
            v-if="topic.origin === 'extracted' && topic.verification === 'unverified'"
            :label="$t('tutor.check.tag.check')"
            :detail="$t('tutor.check.pleaseCheck')"
            data-testid="topic-note"
          />
          <p
            v-if="isSubtopicsShown && topic.subtopics?.length"
            class="subtopics"
            data-testid="subtopics"
          >
            {{ topic.subtopics.join(', ') }}
          </p>
        </li>
      </ul>
      <ButtonComponent
        v-if="hasSubtopics"
        is-discreet
        class="is-small mt-2"
        data-testid="toggle-subtopics"
        @click="isSubtopicsShown = !isSubtopicsShown"
      >
        {{ isSubtopicsShown ? $t('tutor.check.hideSubtopics') : $t('tutor.check.showSubtopics') }}
      </ButtonComponent>
    </template>
  </ReviewLine>
</template>

<style scoped>
.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

/* each topic in bold, its subtopics underneath in a smaller, muted line */
.topic-list li + li {
  margin-top: 0.6rem;
}

.topic-title {
  font-weight: 600;
}

.subtopics {
  margin-top: 0.15rem;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--neutral-70);
}

.topic-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--neutral-10);
}

.topic-fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.25rem;
}

.subtopics-input {
  color: var(--neutral-70);
}

.topic-row .delete {
  margin-top: 0.4rem;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
