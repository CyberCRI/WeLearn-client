<script setup lang="ts">
import SearchIcon from '@/components/icons/SearchIcon.vue';
import AboutIcon from '@/components/icons/AboutIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import HelpComponent from '@/components/HelpComponent.vue';
import { ref } from 'vue';
import i18n from '@/localisation/i18n';
import BookIcon from '@/components/icons/BookIcon.vue';
import NavBookmarkIcon from '@/components/icons/NavBookmarkIcon.vue';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import { useMetricsStore } from '@/stores/metrics';

const featureFlip = useFeatureFlipStore();
const metricStore = useMetricsStore();
const isFeatureEnabled = featureFlip.isFeatureEnabled('tutor');
const isFeatureEnabledMicrolearning = featureFlip.isFeatureEnabled('microlearning');
const isWorkshopFeatureEnabled = featureFlip.isWorkshopFeatureEnabled();

const isNavOpened = ref<boolean>(false);

const handle_nav_bookmarks = () => {
  isNavOpened.value = false;
};
</script>
<template>
  <div class="nav" :class="isNavOpened && 'open'">
    <div class="nav-items" :class="isNavOpened && 'open'">
      <div class="link-wrapper">
        <router-link
          class="router-link"
          to="/q-and-a"
          @click="isNavOpened = false"
          data-testid="nav-chat"
        >
          <div class="icon mr-2">
            <QnAIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{ $t('nav.chat') }}</span>
        </router-link>
      </div>

      <div class="link-wrapper" v-if="isFeatureEnabled">
        <router-link
          class="router-link"
          to="/tutor"
          @click="isNavOpened = false"
          data-testid="nav-tutor"
        >
          <div class="icon mr-2">
            <BookIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('nav.syllabus')
          }}</span>
        </router-link>
      </div>

      <div class="link-wrapper" v-if="isFeatureEnabledMicrolearning">
        <router-link
          class="router-link"
          to="/microlearning"
          @click="isNavOpened = false"
          data-testid="nav-microlearning"
        >
          <div class="icon mr-2">
            <LinesLeaningIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('nav.microlearning')
          }}</span>
        </router-link>
      </div>

      <div class="link-wrapper">
        <router-link
          class="router-link"
          to="/search"
          @click="isNavOpened = false"
          data-testid="nav-search"
        >
          <div class="icon mr-2">
            <SearchIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('nav.search')
          }}</span>
        </router-link>
      </div>
      <div class="link-wrapper is-relative">
        <router-link
          class="router-link"
          to="/bookmarks"
          @click="handle_nav_bookmarks"
          data-testid="nav-bookmarks"
        >
          <div class="icon mr-2">
            <NavBookmarkIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('nav.bookmarks')
          }}</span>
        </router-link>
      </div>

      <div class="link-wrapper mr-6">
        <router-link
          class="router-link"
          to="/about"
          @click="isNavOpened = false"
          data-testid="nav-about"
        >
          <div class="icon mr-2">
            <AboutIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('nav.about')
          }}</span>
        </router-link>
      </div>
      <a
        class="mx-0 px-0"
        v-if="isWorkshopFeatureEnabled"
        target="_blank"
        :href="metricStore.getWorkshopFormUrl"
      >
        <span class="item-name router-link-form has-text-success mx-1 px-1 pr-4 is-size-6">{{
          $t('nav.workshopForm')
        }}</span>
      </a>

      <div class="nav-langs" :class="isNavOpened && 'open'">
        <a
          class="nav-lang"
          @click="i18n.global.locale.value = 'fr'"
          :class="i18n.global.locale.value === 'fr' && 'selected'"
          >{{ $t('lang.fr') }}</a
        >
        <a
          class="nav-lang"
          @click="i18n.global.locale.value = 'en'"
          :class="i18n.global.locale.value === 'en' && 'selected'"
          >{{ $t('lang.en') }}</a
        >
      </div>
      <HelpComponent />
    </div>
  </div>
</template>
<style scoped>
.nav {
  display: flex;
  z-index: 2;
  border-bottom: 1px solid var(--neutral-20);
}

.icon {
  position: relative;
}

.nav-langs {
  opacity: 0;
}

.nav-langs.open {
  opacity: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 2rem;
  transition: opacity 0.5s ease-in-out;
}

.nav-lang {
  all: unset;
  cursor: pointer;
  border-bottom: 1px solid var(--neutral-20);
  padding: 0.25rem;

  &:hover {
    font-weight: 800;
  }
}

.nav-lang.selected {
  font-weight: 800;
}

.nav-items {
  position: absolute;
  opacity: 0;
  width: 0rem;
  height: 0rem;

  & > * {
    display: none;
  }
}

.router-link {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.2rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  width: calc(100% - 2rem);
  flex-wrap: nowrap;
  white-space: nowrap;
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

.router-link-active {
  margin-bottom: 1rem;
  background-color: var(--neutral-20);
}

.item-name {
  width: 0rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  flex-wrap: nowrap;
}

.item-name.visible-name {
  display: block;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.1s linear;
}

@media screen and (min-width: 992px) {
  .nav {
    width: 100%;
    padding: 0rem;
  }

  .toggler {
    display: none;
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

  .item-name {
    display: default;
    visibility: visible;
    opacity: 1;
    width: auto;
    white-space: nowrap;
    flex-wrap: nowrap;
  }

  .link-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    padding-bottom: 0.25rem;
    & > * {
      display: flex;
    }
  }

  .link-wrapper:has(.router-link-active) {
    border-bottom: 2px solid var(--tertiary);
  }

  .router-link {
    all: unset;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    display: flex;
    font-size: 0.9rem;

    gap: 0.5rem;
    cursor: pointer;
    margin: 0 0.5rem;
    width: auto;
    &:hover {
      background-color: var(--neutral-15);
    }
  }

  .nav-langs {
    all: unset;
    flex-direction: row;
    justify-self: flex-end;
    margin-top: auto;
    font-size: 0.75rem;
    margin-left: auto;
  }
}
</style>
