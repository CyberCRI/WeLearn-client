<script setup lang="ts">
import ActivityForm from '@/components/activity/ActivityForm.vue';
import ActivityResult from '@/components/activity/ActivityResult.vue';
import { useActivityStore } from '@/stores/activityGenerator';

const store = useActivityStore();
</script>

<template>
  <div class="activity-page">
    <div class="form-panel">
      <ActivityForm />
    </div>
    <div class="result-panel" :class="{ visible: store.isGenerating || store.hasGenerated }">
      <ActivityResult />
    </div>
  </div>
</template>

<style scoped>
.activity-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.form-panel {
  flex: 0 0 360px;
  height: 100%;
  overflow-y: auto;
  padding: 0 1.5rem;
  border-right: 1px solid var(--neutral-20);
}

.result-panel {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 0 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.result-panel.visible {
  opacity: 1;
  pointer-events: auto;
}

@media screen and (max-width: 991px) {
  .activity-page {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
  }

  .form-panel {
    flex: none;
    border-right: none;
    border-bottom: 1px solid var(--neutral-20);
    padding-bottom: 1.5rem;
  }

  .result-panel {
    padding: 1.5rem;
  }

  .result-panel.visible {
    opacity: 1;
  }
}
</style>
