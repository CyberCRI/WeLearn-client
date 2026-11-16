<script setup lang="ts">
import { computed } from 'vue';
import AiNote from '@/components/tutor/AiNote.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import ReviewLine from '@/components/tutor/review/ReviewLine.vue';
import { useCourseStore } from '@/stores/course';
import { OVERVIEW_KEYS, type OverviewKey } from '@/utils/courseReview';
import { capitalise } from '@/utils/strings';

// the title, discipline and level WeLearn found, each correctable on its own line. what it did
// not find is offered by MissingOverview
const store = useCourseStore();

const foundKeys = computed(() => OVERVIEW_KEYS.filter((key) => store.teachingContext[key]));
// shared with MissingOverview: a value being added moves here as soon as it is typed
const editingKey = defineModel<OverviewKey | null>('editingKey', { default: null });

// a level is one of the quick choices (its label); a discipline shows with a capital, stored as
// the syllabus wrote it
const levelKey = (key: OverviewKey) =>
  key === 'level' ? `tutor.course.levels.${store.teachingContext.level}` : null;
const displayValue = (key: OverviewKey) => {
  const value = String(store.teachingContext[key] || '');
  return key === 'discipline' ? capitalise(value) : value;
};
</script>

<template>
  <ReviewLine
    v-for="key in foundKeys"
    :key="key"
    :label="$t(`tutor.course.fields.${key}`)"
    :data-testid="`overview-${key}`"
  >
    <template v-if="editingKey === key">
      <TeachingContext
        isPlain
        :keys="[key]"
        :context="store.teachingContext"
        :prefilled="store.prefilled"
        :updateContext="store.updateContext"
      />
      <ButtonComponent class="is-small mt-1" data-testid="done-overview" @click="editingKey = null">
        {{ $t('tutor.check.done') }}
      </ButtonComponent>
    </template>
    <template v-else>
      <EditButton
        class="line-action"
        :label="$t('tutor.check.editField', { field: $t(`tutor.course.fields.${key}`) })"
        data-testid="edit-overview"
        @click="editingKey = key"
      />
      <span data-testid="overview-value">{{
        levelKey(key) ? $t(levelKey(key)!) : displayValue(key)
      }}</span>
      <AiNote
        v-if="store.aiFilled.includes(key)"
        :label="$t('tutor.check.tag.check')"
        :detail="$t('tutor.course.readByAi')"
        data-testid="ai-filled"
      />
    </template>
  </ReviewLine>
</template>
