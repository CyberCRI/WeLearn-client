<script setup lang="ts">
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { computed, nextTick, ref } from 'vue';
import OpenUrlIcon from '@/components/icons/OpenUrlIcon.vue';

const props = defineProps<{
  syllabus?: { content: string; source: string };
  giveFeedback: (feedback: string) => Promise<boolean | undefined>;
  feedbackHistory: string[];
  action: () => void;
  updateSyllabus: (content: string) => void;
  restart: () => void;
  updateSyllabusInDB: () => void;
}>();

const syllabusBox = ref<HTMLElement | null>(null);

// edits happen on the rendered HTML; turn them back into markdown so headings,
// lists and tables survive in the page and in the Word download
const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  emDelimiter: '*',
  hr: '---'
});
turndown.use(gfm);
// the markdown comes from the LLM, not a user: no need to escape it
turndown.escape = (s: string) => s;
// a real line break would split the table row, so keep <br> inside table cells
turndown.addRule('tableCellBreak', {
  filter: (node) => node.nodeName === 'BR' && !!node.closest('td, th'),
  replacement: () => '<br>'
});

const html = computed(() => (props.syllabus?.content ? marked.parse(props.syllabus.content) : ''));

// links can't be followed inside editable text, so clicking one shows a small
// "open" bubble under it (like in Google Docs)
const linkBubble = ref<{ href: string; top: number; left: number } | null>(null);

const showLinkBubble = (event: MouseEvent) => {
  const link = (event.target as HTMLElement).closest('a');
  const box = syllabusBox.value;
  // only web and mail links, never javascript: or similar
  if (!link || !box || !/^(https?:|mailto:)/.test(link.href)) {
    linkBubble.value = null;
    return;
  }
  const linkRect = link.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  linkBubble.value = {
    href: link.href,
    top: linkRect.bottom - boxRect.top + box.scrollTop + 4,
    left: Math.max(0, Math.min(linkRect.left - boxRect.left, box.clientWidth - 320))
  };
};

// only convert back to markdown after a real edit: clicking around (e.g. on a link)
// must never rewrite the syllabus
let isDirty = false;

const handleTextEdit = (event: FocusEvent) => {
  linkBubble.value = null;
  if (!isDirty) return;
  isDirty = false;
  props.updateSyllabus(turndown.turndown((event.target as HTMLElement).innerHTML));
  props.updateSyllabusInDB();
};

const feedback = ref('');
const feedbackFailed = ref(false);

const sendFeedback = async () => {
  if (!feedback.value.trim()) return;
  const ok = await props.giveFeedback(feedback.value);
  // keep the text if sending failed, so the user doesn't lose what they wrote
  feedbackFailed.value = ok === false;
  if (!ok) return;
  feedback.value = '';
  // show the regenerated syllabus from its start
  await nextTick();
  syllabusBox.value?.scrollTo({ top: 0 });
  syllabusBox.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>
<template>
  <div class="wrapper">
    <h1 data-testid="thirdStepTitle" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.syllabusStep.title') }}
    </h1>
    <p class="subtitle is-6 mt-2">{{ $t('tutor.syllabusStep.description') }}</p>

    <div ref="syllabusBox" class="editable-syllabus-wrapper">
      <div
        v-if="syllabus?.content"
        contenteditable="true"
        id="syllabus"
        class="syllabus content"
        v-html="html"
        @blur="handleTextEdit"
        @click="showLinkBubble"
        @keydown="linkBubble = null"
        @input="isDirty = true"
      />
      <!-- mousedown.prevent keeps the focus in the syllabus so the bubble isn't closed by blur -->
      <div
        v-if="linkBubble"
        class="link-bubble"
        :style="{ top: `${linkBubble.top}px`, left: `${linkBubble.left}px` }"
        @mousedown.prevent
      >
        <span class="link-url">{{ linkBubble.href }}</span>
        <a
          class="button is-small is-primary is-light"
          :href="linkBubble.href"
          target="_blank"
          rel="noopener noreferrer"
          @click="linkBubble = null"
        >
          {{ $t('tutor.syllabusStep.openLink') }}
          <OpenUrlIcon class="icon is-small ml-1" />
        </a>
      </div>
    </div>

    <div class="feedback box">
      <label class="label" for="syllabus-feedback">{{
        $t('tutor.syllabusStep.feedbackLabel')
      }}</label>
      <details v-if="feedbackHistory.length" class="feedback-history">
        <summary>
          {{ $t('tutor.syllabusStep.feedbackHistory', { n: feedbackHistory.length }) }}
        </summary>
        <ol>
          <li v-for="(item, index) in feedbackHistory" :key="index">{{ item }}</li>
        </ol>
      </details>
      <textarea
        id="syllabus-feedback"
        class="textarea"
        rows="2"
        v-model="feedback"
        :placeholder="$t('tutor.syllabusStep.feedbackPlaceholder')"
      />
      <p v-if="feedbackFailed" class="has-text-danger mt-2">
        {{ $t('tutor.syllabusStep.feedbackError') }}
      </p>
      <div class="is-flex is-justify-content-end mt-2">
        <button class="button" :disabled="!feedback.trim()" @click="sendFeedback">
          {{ $t('tutor.syllabusStep.regenerate') }}
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="button is-text" @click="restart">
        {{ $t('tutor.syllabusStep.restart') }}
      </button>
      <button class="button is-primary" @click="action()">
        {{ $t('tutor.syllabusStep.download') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editable-syllabus-wrapper {
  position: relative;
  max-height: 70vh;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.syllabus {
  padding: 2rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  min-height: 10rem;
  overflow-x: auto;
  background-color: var(--neutral-10);
  cursor: text;
  :deep(a) {
    cursor: pointer;
  }
  &:hover {
    border-color: var(--primary-light);
  }
  &:focus {
    outline: none;
    border-color: var(--primary);
    background-color: var(--neutral-0);
  }
}

.link-bubble {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 320px;
  padding: 0.375rem 0.375rem 0.375rem 0.75rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  background-color: var(--neutral-0);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  font-size: 0.8rem;
}

.link-url {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--neutral-70);
}

.link-bubble .icon {
  width: 0.9em;
  height: 0.9em;
}

.feedback {
  box-shadow: none;
  border: 1px solid var(--neutral-20);
}

.feedback-history {
  margin-bottom: 0.5rem;
  summary {
    cursor: pointer;
    color: var(--neutral-70);
  }
  ol {
    margin: 0.5rem 0 0 1.5rem;
  }
  li {
    white-space: pre-wrap;
    margin-bottom: 0.25rem;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 3rem;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column-reverse;
  }
  .syllabus {
    padding: 1rem;
  }
}
</style>
