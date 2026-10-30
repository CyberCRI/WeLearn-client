<script setup lang="ts">
import { ref } from 'vue';
import { useActivityDesignStore } from '@/stores/activityDesign';
import { sourceLink } from '@/utils/connections';

// 2-3 short activity ideas proposed by WeLearn: the teacher picks one, asks for others (of a
// type they prefer, if they want), or describes their own idea
const store = useActivityDesignStore();
const texts = 'journey.teach.activity.ideas';
const ownIdea = ref('');
</script>
<template>
  <section class="activity-ideas" data-testid="activity-ideas">
    <h2 class="ideas-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="ideas-intro">{{ $t(`${texts}.intro`) }}</p>

    <!-- nothing in the database on this precise subject: said plainly, rather than loosely related documents -->
    <p v-if="!store.candidates.length" class="notification is-light" data-testid="no-relevant">
      {{ $t(`${texts}.noRelevant`) }}
    </p>
    <p
      v-if="store.methodNotice"
      class="notification is-warning is-light"
      data-testid="method-notice"
    >
      {{
        $t(`${texts}.methodNotice.${store.methodNotice.reason}`, {
          method: $t(`journey.teach.activity.approaches.${store.methodNotice.approach}`)
        })
      }}
    </p>
    <p v-if="!store.ideas.length" class="muted" data-testid="no-ideas">{{ $t(`${texts}.none`) }}</p>
    <ul class="idea-list">
      <li v-for="idea in store.ideas" :key="idea.title" class="idea" data-testid="idea">
        <!-- specific title · teaching method · duration, then what students actually do -->
        <h3 class="idea-title">
          {{ idea.title
          }}<span v-if="idea.approach" class="idea-method" data-testid="idea-approach">
            · {{ $t(`journey.teach.activity.approaches.${idea.approach}`) }}</span
          ><span v-if="idea.duration" class="idea-method"> · {{ idea.duration }}</span>
        </h3>
        <p>{{ idea.studentsDo }}</p>
        <!-- what the idea is built on: verified WeLearn resources, or WeLearn's own scenario -->
        <p class="based-on" data-testid="idea-based-on">
          <template v-if="idea.resources.length">
            {{ $t(`${texts}.basedOn`) }}
            <template
              v-for="(resource, index) in idea.resources"
              :key="resource.document.payload.document_id"
            >
              <a
                :href="sourceLink(resource.document, resource.evidence)"
                target="_blank"
                rel="noopener"
                >{{ resource.document.payload.document_title }}</a
              >
              ({{ $t(`journey.teach.activity.materials.${resource.material}`) }})<span
                v-if="index < idea.resources.length - 1"
                >,
              </span>
            </template>
          </template>
          <template v-else>{{ $t(`${texts}.selfContained`) }}</template>
        </p>
        <button
          type="button"
          class="button is-small is-primary"
          data-testid="choose-idea"
          @click="store.choose(idea)"
        >
          {{ $t(`${texts}.choose`) }}
        </button>
      </li>
    </ul>

    <div class="other">
      <label class="label" for="preferred-type">{{ $t(`${texts}.preferredType`) }}</label>
      <div class="other-row">
        <input
          id="preferred-type"
          v-model="store.preferredType"
          class="input is-small"
          type="text"
          :placeholder="$t(`${texts}.preferredTypePlaceholder`)"
          data-testid="preferred-type"
        />
        <button
          type="button"
          class="button is-small"
          data-testid="other-ideas"
          @click="store.suggestIdeas(true)"
        >
          {{ $t(`${texts}.other`) }}
        </button>
      </div>
    </div>

    <details class="own" data-testid="own-idea">
      <summary>{{ $t(`${texts}.ownIdea`) }}</summary>
      <textarea
        v-model="ownIdea"
        class="textarea mt-2"
        rows="3"
        :placeholder="$t(`${texts}.ownIdeaPlaceholder`)"
        data-testid="own-idea-text"
      />
      <button
        type="button"
        class="button is-small mt-2"
        :disabled="!ownIdea.trim()"
        data-testid="use-own-idea"
        @click="store.chooseOwnIdea(ownIdea)"
      >
        {{ $t(`${texts}.useOwnIdea`) }}
      </button>
    </details>
  </section>
</template>

<style scoped>
.ideas-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.ideas-intro,
.muted {
  color: var(--neutral-70);
}

.ideas-intro {
  margin-top: 0.25rem;
  font-size: 0.9rem;
}

.idea-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
}

.idea {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.idea-method {
  font-weight: 400;
  color: var(--neutral-70);
}

.idea-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.muted {
  font-size: 0.9rem;
}

.based-on {
  font-size: 0.85rem;
  color: var(--neutral-80);
}

.other {
  margin-top: 1.5rem;
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

.own {
  margin-top: 1rem;
}

.own summary {
  font-weight: 600;
  cursor: pointer;
}
</style>
