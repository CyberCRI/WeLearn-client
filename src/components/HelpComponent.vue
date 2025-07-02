<script setup lang="ts">
import HelpIcon from '@/components/icons/HelpIcon.vue';
import { ref } from 'vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import HelpComponentContent from '@/components/HelpComponentContent.vue';

const openModal = ref(false);
const path = ref('');
const toggleModal = () => {
  path.value = window.location.pathname.split('/')[1];
  openModal.value = !openModal.value;
};

const toto = {
  'q-and-a': [
    {
      title: 'help.step1.title',
      description: 'help.step1.description'
    },
    {
      title: 'help.step2.title',
      description: 'help.step2.description',
      image: 'https://example.com/step2.png'
    },
    {
      title: 'help.step3.title',
      image: 'https://example.com/step3.png'
    }
  ],
  tutor: [
    {
      title: 'help.tutor.step1.title',
      description: 'help.tutor.step1.description'
    },
    {
      title: 'help.tutor.step2.title',
      description: 'help.tutor.step2.description',
      image: 'https://example.com/tutor-step2.png'
    },
    {
      title: 'help.tutor.step3.title',
      image: 'https://example.com/tutor-step3.png'
    }
  ]
};
</script>
<template>
  <div>
    <div class="link-wrapper is-clickable" @click="toggleModal">
      <div class="icon mr-2">
        <HelpIcon />
      </div>
      <span class="item-name">{{ $t('nav.help') }}</span>
    </div>
    <ModalWrapper :isOpen="openModal" :onClose="toggleModal">
      <HelpComponentContent v-if="path" :stepsContent="toto[path]" :modalState="openModal" />
    </ModalWrapper>
  </div>
</template>

<style scoped>
.icon {
  position: relative;
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
.item-name {
  display: default;
  visibility: visible;
  opacity: 1;
  width: auto;
}
</style>
