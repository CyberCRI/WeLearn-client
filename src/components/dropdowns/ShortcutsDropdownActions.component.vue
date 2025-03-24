<script setup lang="ts">
import ClickableText from '@/components/ClickableText.vue';

defineProps<{ selectAllAction: () => {}; removeAllAction: () => {} }>();
</script>
<template>
  <div class="shortcuts">
    <ClickableText class="dropdown-item" :text="$t('selectAll')" :action="selectAllAction" />
    <ClickableText :text="$t('removeSelection')" :action="removeAllAction" class="dropdown-item" />
  </div>
</template>
<style scoped>
.shortcuts {
  display: flex;
  width: fit-content;
}
</style>
