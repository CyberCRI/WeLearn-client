<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: false
  }
});
defineEmits(['update:modelValue']);
</script>

<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="textarea has-fixed-size"
    :class="modelValue && (modelValue.split(/(\s)/).length <= 5 ? 'is-danger' : 'is-success')"
    autofocus="true"
    type="text"
    minlength="200"
    rows="10"
    :placeholder="$t('searchPlaceholder')"
  ></textarea>
</template>
<style scoped>
.textarea {
  border: none;
  padding: 2rem;
}

@media screen and (max-width: 768px) {
  .textarea {
    padding: 1rem;
    font-size: 0.875em;
  }
}
</style>
