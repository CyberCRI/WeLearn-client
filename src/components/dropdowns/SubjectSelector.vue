<script setup lang="ts">
import BaseDropdown from '@/components/dropdowns/BaseDropdown.vue';
import ClickableText from '@/components/ClickableText.vue';
import { onMounted, ref } from 'vue';
import { getAxios } from '@/utils/fetch';

defineProps<{
  storedSubject?: string;
  selectSubject: (subj: string) => void;
  clearSubject: () => void;
  isUp?: boolean;
}>();

const subjects = ref<null | Array<string>>(null)

const fetchAvailableSubjects = async () => {
  subjects.value = await getAxios('/micro_learning/subject_list')
};

onMounted(async () => {
  await fetchAvailableSubjects();
});
</script>

<template>
  <BaseDropdown
    v-slot="slotProps"
    :isUp="isUp"
    :title="storedSubject ? `Adapted to: ` : $t('selectSubject')"
    :subtitle="storedSubject ? $t(`subjects.${storedSubject}`) : undefined"
  >
    <p class="dropdown-item info">{{ $t('selectSubjectInfo') }}</p>
    <ClickableText
      class="dropdown-item"
      :text="$t('removeSelection')"
      :action="
        () => {
          clearSubject();
          slotProps.toggleVisibility();
        }
      "
    />
    <a
      :key="subject"
      @click="
        selectSubject(subject);
        slotProps.toggleVisibility();
      "
      v-for="subject in subjects"
      class="dropdown-item"
      :class="storedSubject === subject && 'is-active'"
    >
      {{ $t(`subjects.${subject}`) }}
    </a>
  </BaseDropdown>
</template>
<style scoped>
.info {
  font-size: 0.8rem;
  color: var(--neutral-80);
}

.info::before {
  content: 'ℹ️';
  margin-right: 0.5rem;
}
</style>
