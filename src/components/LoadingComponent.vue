<template>
  <div id="wave">
    <span class="dot"></span>
    <span class="dot dot2"></span>
    <span class="dot dot3"></span>
  </div>
</template>
<style scoped>
#wave {
  position: absolute;
  bottom: 0rem;
  left: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.625rem;
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
