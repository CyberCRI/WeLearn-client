<script setup lang="ts">
import FullpageTemplate from '@/components/FullpageTemplate.vue';
import SdgTile from '@/components/SdgTile.vue';
import { ref } from 'vue';
import { getAxios } from '@/utils/fetch';
import SourcesListComponent from '@/components/SourcesListComponent.vue';
import SelectSubject from '@/components/dropdowns/SubjectSelector.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';

const toggleSdgSpecific = ref(false);
const goalToShow = ref<null | number>(null);
const introJsonJourney = ref<null | Array<Record<any, any>>>(null);
const targetsJsonJourney = ref<null | Array<Record<any, any>>>(null);
const selectedSubject = ref<string | null>(null);
const pageNum = ref<number>(0);

const setPageNum = (newPageNum: number) => {
  if (targetsJsonJourney.value !== null && newPageNum >= 0 && newPageNum <= targetsJsonJourney.value.length){
    pageNum.value = newPageNum;
  }
};


const selectSubject_ = (subject: string) => {
  selectedSubject.value = subject;
};

const clearSubject = () => {
  selectedSubject.value = undefined;
};

const changePageController = (goal: number | undefined) => {
  goalToShow.value = goal;
  toggleSdgSpecific.value = !toggleSdgSpecific.value;
  introJsonJourney.value = null;
  targetsJsonJourney.value = null;
  pageNum.value = 0;
};

const fetchMicroLearningForSpecificSDG = async (
  goal: number | undefined,
  subject: string | undefined
) => {
  const response = await getAxios(
    '/micro_learning/full_journey?lang=fr&sdg=' + goal + '&subject=' + subject
  );
  introJsonJourney.value = response.introduction;
  targetsJsonJourney.value = response.target;
};
</script>

<template>
  <div class="first step" v-if="!toggleSdgSpecific">
    <FullpageTemplate>
      <template #top>
        <h2 class="title is-6 mt-4">
          {{ $t('microlearning.mainTitle') }}
        </h2>
        <div>
          <SelectSubject
            :selectSubject="selectSubject_"
            :clearSubject="clearSubject"
            :storedSubject="selectedSubject"
          ></SelectSubject>
        </div>
      </template>
      <template #main>
        <div class="content-centered-wrapper">
          <h2 class="title is-6 mt-4" v-if="selectedSubject">
            {{ $t('microlearning.chooseSdg') }}
          </h2>
          <div class="layout-flex">
            <div class="flex-wrap" v-if="selectedSubject">
              <SdgTile
                v-for="n in 17"
                :key="n"
                :goal="n"
                size="200"
                rounded="16"
                @click="
                  () => {
                    changePageController(n);
                    fetchMicroLearningForSpecificSDG(goalToShow, selectedSubject);
                  }
                "
              />
            </div>
          </div>
        </div>
      </template>
    </FullpageTemplate>
  </div>

  <div class="second step" v-if="toggleSdgSpecific">
    <button class="button" @click="() => changePageController(undefined)">
      {{ $t('previous') }}
    </button>
    <div class="top-content-centered-wrapper" v-if="targetsJsonJourney">
      <button class="button" @click="setPageNum(pageNum-1)">
        {{ $t('previous_page') }}
      </button>
      <StepsIndicator
        v-if="targetsJsonJourney && pageNum > 0"
        :step="pageNum"
        :setStep="setPageNum"
        :advancement="pageNum"
        :stepsLength="targetsJsonJourney.length"
      />
      <h1 v-if="pageNum == 0" class="title is-4">Introduction</h1>
      <button class="button" @click="setPageNum(pageNum+ 1)">
        {{ $t('next_page') }}
      </button>
    </div>

    <div class="introduction" v-if="introJsonJourney && pageNum == 0">
      <FullpageTemplate>
        <template #top>
          <h2 class="subtitle is-6">Introduction ODD {{ goalToShow }}</h2>
        </template>
        <template #main>
          <SourcesListComponent
            False
            :sourcesList="introJsonJourney[0].documents"
            :isSourcesError="false"
            :isFetchingSources="false"
            :shouldDisplayScore="true"
            :noResults="false"
          />
        </template>
      </FullpageTemplate>
    </div>

    <div class="targets" v-if="targetsJsonJourney && pageNum > 0">
      <FullpageTemplate>
        <template #top>
          <h2 class="subtitle is-6">{{ targetsJsonJourney[pageNum - 1].content }}</h2>
        </template>
        <template #main>
          <SourcesListComponent
            False
            :sourcesList="targetsJsonJourney[pageNum - 1].documents"
            :isSourcesError="false"
            :isFetchingSources="false"
            :shouldDisplayScore="true"
            :noResults="false"
          />
        </template>
      </FullpageTemplate>
    </div>
  </div>
</template>

<style scoped>
.content-centered-wrapper {
  height: 100vh;
}
.flex-wrap {
  display: flex;
  flex-wrap: wrap; /* permet le retour à la ligne */
  gap: 12px; /* espace entre les tuiles */
}

.top-content-centered-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem 2rem;
  height: 100%;
  overflow: hidden;
}
</style>
