<script setup lang="ts">
import HamburgerMenu from '@/components/icons/HamburgerMenu.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import QnAIcon from '@/components/icons/QnAIcon.vue';
import OnboardingTooltip from '@/components/OnboardingTooltip.vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import i18n from '@/localisation/i18n';
import BookIcon from './icons/BookIcon.vue';

const user = useUserStore();

const isNavOpened = ref<boolean>(false);

const handle_nav_bookmarks = () => {
  isNavOpened.value = false;
  user.updateSearchState('CHECK_BOOKMARK');
};
</script>
<template>
  <div class="nav" :class="isNavOpened && 'open'">
    <div class="toggler" @click="isNavOpened = !isNavOpened">
      <HamburgerMenu />
    </div>

    <div class="nav-items" :class="isNavOpened && 'open'">
      <div class="link-wrapper">
        <router-link
          class="router-link"
          to="/q-and-a"
          @click="isNavOpened = false"
          data-testid="nav-chat"
        >
          <div class="icon">
            <QnAIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{ $t('chat') }}</span>
        </router-link>
      </div>
      <div class="link-wrapper">
        <router-link
          class="router-link"
          to="/search"
          @click="isNavOpened = false"
          data-testid="nav-search"
        >
          <div class="icon">
            <SearchIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{ $t('search') }}</span>
        </router-link>
      </div>
      <div class="link-wrapper is-relative">
        <OnboardingTooltip
          v-if="
            user.onboardingSearch.state === 'incomplete' &&
            user.onboardingSearch.step === 'CHECK_BOOKMARK'
          "
          :description="$t('onboarding.results.CHECK_BOOKMARK')"
          :onClose="() => user.updateSearchState('CHECK_BOOKMARK', true)"
          :onNext="() => user.updateSearchState('CHECK_BOOKMARK')"
          :buttonText="$t('gotIt')"
        />
        <router-link
          class="router-link"
          to="/bookmarks"
          @click="handle_nav_bookmarks"
          data-testid="nav-bookmarks"
        >
          <div class="icon">
            <BookIcon />
          </div>
          <span class="item-name" :class="isNavOpened && 'visible-name'">{{
            $t('bookmarks')
          }}</span>
        </router-link>
      </div>
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
    </div>
  </div>
</template>
<style scoped>
.nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  border-bottom: 1px solid var(--neutral-20);
}

.icon {
  position: relative;
}

.toggler {
  width: 100%;
  text-align: center;
  cursor: pointer;
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

.nav-items.open {
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 0.75rem;
  padding: 2.5rem 0;
  top: 3rem;
  right: 1rem;
  background-color: var(--neutral-0);
  border: 1px solid var(--neutral-20);
  z-index: 2;
  width: 12rem;
  height: 15.3875rem;
  transition:
    opacity 0.1s linear,
    width 0.2s linear,
    height 0.1s linear;

  & > * {
    display: flex;
  }
}

.router-link {
  all: unset;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  width: calc(100% - 2rem);
}

.router-link-active {
  margin-bottom: 1rem;
  background-color: var(--neutral-20);
}

.item-name {
  width: 0rem;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.item-name.visible-name {
  display: block;
  visibility: visible;
  opacity: 1;
  transition: opacity 0.1s linear;
}

@media screen and (min-width: 992px) {
  .nav {
    flex-grow: 1;
    gap: 0.75rem;
    padding: 0rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1rem;
    margin-left: 2rem;
    margin-right: 2rem;
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
