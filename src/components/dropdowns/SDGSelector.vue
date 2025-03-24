<script setup lang="ts">
import BaseDropdown from '@/components/dropdowns/BaseDropdown.vue';
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
// import ClickableText from '@/components/ClickableText.vue';
import ShortcutsDropdownActions from '@/components/dropdowns/ShortcutsDropdownActions.component.vue';
import { useSearchStore } from '@/stores/search';
import { SDGs } from '@/components/SDG';
import { useChatStore } from '@/stores/chat';

const props = defineProps<{ isUp?: boolean; context?: string }>();
const store = props.context === 'chat' ? useChatStore() : useSearchStore();
</script>
<template>
  <BaseDropdown
    :title="`${
      store.sdgFilters.length
        ? store.sdgFilters.length > 1
          ? $t('filteredBySDG', 2)
          : $t('filteredBySDG', 1)
        : $t('filterSDG')
    }`"
    :subtitle="!!store.sdgFilters.length ? store.sdgFilters.join(', ') : undefined"
    :isUp="isUp"
  >
    <ShortcutsDropdownActions
      :selectAllAction="
        () => (store.sdgFilters = Array.from({ length: SDGs.length - 1 }, (_, i) => i + 1))
      "
      :removeAllAction="() => (store.sdgFilters = [])"
    />
    <div class="dropdown-item" :key="sdg" v-for="(sdg, index) in SDGs">
      <CheckboxCompnentVue
        :name="sdg + index"
        :id="sdg + index"
        :label="`${(index as number) + 1} - ${$t(`sdgs.${(index as number) + 1}`)}`"
        :value="`${(index as number) + 1}`"
        :checked="store.sdgFilters?.includes((index as number) + 1)"
        @select-all="() => index !== SDGs.length - 1 && store.toggleFilter(index)"
        :isDisabled="index === SDGs.length - 1"
      />
    </div>
  </BaseDropdown>
</template>
