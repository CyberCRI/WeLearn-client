<template>
  <div class="avatar">
    <img alt="chat assistant avatar" src="@/assets/wl_logo.png" />
  </div>
</template>

<style scoped>
.avatar img {
  width: 2rem;
  height: 1.25rem;
}

.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0rem;
  border-radius: 50%;
  border: 2px solid var(--primary);
}
@media screen and (min-width: 576px) {
}
</style>
