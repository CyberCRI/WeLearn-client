<template>
  <div class="microlearning">
    <BackLink v-if="ml.screen.value === ScreensEnum.welcome" to="/learn" class="page-back">
      {{ $t('learn.module.backToLearn') }}
    </BackLink>
    <!-- before the trail nothing is lost yet, so no confirm (the trail header asks) -->
    <BackLink
      v-else-if="[ScreensEnum.briefing, ScreensEnum.autoEvalStart].includes(ml.screen.value)"
      class="page-back"
      @click="ml.restart"
    >
      {{ $t('learn.discipline.briefingScreen.ghostButton') }}
    </BackLink>
    <Transition name="fade" mode="out-in">
      <WelcomeScreen
        v-if="ml.screen.value === ScreensEnum.welcome"
        :disciplines="ml.DISC_LIST"
        @select="ml.selectDiscipline"
      />
      <BriefingScreen
        v-else-if="ml.screen.value === ScreensEnum.briefing && ml.current_disc.value"
        :discipline="ml.current_disc.value"
        @back="ml.restart"
        @start="ml.goToautoEvalStart"
      />
      <AutoEvaluationStart
        v-else-if="ml.screen.value == ScreensEnum.autoEvalStart"
        :answers="ml.preAnswers"
        :locked="ml.preLocked.value"
        @back="ml.goToBriefing"
        @start="ml.startTrail"
        @skip="ml.skipAutoEvalStart"
        :discipline="$t(`learn.discipline.disciplineNames.${ml.disc.value}`)"
      />
      <TrailScreen
        v-else-if="ml.screen.value === ScreensEnum.trail && ml.currentData.value"
        :discipline="ml.currentData.value"
        :step="ml.step.value"
        :reached="ml.reachedStep.value"
        :disciplineMeta="ml.current_disc.value"
        :flip-done="ml.flipDone.value"
        :chosen-activity="ml.chosenActivity.value"
        :reflection-answers="ml.reflectionAnswers"
        :flipped-cards="ml.flippedCards.value"
        :progress="ml.progress.value"
        @flip-card="ml.flipCard"
        @choose-activity="ml.chooseActivity"
        @previous="ml.prevStep"
        @next="ml.nextStep"
        @select="ml.goToStep"
        @restart="ml.restart"
      />
      <AutoEvaluationEnd
        v-else-if="ml.screen.value == ScreensEnum.autoEvalEnd"
        :answers="ml.postAnswers"
        @back="ml.backToTrail"
        @start="ml.goToComplete"
        @skip="ml.skipAutoEvalEnd"
        :discipline="$t(`learn.discipline.disciplineNames.${ml.disc.value}`)"
      />

      <CompleteScreen
        v-else-if="ml.screen.value === ScreensEnum.complete && ml.currentData.value"
        :discipline="ml.currentData.value"
        :chosen-activity="ml.chosenActivity.value"
        @restart="ml.restart"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useDisciplineModule } from '@/composables/useDisciplineModule';
import { ScreensEnum } from '@/types/learn/discipline';
import BackLink from '@/components/BackLink.vue';

import WelcomeScreen from '@/components/learn/discipline/WelcomeScreen.vue';
import BriefingScreen from '@/components/learn/discipline/BriefingScreen.vue';
import TrailScreen from '@/components/learn/discipline/TrailScreen.vue';
import CompleteScreen from '@/components/learn/discipline/CompleteScreen.vue';
import AutoEvaluationStart from '@/components/learn/discipline/AutoEvaluationStart.vue';
import AutoEvaluationEnd from '@/components/learn/discipline/AutoEvaluationEnd.vue';

const ml = useDisciplineModule();
</script>

<style scoped>
.page-back {
  margin: 1rem 0 0 1rem;
}

.microlearning {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
