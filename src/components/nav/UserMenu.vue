<script setup lang="ts">
import UserIcon from '@/components/icons/UserIcon.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import { useAuth } from '@/composables/useAuth';
import { useFeatureFlipStore } from '@/stores/featureFlip';

const { isAuthenticated, userName, login, logout } = useAuth();
const isBookmarksEnabled = useFeatureFlipStore().isFeatureEnabled('bookmarks');
</script>

<template>
  <div class="dropdown is-hoverable is-right" data-testid="user-menu">
    <div class="dropdown-trigger">
      <button
        class="button is-text trigger"
        aria-haspopup="true"
        aria-controls="user-menu"
        :aria-label="isAuthenticated ? userName : $t('login')"
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
          <router-link to="/profile" class="dropdown-item" data-testid="user-menu-profile">
            {{ $t('nav.profile') }}
          </router-link>
          <router-link
            v-if="isBookmarksEnabled"
            to="/bookmarks"
            class="dropdown-item"
            data-testid="user-menu-bookmarks"
          >
            {{ $t('nav.bookmarks') }}
          </router-link>
          <button
            class="dropdown-item item-button"
            data-testid="user-menu-logout"
            @click="logout()"
          >
            <span>{{ $t('logout') }}</span>
            <span class="icon is-small">
              <LogoutIcon />
            </span>
          </button>
        </template>
        <template v-else>
          <span
            v-if="isBookmarksEnabled"
            class="dropdown-item is-disabled"
            aria-disabled="true"
            :title="$t('profile.bookmarksLoginRequired')"
            data-testid="user-menu-bookmarks"
          >
            {{ $t('nav.bookmarks') }}
          </span>
          <button class="dropdown-item item-button" data-testid="user-menu-login" @click="login()">
            {{ $t('login') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-disabled {
  color: var(--neutral-50);
  cursor: not-allowed;
}

/* keyboard users get the menu too, not only mouse hover */
.dropdown:focus-within .dropdown-menu {
  display: block;
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
