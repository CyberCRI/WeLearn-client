<script setup lang="ts">
import HelpIcon from '@/components/icons/HelpIcon.vue';
import { ref, watch } from 'vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import HelpComponentContent from '@/components/HelpComponentContent.vue';
import { HELP_USER } from '@/utils/constants';
import { useRoute } from 'vue-router';

const route = useRoute();
const openModal = ref(false);
const instructions = ref([]);
const toggleModal = () => {
  if (!instructions.value.length) return;
  openModal.value = !openModal.value;
};

watch(
  () => route.path.split('/')[1],
  async (path) => {
    instructions.value = HELP_USER[path] || [];
  }
);
</script>
<template>
  <div>
    <div class="link-wrapper" :class="{ disabled: !instructions.length }" @click="toggleModal">
      <div class="icon mr-2">
        <HelpIcon />
      </div>
      <span class="item-name">{{ $t('nav.help') }}</span>
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
.icon {
  position: relative;
}

.link-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  padding-bottom: 0.25rem;
  & > * {
    display: flex;
  }
}
.item-name {
  display: default;
  visibility: visible;
  white-space: nowrap;
  opacity: 1;
  width: auto;
}
.link-wrapper:hover {
  background-color: var(--neutral-10);
  cursor: pointer;
}

.link-wrapper.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
