<script setup lang="ts">
// top of every teacher mock page: the "Preview" notice, the teacher's question and the objective
defineProps<{ question: string; objective: string }>();
</script>
<template>
  <div class="preview-intro">
    <p class="tag is-warning is-light is-medium" data-testid="preview-notice">
      {{ $t('journey.teach.previewNotice') }}
    </p>
    <dl class="mt-4">
      <dt>{{ $t('journey.teach.question') }}</dt>
      <dd class="question">{{ question }}</dd>
      <dt class="mt-3">{{ $t('journey.teach.objective') }}</dt>
      <dd>{{ objective }}</dd>
    </dl>
  </div>
</template>

<style scoped>
.preview-intro {
  margin-top: 1.5rem;
}

.tag {
  white-space: normal;
  height: auto;
}

dt {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-70);
}

dd {
  margin-top: 0.25rem;
  max-width: 44rem;
}

.question {
  font-size: 1.1rem;
  font-style: italic;
}
</style>
