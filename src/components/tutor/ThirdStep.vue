<script setup lang="ts">
defineProps<{
  visible?: boolean;
}>();
</script>
<template>
  <div class="wrapper" :class="{ visible: visible }">
    <h1 class="title is-4">{{ $t('tutor.thirdStep.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.thirdStep.description') }}</p>
    <!-- syllabus -->
    <p contenteditable="true" class="syllabus">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus Lorem ipsum dolor
      sit amet, consectetur adipiscing elit. Nullam nec purus Lorem ipsum dolor sit amet,
      consectetur adipiscing elit. Nullam nec purus Lorem ipsum dolor sit amet, consectetur
      adipiscing elit. Nullam nec purus Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt.
      Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt.
      Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt.
      Nullam nec purus nec nunc ultricies nec nunc ultricies tincidunt. Nullam nec purus nec nunc
      ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc
      ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc
      ultricies tincidunt. Nullam nec purus nec nunc ultricies nec nunc ultricies tincidunt. Nullam
      nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam
      nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam
      nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies
      nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus
      nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus
      nec nunc ultricies tincidunt. Nullam nec purus nec nunc ultricies tincidunt. Nullam nec purus
      nec nunc ultricies
    </p>
  </div>
</template>

<style scoped>
.wrapper {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  flex-basis: 0;
  transition: flex-grow 2s;
}

.wrapper.visible {
  flex-grow: 3;
}

.syllabus {
  padding: 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
  margin: 1rem 0;
  min-height: 10rem;
  width: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 1rem;
  line-height: 1.5rem;
  background-color: var(--neutral-10);
  color: var(--neutral-90);
  cursor: text;
  transition: background-color 0.3s;
}
</style>
