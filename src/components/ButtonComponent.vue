<script setup lang="ts">
defineProps<{
  btnText?: string;
  color?: 'primary' | 'secondary';
  isDiscreet?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <button :disabled="disabled" class="button" :class="[isDiscreet && 'is-outline', `is-${color}`]">
    <slot></slot>
  </button>
</template>
