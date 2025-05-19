<script setup lang="ts">
import LandingImage from '@/components/LandingImage.vue';
</script>
<template>
  <div class="landing-wrapper">
    <div
      class="local-container is-flex is-fullwidth is-justify-content-center is-align-items-center px-6 pb-4 pt-6"
    >
      <div
        class="call-to-action is-flex is-flex-direction-column is-justify-content-space-between pl-6"
      >
        <div class="pb-1">
          <img alt="logo" class="logo" src="@/assets/logo.png" />
        </div>
        <div class="pb-6">
          <div class="is-local-size-1 has-text-weight-bold is-uppercase mt-4">
            {{ $t('landing.slogan') }}
          </div>
          <p class="subtitle">
            {{ $t('landing.description') }}
          </p>

          <div class="pt-6">
            <router-link to="/search">
              <button class="button is-black is-size-4">{{ $t('search') }}</button>
            </router-link>
            <router-link to="/q-and-a" class="ml-4">
              <button class="button is-black is-size-4">{{ $t('chat') }}</button>
            </router-link>
          </div>
        </div>
        <div class="partners-section">
          <img alt="logo" class="small-logo" src="@/assets/uved.png" />
          <img alt="logo" class="small-logo ml-4" src="@/assets/france2030.png" />
        </div>
      </div>

      <div
        class="illustration-container is-flex is-justify-content-center is-align-items-center pr-6"
      >
        <div class="illustration">
          <LandingImage />
        </div>
      </div>
    </div>
    <div class="section">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="title mb-3">{{ $t('landing.horizontal.section_one.title') }}</p>
          <p class="subtitle mr-6">
            {{ $t('landing.horizontal.section_one.content') }}
          </p>
        </div>
        <img class="placeholder ml-6" alt="placeholder" src="@/assets/bk_edit.gif" />
      </div>
    </div>
    <div class="section">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="title mb-3">{{ $t('landing.horizontal.section_two.title') }}</p>
          <p class="subtitle mr-6">
            {{ $t('landing.horizontal.section_two.content') }}
          </p>
        </div>
        <img class="placeholder ml-6" alt="placeholder" src="@/assets/search_edit.gif" />
      </div>
    </div>
    <div class="section">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="title mb-3">{{ $t('landing.horizontal.section_three.title') }}</p>
          <p class="subtitle mr-6">
            {{ $t('landing.horizontal.section_three.content') }}
          </p>
        </div>
        <img class="placeholder ml-6" alt="placeholder" src="@/assets/chat_edit.gif" />
      </div>
    </div>
    <div class="section is-flex is-justify-content-space-between">
      <div class="is-flex is-flex-direction-column is-align-items-center ml-4 mr-4">
        <p class="title has-text-centered">{{ $t('landing.vertical.section_one.title') }}</p>
        <img class="placeholder2 mb-2" alt="placeholder" src="@/assets/researching_re_fuod.svg" />
        <p class="subtitle mt-4">
          {{ $t('landing.vertical.section_one.content') }}
        </p>
      </div>
      <div class="is-flex is-flex-direction-column is-align-items-center ml-4 mr-4">
        <p class="title has-text-centered">{{ $t('landing.vertical.section_two.title') }}</p>
        <img
          class="placeholder2 mb-2"
          alt="placeholder"
          src="@/assets/visionary_technology_re_jfp7.svg"
        />
        <p class="subtitle mt-4">
          {{ $t('landing.vertical.section_two.content') }}
        </p>
      </div>
      <div class="is-flex is-flex-direction-column is-align-items-center ml-4 mr-4">
        <p class="title has-text-centered">{{ $t('landing.vertical.section_three.title') }}</p>
        <img class="placeholder2 mb-2" alt="placeholder" src="@/assets/taking_notes_re_bnaf.svg" />
        <p class="subtitle mt-4">
          {{ $t('landing.vertical.section_three.content') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  width: 40%;
  border-radius: 8px;
  border: 1px solid var(--neutral-50);
}
.placeholder2 {
  height: 200px;
  border-radius: 8px;
}
.section {
  min-height: 50vh;
  padding: 3rem 5%;
}
.landing-wrapper > .section:nth-child(2) {
  background: linear-gradient(180deg, #91e7d3 0%, #91e7d3 20%, #fff 20%);
}
.title {
  padding-top: 10%;
}

.description {
  width: 35%;
}
.local-container {
  width: 100%;
  height: 100%;
  background-color: #91e7d3;
  overflow: hidden;
}

.call-to-action {
  height: 60%;
  width: 50%;
}

.call-to-action::before {
  content: '';
  width: 20px;
  height: 150px;
  position: absolute;
  border: 1px solid black;
  background-color: black;
  top: 100px;
  left: 0px;
}

.call-to-action::after {
  content: '';
  width: 20px;
  height: 90px;
  position: absolute;
  border: 1px solid black;
  background-color: black;
  bottom: 100px;
  right: 1px;
}
.is-local-size-1 {
  font-size: 4rem;
}
.logo {
  margin: auto;
  width: 40%;
}
.small-logo {
  margin: auto;
  height: 5rem;
}
.illustration-container {
  width: 50%;
}
.illustration {
  height: 60%;
  width: 70%;
}
</style>
