<script setup lang="ts">
import HelpIcon from '@/components/icons/HelpIcon.vue';
import { ref, watch } from 'vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import HelpComponentContent from '@/components/HelpComponentContent.vue';
import { HELP_USER } from '@/utils/constants';
import { useRoute } from 'vue-router';
import BaseNavItem from './BaseNavItem.vue';

type HelpUserKey = keyof typeof HELP_USER;
type HelpUserValue = (typeof HELP_USER)[HelpUserKey];

const route = useRoute();
const openModal = ref(false);
const instructions = ref<HelpUserValue>([]);
const toggleModal = () => {
  if (!instructions.value.length) return;
  openModal.value = !openModal.value;
};

watch(
  () => route.path.split('/')[1],
  async (path) => {
    instructions.value = HELP_USER[path as HelpUserKey] || [];
  }
);
</script>
<template>
  <div>
    <div class="none" :class="{ disabled: !instructions.length }">
      <BaseNavItem to="" name="help" :icon="HelpIcon" neverActive @click="toggleModal" />
    </div>
    <ModalWrapper :isOpen="openModal" :onClose="toggleModal">
      <HelpComponentContent
        v-if="instructions.length"
        :stepsContent="instructions"
        :modalState="openModal"
        :toggleModal="toggleModal"
      />
    </ModalWrapper>
  </div>
</template>

<style scoped>
.none {
  display: flex;
  align-items: center;
  justify-content: center;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
