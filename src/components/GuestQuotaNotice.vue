<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ClickableText from '@/components/ClickableText.vue';
import { useAuthStore } from '@/stores/auth';
import { GUEST_LIMITS, useGuestQuotaStore } from '@/stores/guestQuota';
import { track } from '@/utils/analytics';
import type { GuestQuotaFeature } from '@/types';

const props = defineProps<{
  feature: GuestQuotaFeature;
}>();

const router = useRouter();
const authStore = useAuthStore();
const guestQuota = useGuestQuotaStore();

const remaining = computed(() => guestQuota.remaining(props.feature));

const handleCreateAccount = () => {
  track('Guest Quota Notice Clicked', { feature: props.feature, remaining: remaining.value });
  router.push('/register');
};
</script>

<template>
  <p
    v-if="authStore.isGuest"
    class="guest-quota is-size-7"
    :class="{ 'is-used-up': remaining === 0 }"
    data-testid="guest-quota-notice"
  >
    <span data-testid="guest-quota-text">
      {{
        $t(
          `authentication.guestQuota.${feature}`,
          { n: remaining, limit: GUEST_LIMITS[feature] },
          remaining
        )
      }}
    </span>
    <ClickableText
      :text="$t('authentication.guestQuota.createAccount')"
      :action="handleCreateAccount"
    />
  </p>
</template>

<style scoped>
.guest-quota {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0 0.25rem;
  color: var(--neutral-80);
  text-align: center;
}

.guest-quota :deep(a) {
  width: auto;
  padding: 0;
}

.is-used-up {
  font-weight: 600;
}
</style>
