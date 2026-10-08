<template>
  <div class="footer-wrapper">
    <div>
      <a href="mailto:welearn@learningplanetinstitute.org">{{ $t('contactUs') }}</a>
    </div>
    <div>
      <a target="_blank" :href="WL_FEEDBACK_FORM_URL" class="gform">{{ $t('giveFeedback') }}</a>
      <router-link class="terms" to="/terms">
        <span class="item-name">{{ $t('terms') }}</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.footer-wrapper {
  padding: 0 5rem;
  padding-right: 1.7rem;
  display: flex;
  justify-content: flex-end;
  color: var(--neutral-70);
  font-size: 0.9rem;
}

a {
  all: unset;
  cursor: pointer;
}

a:first-child {
  margin-right: 1rem;
  padding-right: 1rem;
  border-right: 1px solid var(--neutral-70);
}

a:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .footer-wrapper {
    padding: 0 1rem;
    justify-content: center;
    font-size: 0.8rem;
  }

  .gform {
    display: none;
  }

  a:first-child {
    margin-right: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
