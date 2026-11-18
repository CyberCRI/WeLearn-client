<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ModalComponent from '@/components/ModalComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useAccountAccessStore } from '@/stores/accountAccess';

const accountAccess = useAccountAccessStore();
const { isNoticeOpen, accessUntilLabel } = storeToRefs(accountAccess);
</script>

<template>
  <!-- v-if: ModalComponent reads isOpen only once, so it is mounted each time it opens -->
  <ModalComponent
    v-if="isNoticeOpen"
    data-testid="limited-access"
    :title="$t('authentication.limitedAccess.title')"
    :message="
      accessUntilLabel
        ? $t('authentication.limitedAccess.message', { date: accessUntilLabel })
        : $t('authentication.limitedAccess.messageWithoutDate')
    "
    :isOpen="true"
    size="small"
    :onClose="accountAccess.closeNotice"
  >
    <template #actions>
      <ButtonComponent
        color="primary"
        data-testid="limited-access-ok"
        @click="accountAccess.closeNotice"
      >
        {{ $t('authentication.limitedAccess.ok') }}
      </ButtonComponent>
    </template>
  </ModalComponent>
</template>
