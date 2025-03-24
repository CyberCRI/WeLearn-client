<script setup lang="ts">
import { onBeforeMount } from 'vue';
import BaseDropdown from '@/components/dropdowns/BaseDropdown.vue';
import CheckboxCompnentVue from '@/components/CheckboxCompnent.vue';
import ShortcutsDropdownActions from '@/components/dropdowns/ShortcutsDropdownActions.component.vue';
import FlagIcon from '@/components/icons/FlagsIcons.vue';
import { useSearchStore } from '@/stores/search';
import { useChatStore } from '@/stores/chat';

const props = defineProps<{ isUp?: boolean; context?: string }>();
const store = props.context === 'chat' ? useChatStore() : useSearchStore();

onBeforeMount(() => {
  store.getCorpus();
});
</script>
<template>
  <BaseDropdown
    :title="`${
      store.selectedCorpus.length
        ? store.selectedCorpus.length > 1
          ? $t('selectedSource', 2)
          : $t('selectedSource', 1)
        : $t('filterBySource')
    }`"
    :subtitle="
      !!store.selectedCorpus.length
        ? store.selectedCorpus.map((e) => $t(`corpus.${e}`, e)).join(', ')
        : undefined
    "
    :isUp="isUp"
  >
    <ShortcutsDropdownActions
      :selectAllAction="() => (store.selectedCorpus = store.corpora.map((corpa) => corpa.name))"
      :removeAllAction="() => (store.selectedCorpus = [])"
    />
    <div class="dropdown-item" :key="corpa.name" v-for="corpa in store.corpora">
      <CheckboxCompnentVue
        :name="corpa.name"
        :id="corpa.name"
        v-model="store.selectedCorpus"
        :value="corpa.name"
        :label="`${$t(
          `corpus.${corpa.name.replace('-', ' ')}`,
          `${corpa.name.replace('-', ' ')}`
        )}`"
        :checked="store.selectedCorpus.includes(corpa.name)"
        isCapitalized
      >
        <template #test>
          <span v-for="lang in corpa.lang" :key="lang" class="lang">
            <FlagIcon :lang="lang" />
          </span>
        </template>
      </CheckboxCompnentVue>
    </div>
  </BaseDropdown>
</template>
