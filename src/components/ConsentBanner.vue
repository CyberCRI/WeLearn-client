<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
</script>

<template>
  <section
    v-if="user.shouldAskAnalyticsConsent"
    class="consent-banner"
    role="dialog"
    aria-labelledby="consent-title"
    data-testid="consent-banner"
  >
    <div class="consent-content">
      <p id="consent-title" class="has-text-weight-bold mb-1">{{ $t('consent.title') }}</p>
      <p class="is-size-7">
        {{ $t('consent.text') }}
        <router-link to="/terms">{{ $t('consent.policyLink') }}</router-link>
      </p>
    </div>
    <!-- CNIL: refusing must be as easy and as visible as accepting -->
    <div class="buttons consent-actions">
      <ButtonComponent
        color="primary"
        data-testid="consent-refuse"
        @click="user.setAnalyticsConsent(false)"
      >
        {{ $t('consent.refuse') }}
      </ButtonComponent>
      <ButtonComponent
        color="primary"
        data-testid="consent-accept"
        @click="user.setAnalyticsConsent(true)"
      >
        {{ $t('consent.accept') }}
      </ButtonComponent>
    </div>
  </section>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  /* above the welcome modal, so both stay usable */
  z-index: 50;
  width: min(48rem, calc(100% - 2rem));
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: var(--neutral-0);
  border: 1px solid var(--neutral-20);
  border-radius: 0.4rem;
}

.consent-content {
  flex: 1;
}

.consent-actions {
  flex-wrap: nowrap;
  margin-bottom: 0;
}

@media (max-width: 650px) {
  .consent-banner {
    flex-direction: column;
    align-items: stretch;
  }

  .consent-actions {
    justify-content: stretch;
  }

  .consent-actions .button {
    flex: 1;
  }
}
</style>
