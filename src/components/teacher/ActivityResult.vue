<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import SupportingResources from '@/components/teacher/SupportingResources.vue';
import ActivityDataTable from '@/components/teacher/ActivityDataTable.vue';
import StudentHandout from '@/components/teacher/StudentHandout.vue';
import { useActivityDesignStore } from '@/stores/activityDesign';
import { sourceLink } from '@/utils/connections';
import i18n from '@/localisation/i18n';

// the chosen idea developed into a one-page activity: only real steps while waiting (searching
// WeLearn, choosing resources, writing), then the activity with the resources it really uses.
// the teacher edits it as one text, asks for another format, and copies it
const store = useActivityDesignStore();
const texts = 'journey.teach.activity.result';

const PARTS = [
  'objective',
  'format',
  'studentInstructions',
  'providedMaterial',
  'preparation',
  'studentOutput',
  'check'
] as const;

// the activity as plain text: what the teacher edits and copies
const draftText = computed(() => {
  const value = store.activity;
  if (!value) return '';
  const { t } = i18n.global;
  const line = (key: string, text: string | null) =>
    text ? `${t(`${texts}.${key}`)} : ${text}` : '';
  const table = value.dataTable;
  return [
    value.title,
    value.approach ? t(`journey.teach.activity.approaches.${value.approach}`) : '',
    line('objective', value.objective),
    line('format', value.format),
    line('studentInstructions', value.studentInstructions),
    line('providedMaterial', value.providedMaterial),
    line('preparation', value.preparation),
    `${t(`${texts}.steps`)} :\n${value.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
    line('studentOutput', value.studentOutput),
    table
      ? [
          table.caption,
          table.columns.join(' | '),
          ...table.rows.map((row) => row.join(' | ')),
          `${t(`${texts}.dataContext`)} : ${table.context}`,
          `${t(`${texts}.dataSource`)} : ${table.document.payload.document_title} (${sourceLink(table.document)})${
            table.reportedFrom
              ? ` — ${t(`${texts}.reportedFrom`, { source: table.reportedFrom })}`
              : ''
          }`
        ].join('\n')
      : '',
    line('check', value.check),
    line('limitation', value.limitation),
    value.greencomp.length
      ? `${t(`${texts}.greencomp`)} :\n${value.greencomp
          .map((item) => `- ${t(`journey.teach.activity.greencomp.${item.id}`)} : ${item.how}`)
          .join('\n')}`
      : '',
    store.resources.length
      ? `${t(`${texts}.resources`)} :\n${store.resources
          .map(
            ({ document, evidence }) =>
              `- ${document.payload.document_title} (${sourceLink(document, evidence)})`
          )
          .join('\n')}`
      : ''
  ]
    .filter(Boolean)
    .join('\n\n');
});
const shownText = computed(() => store.editedText || draftText.value);

const isEditing = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);
const handleEdit = async () => {
  draft.value = shownText.value;
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};
const handleSave = () => {
  store.setEditedText(draft.value);
  isEditing.value = false;
};

const otherFormat = ref('');

const isCopied = ref(false);
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(shownText.value);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};
</script>
<template>
  <section class="activity-result" data-testid="activity-result">
    <p class="chosen-line">
      <span class="muted">{{ $t(`${texts}.chosen`) }}</span>
      <strong>{{ store.chosen?.title }}</strong>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="back-to-ideas"
        @click="store.backToIdeas()"
      >
        {{ $t(`${texts}.otherIdea`) }}
      </button>
    </p>

    <p
      v-if="store.activityStatus === 'writing'"
      class="writing"
      aria-live="polite"
      data-testid="activity-waiting"
    >
      <span class="loader" aria-hidden="true" />
      {{ $t(`${texts}.writing`) }}
    </p>

    <div
      v-else-if="store.activityStatus === 'unavailable' || store.activityStatus === 'error'"
      class="problem"
      role="alert"
      :data-testid="`activity-${store.activityStatus}`"
    >
      <p>{{ $t(`${texts}.${store.activityStatus}`) }}</p>
      <button
        type="button"
        class="button is-small"
        @click="store.chosen && store.choose(store.chosen)"
      >
        {{ $t('journey.teach.adapt.connections.retry') }}
      </button>
    </div>

    <template v-else-if="store.activity">
      <p class="note">{{ $t(`${texts}.note`) }}</p>

      <template v-if="isEditing">
        <textarea
          ref="editor"
          v-model="draft"
          class="textarea"
          rows="22"
          data-testid="activity-editor"
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
        <div v-if="store.editedText" data-testid="activity-edited">
          <SpaceLabel
            :text="$t('journey.teach.adapt.review.origin.edited')"
            tint="var(--lpi-yellow-lighter)"
          />
          <p class="edited-text">{{ store.editedText }}</p>
        </div>
        <article v-else class="activity" data-testid="activity">
          <p v-if="store.activity.assumesMissing" class="limitation" data-testid="activity-assumes">
            {{ $t(`${texts}.assumes`) }}
          </p>
          <p v-if="store.activity.limitation" class="limitation" data-testid="activity-limitation">
            <strong>{{ $t(`${texts}.limitation`) }} :</strong> {{ store.activity.limitation }}
          </p>
          <h2 class="activity-title">{{ store.activity.title }}</h2>
          <div class="approach-line" data-testid="activity-approach">
            <span v-if="store.activity.approach" class="tag is-medium approach">
              {{ $t(`journey.teach.activity.approaches.${store.activity.approach}`) }}
            </span>
            <!-- another approach is a new activity from new ideas, never a relabelled one -->
            <button
              type="button"
              class="button is-small is-text"
              data-testid="try-another-approach"
              @click="store.tryAnotherApproach()"
            >
              {{ $t(`${texts}.tryAnother`) }}
            </button>
          </div>
          <dl class="parts">
            <template v-for="key in PARTS" :key="key">
              <div v-if="store.activity[key]" class="part-line" :data-testid="`activity-${key}`">
                <dt>{{ $t(`${texts}.${key}`) }}</dt>
                <dd>{{ store.activity[key] }}</dd>
              </div>
              <div v-if="key === 'preparation'" class="part-line" data-testid="activity-steps">
                <dt>{{ $t(`${texts}.steps`) }}</dt>
                <dd>
                  <ol class="steps">
                    <li v-for="(step, index) in store.activity.steps" :key="index">{{ step }}</li>
                  </ol>
                </dd>
              </div>
            </template>
            <div v-if="store.activity.dataTable" class="part-line" data-testid="activity-data">
              <dt>{{ $t(`${texts}.data`) }}</dt>
              <dd><ActivityDataTable :table="store.activity.dataTable" /></dd>
            </div>
            <div
              v-if="store.activity.greencomp.length"
              class="part-line"
              data-testid="activity-greencomp"
            >
              <dt>{{ $t(`${texts}.greencomp`) }}</dt>
              <dd>
                <p v-for="item in store.activity.greencomp" :key="item.id">
                  <strong>{{ $t(`journey.teach.activity.greencomp.${item.id}`) }}</strong> :
                  {{ item.how }}
                </p>
              </dd>
            </div>
          </dl>
        </article>

        <div class="resources-block">
          <h3 class="resources-title">{{ $t(`${texts}.resources`) }}</h3>
          <SupportingResources v-if="store.resources.length" :resources="store.resources" />
          <p v-else class="muted" data-testid="no-activity-resources">
            {{ $t(`${texts}.noResources`) }}
          </p>
        </div>

        <div class="actions">
          <button
            type="button"
            class="button is-small"
            data-testid="edit-activity"
            @click="handleEdit"
          >
            {{ $t(`${texts}.edit`) }}
          </button>
          <button
            type="button"
            class="button is-small"
            data-testid="copy-activity"
            @click="handleCopy"
          >
            {{ isCopied ? $t(`${texts}.copied`) : $t(`${texts}.copy`) }}
          </button>
          <button
            v-if="store.editedText"
            type="button"
            class="button is-small is-text"
            data-testid="restore-activity"
            @click="store.setEditedText(null)"
          >
            {{ $t(`${texts}.restore`) }}
          </button>
        </div>

        <StudentHandout />

        <div class="other-format">
          <label class="label" for="other-format">{{ $t(`${texts}.otherFormat`) }}</label>
          <div class="other-row">
            <input
              id="other-format"
              v-model="otherFormat"
              class="input is-small"
              type="text"
              :placeholder="$t(`${texts}.otherFormatPlaceholder`)"
              data-testid="other-format"
            />
            <button
              type="button"
              class="button is-small"
              :disabled="!otherFormat.trim()"
              data-testid="rewrite"
              @click="store.rewrite(otherFormat)"
            >
              {{ $t(`${texts}.rewrite`) }}
            </button>
          </div>
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
.chosen-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.muted,
.note {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.note {
  margin-top: 1.25rem;
}

.waiting-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
  list-style: none;
}

.waiting-steps li {
  position: relative;
  padding-left: 1.5rem;
}

.waiting-steps li::before {
  position: absolute;
  left: 0;
  content: '○';
  color: var(--neutral-70);
}

.waiting-steps li.is-done::before {
  content: '✓';
  color: var(--primary);
}

.waiting-steps li.is-active {
  font-weight: 600;
}

.waiting-steps li.is-active::before {
  content: '●';
  color: var(--lpi-violet);
}

.waiting-steps li.is-pending {
  color: var(--neutral-70);
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.activity {
  margin-top: 0.75rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.activity-title {
  font-size: 1.25rem;
  font-weight: 700;
}

.part-line {
  display: grid;
  grid-template-columns: 11rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.6rem 0;
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

.approach-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0 0.75rem;
}

.approach {
  font-weight: 600;
}

.edited-text {
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.limitation {
  margin-bottom: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
  font-size: 0.9rem;
}

.writing {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.loader {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid var(--neutral-20);
  border-top-color: var(--lpi-violet);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.resources-block {
  margin-top: 1.5rem;
}

.resources-title {
  font-size: 1rem;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.other-format {
  margin-top: 1.25rem;
}

.other-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.other-row .input {
  flex: 1;
  min-width: 14rem;
}

.textarea {
  margin-top: 0.75rem;
}

@media (max-width: 600px) {
  .part-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>
