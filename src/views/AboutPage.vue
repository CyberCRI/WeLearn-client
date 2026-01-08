<script setup lang="ts">
import { useSourcesStore } from '@/stores/sources';
import { onBeforeMount } from 'vue';
import i18n from '@/localisation/i18n';

const sourcesStore = useSourcesStore();

onBeforeMount(() => {
  sourcesStore.getInfoPerCorpus();
});
</script>
<template>
  <div class="wrapper py-6">
    <div class="presentation is-flex is-fullwidth is-justify-content-center is-align-items-center">
      <div class="call-to-action is-flex is-flex-direction-column is-justify-content-space-between">
        <div class="is-size-1 has-text-weight-bold has-text-centered is-uppercase">
          {{ $t('landing.slogan') }}
        </div>
        <p class="subtitle has-text-centered mt-4 mb-6">
          {{ $t('landing.description') }}
        </p>
      </div>
    </div>

    <div class="has-text-centered partnership">
      <div class="is-flex my-4 is-justify-content-space-between is-align-items-center">
        <img alt="logo" class="partner-logo mx-4" src="@/assets/lpi_logo.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/uved.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/cy_logo.png" />
        <img alt="logo" class="partner-logo mx-4" src="@/assets/france2030.png" />
      </div>
      <h1 class="subtitle is-6 mt-6">{{ $t('landing.partnership') }}</h1>
    </div>

    <div class="product-description has-text-centered">
      <h3 class="title is-size-4 pt-6">{{ $t('landing.aboutTitle') }}</h3>
      <p class="subtitle mt-4">
        {{ $t('landing.aboutDescription') }}
      </p>
    </div>

    <div class="section mt-6" v-if="sourcesStore?.infoPerCorpus?.length > 0">
      <div class="description mx-auto">
        <h1 class="subtitle has-text-weight-bold mb-2">{{ $t('landing.sourcesTitle') }} ></h1>
        <p class="subtitle is-size-6">
          {{ $t('landing.sourcesDescription_1') }}
        </p>
        <p class="subtitle is-size-6">
          {{ $t('landing.sourcesDescription_2') }}
        </p>
        <p class="subtitle is-size-6 pb-2">
          {{ $t('landing.sourcesDescription_3') }}
        </p>
        <div class="table-wrapper">
          <table class="sources-table">
            <thead>
              <tr>
                <th>{{ $t('landing.sourceNameTitle') }}</th>
                <th>{{ $t('landing.sourceUrlTitle') }}</th>
                <th class="qty-sources">{{ $t('landing.sourceNumberTitle') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="source in sourcesStore.infoPerCorpus" :key="source.corpus">
                <td>{{ $t(`corpus.${source.corpus}`, source.corpus) }}</td>
                <td>
                  <a target="_blanc" :href="source.url">{{ source.url }}</a>
                </td>
                <td class="qty-sources">
                  {{ new Intl.NumberFormat(i18n.global.locale.value).format(source.qty_in_qdrant) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="section mt-6">
      <div class="is-flex is-fullwidth is-justify-content-space-evenly">
        <div class="description">
          <p class="subtitle has-text-weight-bold mb-2">
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
          <p class="subtitle has-text-weight-bold mb-2">
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
          <p class="subtitle has-text-weight-bold mb-2">
            {{ $t('landing.horizontal.section_three.title') }}
            <span class="is-size-4 ml-4">></span>
          </p>
          <p class="subtitle is-size-6 pb-6">
            {{ $t('landing.horizontal.section_three.content') }}
          </p>
        </div>
      </div>
    </div>
    <div class="section px-6 pb-6">
      <div class="is-flex mx-6">
        <div class="px-4">
          <p class="subtitle has-text-weight-bold">
            {{ $t('landing.vertical.section_one.title') }}
          </p>
          <p class="subtitle">{{ $t('landing.vertical.section_one.content') }}</p>
        </div>
        <div class="px-6">
          <p class="subtitle has-text-weight-bold">
            {{ $t('landing.vertical.section_two.title') }}
          </p>
          <p class="subtitle">{{ $t('landing.vertical.section_two.content') }}</p>
        </div>
        <div class="px-6">
          <p class="subtitle has-text-weight-bold">
            {{ $t('landing.vertical.section_three.title') }}
          </p>
          <p class="subtitle">{{ $t('landing.vertical.section_three.content') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sources-table {
  width: 100%;
}

.sources-table th {
  text-align: left;
  padding-left: 0;
}

.sources-table td {
  padding-left: 0;
  padding-right: 0;
}

.sources-table .qty-sources {
  text-align: right;
}

.wrapper {
  width: 100%;
}

.presentation {
  width: 60%;
  height: 100%;
  margin: auto;
}

.partnership {
  width: 45%;
  margin: auto;
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
