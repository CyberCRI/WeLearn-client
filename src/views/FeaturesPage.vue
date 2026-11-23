<script setup lang="ts">
// the feature flags of this build, as src/featureEnvironments.json lists them: where each is on,
// and a preview button for this browser. only on dev and staging, never through a preview
import ButtonComponent from '@/components/ButtonComponent.vue';
import GenericPillComponent from '@/components/GenericPillComponent.vue';
import featureEnvironments from '@/featureEnvironments.json';
import {
  type Feature,
  environmentsOf,
  isPreviewable,
  useFeatureFlipStore
} from '@/stores/featureFlip';
import { ENVIRONMENT_NAME } from '@/utils/env';
import { reloadPage } from '@/utils/navigation';

const store = useFeatureFlipStore();

type Status = 'environment' | 'preview' | 'off';

const features = (Object.keys(featureEnvironments) as Feature[]).map((name) => {
  const status: Status = store.isOnInEnvironment(name)
    ? 'environment'
    : store.previewFeatures.includes(name)
      ? 'preview'
      : 'off';
  return {
    name,
    description: featureEnvironments[name].description,
    page: featureEnvironments[name].page,
    environments: environmentsOf(name),
    status,
    canPreview: status === 'off' && isPreviewable(name)
  };
});

// the flags are read when the app starts: a change takes a page load
const keep = (previews: Feature[]) => {
  store.keepPreviewFeatures(previews);
  reloadPage();
};
const startPreview = (feature: Feature) => keep([...store.previewFeatures, feature]);
const stopPreview = (feature: Feature) =>
  keep(store.previewFeatures.filter((name) => name !== feature));
</script>

<template>
  <div class="features-page">
    <h1 class="title is-4">{{ $t('features.title') }}</h1>
    <p class="subtitle is-6">{{ $t('features.subtitle', { environment: ENVIRONMENT_NAME }) }}</p>

    <div class="previews" data-testid="previews">
      <span>
        {{
          store.previewFeatures.length
            ? $t('features.previews', { features: store.previewFeatures.join(', ') })
            : $t('features.noPreview')
        }}
      </span>
      <ButtonComponent
        v-if="store.previewFeatures.length"
        class="is-small"
        data-testid="stop-all-previews"
        @click="keep([])"
      >
        {{ $t('features.stopAll') }}
      </ButtonComponent>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>{{ $t('features.feature') }}</th>
            <th>{{ $t('features.environments') }}</th>
            <th>{{ $t('features.here') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="feature in features"
            :key="feature.name"
            :data-testid="`feature-${feature.name}`"
          >
            <td>
              <code>{{ feature.name }}</code>
              <p class="description">{{ feature.description }}</p>
            </td>
            <td>
              <div class="environments">
                <GenericPillComponent
                  v-for="environment in feature.environments"
                  :key="environment"
                  :content="environment"
                />
              </div>
            </td>
            <td data-testid="status">{{ $t(`features.status.${feature.status}`) }}</td>
            <td class="actions">
              <ButtonComponent
                v-if="feature.canPreview"
                class="is-small"
                data-testid="start-preview"
                @click="startPreview(feature.name)"
              >
                {{ $t('features.startPreview') }}
              </ButtonComponent>
              <ButtonComponent
                v-else-if="feature.status === 'preview'"
                class="is-small"
                data-testid="stop-preview"
                @click="stopPreview(feature.name)"
              >
                {{ $t('features.stopPreview') }}
              </ButtonComponent>
              <RouterLink
                v-if="feature.page && feature.status !== 'off'"
                :to="feature.page"
                class="ml-2"
                data-testid="open-page"
              >
                {{ $t('features.open') }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.features-page {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.previews {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.description {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.environments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.actions {
  white-space: nowrap;
}
</style>
