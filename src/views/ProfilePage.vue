<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import LogoutIcon from '@/components/icons/LogoutIcon.vue';
import UserIcon from '@/components/icons/UserIcon.vue';
import LanguageSelector from '@/components/nav/LanguageSelector.vue';
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated, user, userName, login, logout } = useAuth();

const email = computed(() => user.value?.email);
</script>

<template>
  <div class="profile py-6">
    <h1 class="title is-size-3 is-size-4-mobile">{{ $t('profile.title') }}</h1>

    <div v-if="isAuthenticated" class="profile-card p-5">
      <div class="profile-header mb-5">
        <span class="avatar-icon">
          <UserIcon />
        </span>
      </div>

      <dl class="profile-info">
        <dt class="has-text-weight-semibold">{{ $t('profile.name') }}</dt>
        <dd data-testid="profile-name">{{ userName }}</dd>
        <dt class="has-text-weight-semibold">{{ $t('profile.email') }}</dt>
        <dd data-testid="profile-email">{{ email || $t('profile.notAvailable') }}</dd>
        <dt class="has-text-weight-semibold">{{ $t('profile.language') }}</dt>
        <dd><LanguageSelector /></dd>
      </dl>

      <ButtonComponent class="mt-5" data-testid="profile-logout" @click="logout()">
        <span class="mr-2">{{ $t('logout') }}</span>
        <span class="icon is-small">
          <LogoutIcon />
        </span>
      </ButtonComponent>
    </div>

    <div v-else class="profile-card p-5">
      <p class="mb-4">{{ $t('profile.notAuthenticated') }}</p>
      <ButtonComponent color="primary" data-testid="profile-login" @click="login()">
        {{ $t('login') }}
      </ButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.profile {
  width: 60%;
  max-width: 40rem;
  margin: auto;
}

.profile-card {
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-icon {
  display: flex;
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: var(--neutral-15);
}

.profile-info {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 0.75rem 2rem;
}

.profile-info dd {
  overflow-wrap: anywhere;
}

@media (max-width: 767px) {
  .profile {
    width: 90%;
  }
}
</style>
