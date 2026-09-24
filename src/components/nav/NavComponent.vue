<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import HelpComponent from '@/components/nav/HelpComponent.vue';

import BookIcon from '@/components/icons/BookIcon.vue';
import NavBookmarkIcon from '@/components/icons/NavBookmarkIcon.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import BaseNavItem from './BaseNavItem.vue';
import LanguageSelector from './LanguageSelector.vue';

const featureFlip = useFeatureFlipStore();

// Features (tools) on the left; personal/utility items on the right. About lives in the footer.
const toolEntries = [
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
    isFeatureEnabled: featureFlip.isFeatureEnabled('tutor')
  },
  {
    name: 'microlearning',
    to: '/microlearning',
    icon: LinesLeaningIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('microlearning')
  },
  {
    name: 'search',
    to: '/search',
    icon: SearchIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('search')
  }
];

const utilityEntries = [
  {
    name: 'bookmarks',
    to: '/bookmarks',
    icon: NavBookmarkIcon,
    isFeatureEnabled: featureFlip.isFeatureEnabled('bookmarks')
  }
];
</script>
<template>
  <div class="nav">
    <div class="nav-items">
      <template v-for="entry in toolEntries" :key="entry.name">
        <BaseNavItem
          v-if="entry.isFeatureEnabled"
          :to="entry.to"
          :name="entry.name"
          :icon="entry.icon"
        />
      </template>

      <div class="utilities">
        <template v-for="entry in utilityEntries" :key="entry.name">
          <BaseNavItem
            v-if="entry.isFeatureEnabled"
            :to="entry.to"
            :name="entry.name"
            :icon="entry.icon"
          />
        </template>

        <HelpComponent />

        <LanguageSelector />
      </div>
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

.utilities {
  margin-left: auto;
  padding-left: 0.5rem;
  border-left: 1px solid var(--neutral-20);
  align-items: center;
  gap: 0.25rem;
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

@media (max-width: 1450px) {
  .item-name {
    display: none;
    visibility: hidden;
    opacity: 0;
    width: 0rem;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .nav-items {
    padding-top: 0.05rem;
    width: 95%;
    margin: 0 auto;
  }
}
</style>
