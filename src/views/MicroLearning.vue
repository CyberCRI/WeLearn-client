<script setup lang="ts">
import { marked } from 'marked';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

type MicrolearningTabKey = 'synthese' | 'bibliographie' | 'ressources';

type MicrolearningSections = Record<MicrolearningTabKey, string>;

type Topic = {
  key: string;
  label: string;
  displayTitle: string;
  sections: MicrolearningSections;
};

const TOPIC_MENU_LABEL_OVERRIDES: Record<string, string> = {
  droit: 'Droit',
  economie: 'Économie',
  geographie: 'Géographie',
  histoire: 'Histoire',
  mathematiques: 'Mathématiques',
  philosophie: 'Philosophie',
  psychologie: 'Psychologie',
};

const TAB_TO_SECTION: Record<MicrolearningTabKey, string> = {
  synthese: 'Synthèse',
  bibliographie: 'Bibliographie (UVED)',
  ressources: 'Ressources complémentaires (WeLearn)'
};

const DEFAULT_SECTIONS: MicrolearningSections = {
  synthese: '',
  bibliographie: '',
  ressources: ''
};

const markdownModules = import.meta.glob('/src/assets/microlearning/fr/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

const { locale } = useI18n();
const router = useRouter();

watch(locale, (nextLocale) => {
  if (nextLocale !== 'fr') {
    router.replace({ name: 'q-and-a' });
  }
});

const selectedTopicKey = ref('');
const activeTab = ref<MicrolearningTabKey>('synthese');

const getTopicSlug = (filePath: string) => {
  return (filePath.split('/').pop()?.replace('.md', '') ?? filePath).toLowerCase();
};

const buildTopicLabel = (fileContent: string, filePath: string) => {
  const topicSlug = getTopicSlug(filePath);
  const menuLabelOverride = TOPIC_MENU_LABEL_OVERRIDES[topicSlug];
  if (menuLabelOverride) {
    return menuLabelOverride;
  }

  const titleMatch = fileContent.match(/^#\s+(.+)$/m);
  if (titleMatch?.[1]) {
    return titleMatch[1].trim();
  }

  const fileName = filePath.split('/').pop()?.replace('.md', '') ?? filePath;
  return fileName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const buildTopicDisplayTitle = (fileContent: string, filePath: string, defaultLabel: string) => {
  const titleMatch = fileContent.match(/^#\s+(.+)$/m);
  if (titleMatch?.[1]) {
    return titleMatch[1].trim();
  }

  return defaultLabel;
};

const parseSections = (fileContent: string): MicrolearningSections => {
  const sections: MicrolearningSections = {
    ...DEFAULT_SECTIONS
  };

  const lines = fileContent.replace(/\r\n/g, '\n').split('\n');
  let activeSection: MicrolearningTabKey | null = null;

  for (const line of lines) {
    const sectionHeading = line.match(
      /^##\s+(Synthèse|Bibliographie(?:\s*\(UVED\))?|Ressources(?:\s+complémentaires\s*\(WeLearn\))?)\s*$/i
    );
    if (sectionHeading) {
      const normalizedHeading = sectionHeading[1].toLowerCase();
      if (normalizedHeading === 'synthèse') {
        activeSection = 'synthese';
      } else if (normalizedHeading === 'bibliographie') {
        activeSection = 'bibliographie';
      } else if (normalizedHeading === 'ressources') {
        activeSection = 'ressources';
      }
      continue;
    }

    if (activeSection) {
      sections[activeSection] += `${line}\n`;
    }
  }

  return sections;
};

const topics = computed<Topic[]>(() => {
  return Object.entries(markdownModules)
    .map(([filePath, fileContent]) => {
      const label = buildTopicLabel(fileContent, filePath);
      return {
        key: filePath,
        label,
        displayTitle: buildTopicDisplayTitle(fileContent, filePath, label),
        sections: parseSections(fileContent)
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'));
});

if (topics.value.length > 0) {
  selectedTopicKey.value = topics.value[0].key;
}

const selectedTopic = computed(() => {
  return topics.value.find((topic) => topic.key === selectedTopicKey.value) ?? null;
});

const selectedTabLabel = computed(() => TAB_TO_SECTION[activeTab.value]);

const selectedSectionHeading = computed(() => {
  if (activeTab.value === 'synthese') {
    return selectedTopic.value?.displayTitle ?? TAB_TO_SECTION.synthese;
  }

  return selectedTabLabel.value;
});

const selectedSectionContent = computed(() => {
  return selectedTopic.value?.sections[activeTab.value].trim() ?? '';
});

const renderedActiveSection = computed(() => {
  if (!selectedSectionContent.value) {
    return '';
  }
  return marked.parse(selectedSectionContent.value);
});

const selectTab = (tab: MicrolearningTabKey) => {
  activeTab.value = tab;
};

const onTopicChange = () => {
  activeTab.value = 'synthese';
};
</script>

<template>
  <div class="content-centered-wrapper">
    <div class="layout-flex">
      <section class="microlearning-shell">
        <section class="microlearning-header">
          <h1 class="title is-4 is-size-5-mobile">{{ $t('microlearning.mainTitle') }}</h1>
          <p class="subtitle is-6 is-size-6-mobile topic-label">{{ $t('microlearning.topicLabel') }}</p>
          <select
            id="topic-selector"
            v-model="selectedTopicKey"
            class="topic-select"
            :disabled="topics.length === 0"
            @change="onTopicChange"
          >
            <option v-if="topics.length === 0" value="">
              {{ $t('microlearning.noTopicAvailable') }}
            </option>
            <option v-for="topic in topics" :key="topic.key" :value="topic.key">
              {{ topic.label }}
            </option>
          </select>
        </section>

        <section v-if="selectedTopic" class="microlearning-content">
          <nav class="tabs" aria-label="Microlearning sections">
            <button
              class="button tab-button"
              :class="{ 'is-primary': activeTab === 'synthese' }"
              @click="selectTab('synthese')"
              type="button"
            >
              {{ $t('microlearning.tabs.summary') }}
            </button>
            <button
              class="button tab-button"
              :class="{ 'is-primary': activeTab === 'bibliographie' }"
              @click="selectTab('bibliographie')"
              type="button"
            >
              {{ $t('microlearning.tabs.bibliography') }}
            </button>
            <button
              class="button tab-button"
              :class="{ 'is-primary': activeTab === 'ressources' }"
              @click="selectTab('ressources')"
              type="button"
            >
              {{ $t('microlearning.tabs.resources') }}
            </button>
          </nav>

          <article class="tab-panel">
            <h3 class="subtitle has-text-weight-bold is-5 is-size-6-mobile">
              {{ selectedSectionHeading }}
            </h3>
            <div v-if="selectedSectionContent" class="markdown-content" v-html="renderedActiveSection"></div>
            <p v-else class="empty-state">{{ $t('microlearning.emptySection') }}</p>
          </article>
        </section>

        <section v-else class="empty-state-wrapper">
          <p class="empty-state">{{ $t('microlearning.noTopicAvailable') }}</p>
        </section>
      </section>
    </div>
  </div>
</template>

<style scoped>
.content-centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.layout-flex {
  width: 100%;
  overflow-y: auto;
  padding: 1rem 20%;
}

.microlearning-shell {
  width: 100%;
}

.microlearning-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.topic-label {
  margin-bottom: 0.35rem;
}

.topic-select {
  max-width: 36rem;
  width: 100%;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  padding: 0.7rem 0.9rem;
  background-color: var(--neutral-0);
  font-size: 1rem;
}

.microlearning-content {
  width: 100%;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.tab-button {
  min-width: 10rem;
  justify-content: center;
  border-radius: 0.5rem;
  border: 1px solid var(--neutral-20);
  background-color: var(--neutral-0);
}

.tab-panel {
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--neutral-10);
  min-height: 60vh;
  overflow-y: auto;
}

.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(p) {
  margin-bottom: 0.9rem;
}

.markdown-content :deep(h3) {
  font-size: 1.15rem;
  font-weight: 700;
  margin-top: 1.4rem;
  margin-bottom: 0.7rem;
  color: var(--neutral-90);
}

.markdown-content :deep(h4) {
  font-size: 1.02rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.55rem;
  color: var(--neutral-80);
}

.markdown-content :deep(li) {
  margin-bottom: 0.35rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-left: 1rem;
}

.markdown-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 700;
}

.empty-state-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.empty-state {
  color: var(--neutral-60);
  font-style: italic;
}

@media screen and (max-width: 768px) {
  .layout-flex {
    padding-inline: 5%;
  }

  .tabs {
    gap: 0.4rem;
  }

  .tab-button {
    min-width: auto;
  }

  .tab-panel {
    padding: 1rem;
    min-height: 50vh;
  }
}

@media screen and (max-width: 1024px) {
  .layout-flex {
    padding-inline: 10%;
  }
}
</style>
