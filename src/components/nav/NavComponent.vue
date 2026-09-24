<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';
import AboutIcon from '@/components/icons/AboutIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import HelpComponent from '@/components/nav/HelpComponent.vue';

import BookIcon from '@/components/icons/BookIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import NavBookmarkIcon from '@/components/icons/NavBookmarkIcon.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import BaseNavItem from './BaseNavItem.vue';
import LanguageSelector from './LanguageSelector.vue';
import { useAuth } from '@/composables/useAuth';

const featureFlip = useFeatureFlipStore();
const { isAuthenticated, userName, login, logout } = useAuth();

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
      <div>
        <div v-for="entry in navEntries" :key="entry.name">
          <BaseNavItem
            v-if="entry.isFeatureEnabled"
            :to="entry.to"
            :name="entry.name"
            :icon="entry.icon"
          />
        </div>
        <HelpComponent />
      </div>
      <div>
        <LanguageSelector />

        <div class="nav-auth mr-3 mb-3">
          <template v-if="isAuthenticated">
            <button
              class="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              @click="logout()"
            >
              <span class="mr-2 logout-label">{{ $t('logout') }}</span>
              <span class="icon is-small">
                <LogoutIcon />
              </span>
            </button>
          </template>
          <template v-else>
            <button @click="login()" class="btn-login">{{ $t('login') }}</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.nav-auth {
  display: flex;
  margin: auto;
  gap: 1rem;
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

@media (max-width: 1300px) {
  .logout-label {
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
