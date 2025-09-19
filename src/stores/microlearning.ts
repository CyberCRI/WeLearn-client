import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useMicroLearningStore = defineStore('microlearning', ()=> {
  const step: Ref<number> = ref(1);
});
