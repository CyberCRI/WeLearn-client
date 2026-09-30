<script setup lang="ts">
defineProps<{
  summaries: string[];
  files: Record<string, File>;
  updateSummary: (index: number, content: string) => void;
  action: () => void;
}>();
</script>
<template>
  <div class="summaries-section">
    <h2 data-testid="tutor-summaries-title" class="title is-4 is-size-5-mobile">
      {{ $t('tutor.summaryStep.title') }}
    </h2>
    <p class="subtitle is-6 mt-2">{{ $t('tutor.summaryStep.description') }}</p>

    <div class="field" v-for="(summary, index) in summaries" :key="index">
      <label class="label" :for="`summary_${index}`">
        {{
          Object.values(files)[index]?.name || $t('tutor.summaryStep.noFileName', { n: index + 1 })
        }}
      </label>
      <!-- ponytail: field-sizing grows the box natively; rows is the fallback for older browsers -->
      <textarea
        :id="`summary_${index}`"
        class="textarea summary"
        :rows="Math.max(3, Math.ceil(summary.length / 90))"
        :value="summary"
        @input="updateSummary(index, ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div class="is-flex is-justify-content-end mt-4">
      <button data-testid="tutor-search-button" class="button is-primary" @click="action()">
        {{ $t('tutor.summaryStep.action') }} →
      </button>
    </div>
  </div>
</template>
<style scoped>
.summaries-section {
  width: 100%;
}

.summary {
  field-sizing: content;
  min-height: 5rem;
}
</style>
