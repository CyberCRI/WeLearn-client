<script setup lang="ts">
defineProps<{
  btnText?: string;
  color?: 'primary' | 'secondary';
  // outlined only with a color: bulma 1 draws an outlined button with no color in the
  // background color, so its text is invisible (white on a white modal)
  isDiscreet?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    :disabled="disabled"
    class="button"
    :class="[isDiscreet && color && 'is-outlined', color && `is-${color}`]"
  >
    <slot></slot>
  </button>
</template>
