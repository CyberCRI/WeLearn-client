<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import i18n from '@/localisation/i18n';
import ChatArea from '@/components/ChatArea.vue';
import ChatBuble from '@/components/ChatBuble.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatQueuesPills from '@/components/ChatQueuesPills.vue';
import Loading from '@/components/LoadingComponent.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import { useStudentLanguage } from '@/components/student/useStudentLanguage';
import { useLearnerStore } from '@/stores/learner';
import { STARTS, citedIn, type LearnerStart } from '@/utils/learnerTutor';
import { sourceLink } from '@/utils/connections';

// Ask WeLearn for learners: a conversation with the WeLearn tutor, in the same chat interface as
// the teachers' Ask WeLearn (its message area, bubbles, starter pills, loading dots and composer):
// a greeting, three starters, then the real tutor
useStudentLanguage();
const store = useLearnerStore();
const { t } = i18n.global;

const greeting = () => t('student.ask.greeting');
onMounted(() => store.greet(greeting()));

const turns = computed(() => store.turnsOf('start'));
const hasAnswered = computed(() => turns.value.some((turn) => turn.role === 'learner'));
const status = computed(() => store.status.start || 'idle');
const isBusy = computed(() => ['thinking', 'searching'].includes(status.value));
const draft = ref('');

// the three starters, by their label (the pills hand back the text clicked)
const starters = computed(() => STARTS.map((start) => t(`student.starts.${start}`)));
const handleStarter = (label: string) => {
  const start = STARTS[starters.value.indexOf(label)] as LearnerStart | undefined;
  if (start && !isBusy.value) store.choose(start, label);
};
const handleSend = (text: string) => store.discover(text);

// the WeLearn documents a tutor answer cites, to open them
const citations = (text: string) => citedIn(text, store.spaceDocuments.start || []);

const handleNewConversation = () => {
  store.startOver();
  store.greet(greeting());
  draft.value = '';
};
</script>
<template>
  <div class="learn-page">
    <main class="chat-template" data-testid="learner-conversation">
      <h1 class="visually-hidden">{{ $t('student.ask.title') }}</h1>
      <div v-if="hasAnswered" class="delete-button-wrapper">
        <DeleteButton
          :action="handleNewConversation"
          :delText="$t('student.ask.newConversation')"
          data-testid="new-conversation"
        />
      </div>
      <!-- never the centred "empty" layout: the greeting and the starters stay together, above
           the composer -->
      <ChatArea :isEmpty="false">
        <template #message-list>
          <div class="bubbles-wrapper">
            <template v-for="(turn, index) in turns" :key="index">
              <ChatBuble
                :message="turn.text"
                :isUSer="turn.role === 'learner'"
                :isLast="index === turns.length - 1 && !isBusy"
                :shouldDisable="isBusy"
                :data-testid="`turn-${turn.role}`"
              />
              <!-- a space WeLearn suggests: optional, a link only; the topic goes with it -->
              <p v-if="turn.space" class="suggested-space" data-testid="suggested-space">
                <router-link
                  :to="{ name: 'learn-space', params: { space: turn.space } }"
                  @click="store.openSuggestedSpace(turn)"
                >
                  {{
                    $t('student.ask.openSpace', { space: $t(`student.spaces.${turn.space}.name`) })
                  }}
                  →
                </router-link>
              </p>
              <p
                v-if="turn.role === 'tutor' && citations(turn.text).length"
                class="cited"
                data-testid="cited"
              >
                {{ $t('student.tutor.usedDocs') }} :
                <template v-for="(doc, i) in citations(turn.text)" :key="doc.payload.document_id">
                  <a :href="sourceLink(doc)" target="_blank" rel="noopener">{{
                    doc.payload.document_title
                  }}</a
                  ><span v-if="i < citations(turn.text).length - 1"> · </span>
                </template>
              </p>
            </template>
            <p
              v-if="status === 'unavailable' || status === 'error'"
              class="problem"
              role="alert"
              :data-testid="`tutor-${status}`"
            >
              {{ $t(`student.tutor.${status}`) }}
            </p>
          </div>
        </template>
        <template #loading>
          <!-- only what is really happening: a search for sources, or the answer being written -->
          <Loading
            v-if="isBusy"
            :label="
              status === 'searching' ? $t('student.tutor.searching') : $t('student.tutor.thinking')
            "
            data-testid="tutor-thinking"
          />
        </template>
        <template #queues>
          <div v-if="!hasAnswered" class="queues-wrapper" data-testid="starters">
            <ChatQueuesPills
              :messageList="starters"
              :limit="STARTS.length"
              :shouldDisable="isBusy"
              :action="handleStarter"
            />
          </div>
        </template>
      </ChatArea>
      <div class="input-area">
        <ChatInput
          v-model="draft"
          class="is-flex is-full-width is-flex-grow-1"
          :placeholder="$t('student.start.placeholder')"
          :action="handleSend"
          data-testid="tutor-input"
        />
      </div>
      <p class="session">{{ $t('student.ask.session') }}</p>
    </main>
  </div>
</template>

<style scoped>
/* the page fills the space under the header, as Ask WeLearn: the messages scroll, the composer
   stays at the bottom */
.learn-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* the layout of Ask WeLearn's ChatComponent */
.chat-template {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding-bottom: 0.5rem;
}

.delete-button-wrapper {
  position: absolute;
  right: 10%;
  top: 1rem;
  z-index: 1;
}

.bubbles-wrapper {
  width: 80%;
  overflow-x: auto;
}

.queues-wrapper {
  width: 80%;
  margin: auto;
  padding-top: 0.5rem;
}

.cited {
  margin: -0.75rem 0 0.5rem 3.5rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.suggested-space {
  margin: -0.75rem 0 0.5rem 3.5rem;
  font-size: 0.9rem;
}

.problem {
  padding: 0.5rem 1rem;
  color: var(--neutral-90);
}

.input-area {
  width: 80%;
  height: fit-content;
  padding: calc(0.5em - 1px) calc(0.75em - 1px);
  border: 1px solid var(--neutral-50);
  border-radius: 0.375rem;
  box-shadow: inset 0 0.0625em 0.125em hsla(221, 14%, 4%, 0.05);
  line-height: 1.5;
}

.input-area:has(textarea:focus) {
  border-color: var(--primary);
}

.session {
  width: 80%;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--neutral-70);
}

@media (max-width: 950px) {
  .delete-button-wrapper {
    right: 0.75rem;
  }

  .bubbles-wrapper,
  .queues-wrapper {
    width: 95%;
  }

  .input-area,
  .session {
    width: 92%;
  }

  .input-area {
    padding: 0.25rem;
  }

  .cited {
    margin-left: 1rem;
  }
}
</style>
