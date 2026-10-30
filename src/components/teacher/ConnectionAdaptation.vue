<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import { useCourseConnectionsStore, type Connection } from '@/stores/courseConnections';
import i18n from '@/localisation/i18n';

// a chosen connection developed into a short activity: an addition to the teacher's material,
// never a replacement. shown as a structured draft; the teacher edits it as a whole (one text),
// can restore the draft, and copies it
const props = defineProps<{ connection: Connection }>();
const store = useCourseConnectionsStore();
const texts = 'journey.teach.adapt.connections.adaptation';

const adaptation = computed(() => props.connection.adaptation);
const suggestion = computed(() => adaptation.value?.suggestion);
const PARTS = ['placement', 'objective', 'duration', 'studentTask', 'check'] as const;

// the draft as plain text: what the teacher edits and copies
const draftText = computed(() => {
  const value = suggestion.value;
  if (!value) return '';
  const { t } = i18n.global;
  const line = (key: string, text: string | null) =>
    text ? `${t(`${texts}.${key}`)} : ${text}` : '';
  return [
    value.title,
    line('placement', value.placement),
    line('objective', value.objective),
    line('duration', value.duration),
    `${t(`${texts}.steps`)} :\n${value.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
    line('studentTask', value.studentTask),
    line('check', value.check)
  ]
    .filter(Boolean)
    .join('\n\n');
});

const resourcesText = computed(() =>
  (suggestion.value?.documents || [])
    .map((doc) => `- ${doc.payload.document_title} (${doc.payload.document_url})`)
    .join('\n')
);

const isEditing = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);
const handleEdit = async () => {
  draft.value = adaptation.value?.editedText || draftText.value;
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};
const handleSave = () => {
  store.editAdaptation(props.connection.id, draft.value);
  isEditing.value = false;
};

const isCopied = ref(false);
const handleCopy = async () => {
  const body = adaptation.value?.editedText || draftText.value;
  const resources = resourcesText.value
    ? `\n\n${i18n.global.t(`${texts}.resources`)} :\n${resourcesText.value}`
    : '';
  try {
    await navigator.clipboard.writeText(body + resources);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};
</script>
<template>
  <section v-if="adaptation" class="adaptation" data-testid="adaptation">
    <p v-if="adaptation.status === 'thinking'" class="waiting" role="status">
      <span class="loader" aria-hidden="true" />
      {{ $t(`${texts}.developing`) }}
    </p>
    <div v-else-if="adaptation.status !== 'ready'" class="problem" role="alert">
      {{ $t(`${texts}.${adaptation.status === 'unavailable' ? 'unavailable' : 'error'}`) }}
      <button type="button" class="button is-small is-text" @click="store.develop(connection.id)">
        {{ $t('journey.teach.adapt.connections.retry') }}
      </button>
    </div>
    <template v-else-if="suggestion">
      <p class="note">{{ $t(`${texts}.note`) }}</p>

      <template v-if="isEditing">
        <textarea
          ref="editor"
          v-model="draft"
          class="textarea"
          rows="14"
          data-testid="adaptation-editor"
        />
        <div class="actions">
          <button type="button" class="button is-small is-primary" @click="handleSave">
            {{ $t('journey.teach.adapt.review.save') }}
          </button>
          <button type="button" class="button is-small is-text" @click="isEditing = false">
            {{ $t('journey.teach.adapt.review.cancel') }}
          </button>
        </div>
      </template>

      <template v-else>
        <div v-if="adaptation.editedText" class="edited" data-testid="adaptation-edited">
          <SpaceLabel
            :text="$t('journey.teach.adapt.review.origin.edited')"
            tint="var(--lpi-yellow-lighter)"
          />
          <p class="edited-text">{{ adaptation.editedText }}</p>
        </div>
        <template v-else>
          <h4 class="adaptation-title">{{ suggestion.title }}</h4>
          <dl class="parts">
            <template v-for="key in PARTS" :key="key">
              <div v-if="suggestion[key]" class="part-line" :data-testid="`adaptation-${key}`">
                <dt>{{ $t(`${texts}.${key}`) }}</dt>
                <dd>{{ suggestion[key] }}</dd>
              </div>
              <div v-if="key === 'duration'" class="part-line" data-testid="adaptation-steps">
                <dt>{{ $t(`${texts}.steps`) }}</dt>
                <dd>
                  <ol class="steps">
                    <li v-for="(step, index) in suggestion.steps" :key="index">{{ step }}</li>
                  </ol>
                </dd>
              </div>
            </template>
          </dl>
        </template>

        <p v-if="suggestion.documents.length" class="resources" data-testid="adaptation-resources">
          {{ $t(`${texts}.resources`) }} :
          <template v-for="(doc, index) in suggestion.documents" :key="doc.payload.document_id">
            <a :href="doc.payload.document_url" target="_blank" rel="noopener">{{
              doc.payload.document_title
            }}</a
            ><span v-if="index < suggestion.documents.length - 1">, </span>
          </template>
        </p>

        <div class="actions">
          <button
            type="button"
            class="button is-small"
            data-testid="edit-adaptation"
            @click="handleEdit"
          >
            {{ $t(`${texts}.edit`) }}
          </button>
          <button type="button" class="button is-small" data-testid="copy" @click="handleCopy">
            {{ isCopied ? $t(`${texts}.copied`) : $t(`${texts}.copy`) }}
          </button>
          <button
            v-if="adaptation.editedText"
            type="button"
            class="button is-small is-text"
            data-testid="restore-adaptation"
            @click="store.restoreAdaptation(connection.id)"
          >
            {{ $t(`${texts}.restore`) }}
          </button>
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
.adaptation {
  margin-top: 1.25rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.note,
.resources,
.waiting {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.adaptation-title {
  margin-top: 0.5rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.parts {
  margin-top: 0.75rem;
}

.part-line {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--neutral-20);
}

.part-line dt {
  font-weight: 600;
}

.steps {
  padding-left: 1.25rem;
  list-style: decimal;
}

.steps li + li {
  margin-top: 0.25rem;
}

.edited {
  margin-top: 0.75rem;
}

.edited-text {
  margin-top: 0.5rem;
  white-space: pre-line;
}

.resources {
  margin-top: 0.75rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.textarea {
  margin-top: 0.75rem;
}

.waiting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--neutral-20);
  border-top-color: var(--lpi-violet);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .part-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>
