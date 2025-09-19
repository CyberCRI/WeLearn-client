<script setup lang="ts">
import FullpageTemplate from '@/components/FullpageTemplate.vue';
import SdgTile from '@/components/SdgTile.vue';
import { useMicroLearningStore} from '@/stores/microlearning';

const store = useMicroLearningStore();

</script>



<template>
  <div class="first step" v-if=true>
    <FullpageTemplate>
      <template #top>
        <h2 class="title is-6 mt-4">
          {{ $t('microlearning.mainTitle') }}
        </h2>
      </template>
      <template #main>
        <div class="content-centered-wrapper">
          <div class="layout-flex">
            <div class="flex-wrap">
              <SdgTile v-for="n in 17" :key="n" :goal="n" size="200"/>
            </div>
          </div>
        </div>
      </template>
    </FullpageTemplate>
  </div>
</template>

<style scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;   /* permet le retour à la ligne */
  gap: 12px;         /* espace entre les tuiles */
}
</style>
