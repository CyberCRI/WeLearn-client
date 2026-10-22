<script setup lang="ts">
// top of every teacher mock page: the "Preview" notice, then the teacher's question and the
// objective kept in a small design note, so the page reads as the product, not a specification.
// without a question and an objective, only the notice is shown
defineProps<{ question?: string; objective?: string }>();
</script>
<template>
  <div class="preview-intro">
    <p class="tag is-warning is-light is-medium" data-testid="preview-notice">
      {{ $t('journey.teach.previewNotice') }}
    </p>
    <aside v-if="question && objective" class="design-note mt-4" data-testid="design-note">
      <p class="design-note-title">{{ $t('journey.teach.designNote') }}</p>
      <dl>
        <dt>{{ $t('journey.teach.question') }}</dt>
        <dd>{{ question }}</dd>
        <dt>{{ $t('journey.teach.objective') }}</dt>
        <dd>{{ objective }}</dd>
      </dl>
    </aside>
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

.design-note {
  max-width: 40rem;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--neutral-20);
  border-radius: 4px;
  background: var(--neutral-10);
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.design-note-title {
  font-weight: 700;
  color: var(--neutral-80);
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 0.75rem;
  margin-top: 0.4rem;
}

dt {
  font-weight: 600;
}

@media (max-width: 600px) {
  dl {
    grid-template-columns: 1fr;
  }
}
</style>
