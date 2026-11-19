<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ReviewField from '@/components/tutor/ReviewField.vue';
import { useCourseStore } from '@/stores/course';
import { itemsOf } from '@/utils/courseReview';
import type { ObjectiveGroup } from '@/types';

// the objectives being corrected: course objectives and competencies, each item editable,
// removable and movable to another group. degree-level objectives are kept aside, never used for
// this course unless the teacher moves one back
const emit = defineEmits<{ done: [] }>();

const store = useCourseStore();
const GROUPS: ObjectiveGroup[] = ['objective', 'competency', 'programme'];

const groups = computed(() =>
  (['objective', 'competency'] as const).map((group) => ({
    group,
    items: itemsOf(store.courseObjectives, group)
  }))
);
const programmeItems = computed(() => itemsOf(store.courseObjectives, 'programme'));

const valueOf = (e: Event) => (e.target as HTMLSelectElement).value as ObjectiveGroup;
</script>

<template>
  <div
    v-for="{ group, items } in groups"
    :key="group"
    class="group"
    :data-testid="`group-${group}`"
  >
    <p class="group-title">{{ $t(`tutor.check.groups.${group}`) }}</p>
    <ol class="objectives">
      <li v-for="{ field, index } in items" :key="index" data-testid="objective">
        <ReviewField
          :field="field"
          canRemove
          :editLabel="$t('tutor.check.editObjective')"
          @save="(value: string) => store.setObjective(index, value)"
          @restore="store.restoreObjective(index)"
          @remove="store.removeObjective(index)"
        >
          <template #actions>
            <div class="select is-small move">
              <select
                :value="field.group || 'objective'"
                :aria-label="$t('tutor.check.moveTo')"
                data-testid="move-objective"
                @change="store.setGroup(index, valueOf($event))"
              >
                <option v-for="target in GROUPS" :key="target" :value="target">
                  {{ $t(`tutor.check.groups.${target}`) }}
                </option>
              </select>
            </div>
          </template>
        </ReviewField>
      </li>
    </ol>
    <ReviewField
      :key="store.courseObjectives.length"
      :field="null"
      :addLabel="
        '+ ' +
        (group === 'objective' ? $t('tutor.check.addObjective') : $t('tutor.check.addCompetency'))
      "
      :data-testid="`add-${group}`"
      @save="(value: string) => store.addObjective(value, group)"
    />
  </div>

  <details v-if="programmeItems.length" class="sub-part" data-testid="group-programme">
    <summary>{{ $t('tutor.check.programmeAside', { n: programmeItems.length }) }}</summary>
    <p class="muted mb-2">{{ $t('tutor.check.programmeAsideHint') }}</p>
    <ul class="aside-list">
      <li v-for="{ field, index } in programmeItems" :key="index">
        <span>{{ field.value }}</span>
        <ButtonComponent
          is-discreet
          class="is-small"
          data-testid="move-to-course"
          @click="store.setGroup(index, 'objective')"
        >
          {{ $t('tutor.check.moveToCourse') }}
        </ButtonComponent>
      </li>
    </ul>
  </details>

  <ButtonComponent class="is-small edit-list" data-testid="done-objectives" @click="emit('done')">
    {{ $t('tutor.check.done') }}
  </ButtonComponent>
</template>

<style scoped>
.group + .group {
  margin-top: 1.25rem;
}

.group-title {
  margin-bottom: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--neutral-80);
}

.objectives {
  margin: 0 0 0.5rem 1.25rem;
  li + li {
    margin-top: 0.75rem;
  }
}

.move select {
  font-size: 0.75rem;
}

.sub-part {
  margin-top: 1rem;
  summary {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.aside-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.edit-list {
  margin-top: 0.75rem;
}
</style>
