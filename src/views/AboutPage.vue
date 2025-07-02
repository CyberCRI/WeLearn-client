<template>
  <div class="wrapper">
    <div class="presentation is-flex is-fullwidth is-justify-content-center is-align-items-center">
      <div class="call-to-action is-flex is-flex-direction-column is-justify-content-space-between">
        <div class="is-size-1 has-text-weight-bold has-text-centered is-uppercase">
          {{ $t('landing.slogan') }}
        </div>
        <p class="subtitle has-text-centered mt-4 mb-6">
          {{ $t('landing.description') }}
        </p>

        <div class="is-flex mb-6 is-justify-content-space-around is-align-items-center">
          <p class="is-size-5 has-text-weight-semibold">+ 500 000 Documents</p>
          <p class="is-size-5 has-text-weight-semibold">+ 500 000 Documents</p>
          <p class="is-size-5 has-text-weight-semibold">+ 500 000 Documents</p>
        </div>
      </div>
    </div>

    <div class="has-text-centered partnership">
      <h1 class="mb-4">{{ $t('landing.partnership') }}</h1>
      <div class="is-flex my-4 is-justify-content-space-between is-align-items-center">
        <img alt="logo" class="partner-logo mx-4" src="@/assets/lpi_logo.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/uved.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/cy_logo.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/france2030.png" />
      </div>
    </div>

    <div class="product-description has-text-centered">
      <h3 class="title is-size-4 pt-6">{{ $t('landing.aboutTitle') }}</h3>
      <p class="subtitle mt-4">
        {{ $t('landing.aboutDescription') }}
      </p>
    </div>

    <div class="section mt-6">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="subtitle has-text-weight-bold mb-2 is-clickable">
            {{ $t('landing.horizontal.section_one.title') }}
            <span class="is-size-4 ml-4">></span>
          </p>
          <p class="subtitle is-size-6 pb-6">
            {{ $t('landing.horizontal.section_one.content') }}
          </p>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="subtitle has-text-weight-bold mb-2 is-clickable">
            {{ $t('landing.horizontal.section_two.title') }}
            <span class="is-size-4 ml-4">></span>
          </p>
          <p class="subtitle is-size-6 pb-6">
            {{ $t('landing.horizontal.section_two.content') }}
          </p>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="subtitle has-text-weight-bold mb-2 is-clickable">
            {{ $t('landing.horizontal.section_three.title') }}
            <span class="is-size-4 ml-4">></span>
          </p>
          <p class="subtitle is-size-6 pb-6">
            {{ $t('landing.horizontal.section_three.content') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
}

.presentation {
  width: 60%;
  height: 100%;
  margin: auto;
  margin-top: 2%;
}

.partnership {
  width: 40%;
  margin: auto;
  margin-top: 8px;
}

.partner-logo {
  margin: auto;
  height: 5rem;
}

.product-description {
  width: 60%;
  margin: auto;
}

.section {
  width: 100%;
  margin: auto;
}

.description {
  width: 40%;
  border-bottom: 1px solid #e0e0e0;
}

.call-to-action {
  height: 60%;
}

.is-local-size-1 {
  font-size: 4rem;
}
</style>
