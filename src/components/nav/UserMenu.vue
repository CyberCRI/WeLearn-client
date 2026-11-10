<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import UserIcon from '@/components/icons/UserIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import { useAuth } from '@/composables/useAuth';
import { useFeatureFlipStore } from '@/stores/featureFlip';

import { useAuthStore } from '@/stores/auth';

const { isAuthenticated, userName, login, logout } = useAuth();
const { askToSignUp } = useAuthStore();
const isBookmarksEnabled = useFeatureFlipStore().isFeatureEnabled('bookmarks');

// driven by state, not :hover / :focus-within, so choosing an item closes the menu
const isOpen = ref(false);
const dropdownElement = ref<HTMLElement>();
const triggerElement = ref<HTMLButtonElement>();

const toggle = () => (isOpen.value = !isOpen.value);
const close = () => (isOpen.value = false);

const handleItemClick = (action?: () => void) => {
  close();
  action?.();
};

const handleClickOutside = ({ target }: MouseEvent) => {
  if (isOpen.value && !dropdownElement.value?.contains(target as Node)) close();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !isOpen.value) return;
  close();
  triggerElement.value?.focus();
};

// tabbing out of the menu closes it, as the old :focus-within did
const handleFocusOut = ({ relatedTarget }: FocusEvent) => {
  if (relatedTarget && !dropdownElement.value?.contains(relatedTarget as Node)) close();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    class="dropdown is-right"
    :class="{ 'is-active': isOpen }"
    data-testid="user-menu"
    ref="dropdownElement"
    @focusout="handleFocusOut"
  >
    <div class="dropdown-trigger">
      <button
        ref="triggerElement"
        type="button"
        class="button is-text trigger"
        aria-haspopup="true"
        aria-controls="user-menu"
        :aria-expanded="isOpen"
        :aria-label="isAuthenticated ? userName : $t('login')"
        data-testid="user-menu-trigger"
        @click="toggle"
      >
        <span class="icon">
          <UserIcon />
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="user-menu" role="menu">
      <div class="dropdown-content">
        <template v-if="isAuthenticated">
          <p class="dropdown-item has-text-weight-semibold">{{ userName }}</p>
          <hr class="dropdown-divider" />
          <router-link
            to="/profile"
            class="dropdown-item"
            data-testid="user-menu-profile"
            @click="handleItemClick()"
          >
            {{ $t('nav.profile') }}
          </router-link>
          <router-link
            v-if="isBookmarksEnabled"
            to="/bookmarks"
            class="dropdown-item"
            data-testid="user-menu-bookmarks"
            @click="handleItemClick()"
          >
            {{ $t('nav.bookmarks') }}
          </router-link>
          <button
            type="button"
            class="dropdown-item item-button"
            data-testid="user-menu-logout"
            @click="handleItemClick(logout)"
          >
            <span>{{ $t('logout') }}</span>
            <span class="icon is-small">
              <LogoutIcon />
            </span>
          </button>
        </template>
        <template v-else>
          <button
            v-if="isBookmarksEnabled"
            type="button"
            class="dropdown-item item-button is-locked"
            data-testid="user-menu-bookmarks"
            @click="handleItemClick(() => askToSignUp('bookmarks'))"
          >
            {{ $t('nav.bookmarks') }}
          </button>
          <router-link
            to="/register"
            class="dropdown-item"
            data-testid="user-menu-signup"
            @click="handleItemClick()"
          >
            {{ $t('authentication.signupPrompt.createAccount') }}
          </router-link>
          <button
            type="button"
            class="dropdown-item item-button"
            data-testid="user-menu-login"
            @click="handleItemClick(login)"
          >
            {{ $t('login') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-locked {
  color: var(--neutral-50);
}

.trigger .icon {
  width: 1.5rem;
  height: 1.5rem;
}

.item-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-10);
  }
}
</style>
