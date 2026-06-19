<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <div class="loading-wrapper">
    <div id="wave">
      <span class="dot"></span>
      <span class="dot dot2"></span>
      <span class="dot dot3"></span>
    </div>
    <p v-if="label" class="loading-label">{{ label }}</p>
  </div>
</template>
<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-label {
  margin: 0;
  font-size: 0.875rem;
  color: var(--neutral-80);
  text-align: center;
}

#wave {
  margin: 0;
}

.dot {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.187rem;
  background: var(--neutral-90);
  animation: wave 1.3s linear infinite;
}

.dot2 {
  animation-delay: -1.1s;
}

.dot3 {
  animation-delay: -0.7s;
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: initial;
  }

  30% {
    transform: translateY(-15px);
  }
}
</style>
