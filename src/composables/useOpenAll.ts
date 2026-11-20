import { computed, ref, type Ref } from 'vue';

// one item open at a time (opening another closes the first); onAllOpened fires once every item
// has been opened at least once, which is what unlocks "next" in the learn steps
export function useOpenAll<K>(total: () => number, onAllOpened: () => void) {
  const openKey = ref(null) as Ref<K | null>;
  const opened = ref(new Set<K>()) as Ref<Set<K>>;
  const isAllOpened = computed(() => opened.value.size === total());

  function handleToggle(key: K) {
    openKey.value = openKey.value === key ? null : key;
    opened.value.add(key);
    if (isAllOpened.value) onAllOpened();
  }

  return { openKey, opened, isAllOpened, handleToggle };
}
