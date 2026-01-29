<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';
import AboutIcon from '@/components/icons/AboutIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import HelpComponent from '@/components/nav/HelpComponent.vue';

import BookIcon from '@/components/icons/BookIcon.vue';
import NavBookmarkIcon from '@/components/icons/NavBookmarkIcon.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import { useMetricsStore } from '@/stores/metrics';
import BaseNavItem from './BaseNavItem.vue';
import LanguageSelector from './LanguageSelector.vue';

const featureFlip = useFeatureFlipStore();
const metricStore = useMetricsStore();

const isWorkshopFeatureEnabled = featureFlip.isWorkshopFeatureEnabled();

const navEntries = [
  {
    name: 'chat',
    to: '/q-and-a',
    icon: QnAIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('chat')
  },
  {
    name: 'syllabus',
    to: '/tutor',
    icon: BookIcon,
    featureFlag: 'tutor',
    isFeatureEnabled: featureFlip.isFeatureEnabled('tutor')
  },

  {
    name: 'search',
    to: '/search',
    icon: SearchIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('search')
  },
  {
    name: 'bookmarks',
    to: '/bookmarks',
    icon: NavBookmarkIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('bookmarks')
  },
  {
    name: 'microlearning',
    to: '/microlearning',
    icon: LinesLeaningIcon,
    featureFlag: 'microlearning',
    isFeatureEnabled: featureFlip.isFeatureEnabled('microlearning')
  },
  {
    name: 'about',
    to: '/about',
    icon: AboutIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('about')
  }
];
</script>
<template>
  <div class="nav">
    <div class="nav-items">
      <div v-for="entry in navEntries" :key="entry.name">
        <BaseNavItem
          v-if="entry.isFeatureEnabled"
          :to="entry.to"
          :name="entry.name"
          :icon="entry.icon"
        />
      </div>

      <HelpComponent />
      <a
        class="mx-0 px-0 ml-auto"
        v-if="isWorkshopFeatureEnabled"
        target="_blank"
        :href="metricStore.getWorkshopFormUrl()"
      >
        <span class="item-name router-link-form has-text-success mx-1 px-1 pr-4 is-size-6">{{
          $t('nav.workshopForm')
        }}</span>
      </a>

      <LanguageSelector />
    </div>
  </div>
</template>
<style scoped>
.nav {
  display: flex;
  z-index: 2;
  border-bottom: 1px solid var(--neutral-20);
  width: 100%;
  padding: 0rem;
}

.nav-items {
  position: relative;
  width: 100%;
  height: 100%;
  opacity: 1;
  display: flex;
  flex-direction: row;
  padding-top: 1.5rem;
  text-align: start;

  & > * {
    display: flex;
    opacity: 1;
  }
}

.router-link-form {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
  cursor: pointer;
  width: calc(100% - 2rem);
  flex-wrap: nowrap;
  white-space: nowrap;
  &:hover {
    background-color: var(--neutral-15);
  }
}

.item-name {
  width: auto;
  white-space: nowrap;
  flex-wrap: nowrap;
}

@media screen and (max-width: 1450px) {
  .item-name {
    display: none;
    visibility: hidden;
    opacity: 0;
    width: 0rem;
    white-space: nowrap;
  }
}
</style>
