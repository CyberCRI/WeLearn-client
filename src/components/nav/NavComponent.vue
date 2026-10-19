<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import AboutIcon from '@/components/icons/AboutIcon.vue';

import BookIcon from '@/components/icons/BookIcon.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import BaseNavItem from './BaseNavItem.vue';
import LanguageSelector from './LanguageSelector.vue';
import UserMenu from './UserMenu.vue';
import { useAuth } from '@/composables/useAuth';

const featureFlip = useFeatureFlipStore();
const { isAuthenticated } = useAuth();

// Features (tools) on the left; personal/utility items on the right.
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
  // bookmarks live in the user menu (UserMenu.vue)
  // ponytail: Help (HelpComponent) removed from nav, its instructions are obsolete; files kept for a future rewrite
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

        <!-- logged-in users pick the language on the profile page -->
        <LanguageSelector v-if="!isAuthenticated" />
        <div class="nav-auth mr-3">
          <UserMenu />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nav-auth {
  display: flex;
  margin: auto 0.75rem auto 0;
}

.nav-auth .button {
  position: relative;
  gap: 0.5rem;
}

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
  justify-content: space-between;

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

/* icon-only nav (in sync with AppHeader's 1330px): drop the top space kept for the full logo */
@media (max-width: 1330px) {
  .nav-items {
    padding-top: 0.05rem;
  }
  /* auth button goes icon-only like the nav items (label kept for screen readers, shown as tooltip) */
  .auth-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .nav-auth .button:hover .tltip,
  .nav-auth .button:focus-visible .tltip {
    display: block;
  }
}

@media (max-width: 640px) {
  .nav-auth {
    margin-right: 0.25rem;
  }
  .nav-auth .button {
    padding-inline: 0.25rem;
  }
}

@media (max-width: 768px) {
  .nav-items {
    width: 95%;
    margin: 0 auto;
  }
}
</style>
