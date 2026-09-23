<template>
  <div class="microlearning">
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
        :discipline="$t(`microLearning.disciplineNames.${ml.disc.value}`)"
      />
      <TrailScreen
        v-else-if="ml.screen.value === ScreensEnum.trail && ml.currentData.value"
        :discipline="ml.currentData.value"
        :step="ml.step.value"
        :disciplineMeta="ml.current_disc.value"
        :flip-done="ml.flipDone.value"
        :chosen-activity="ml.chosenActivity.value"
        :reflection-answers="ml.reflectionAnswers"
        :flipped-cards="ml.flippedCards.value"
        @toggle-card="ml.toggleCard"
        @choose-activity="ml.chooseActivity"
        @previous="ml.prevStep"
        @next="ml.nextStep"
        @restart="ml.restart"
      />
      <AutoEvaluationEnd
        v-else-if="ml.screen.value == ScreensEnum.autoEvalEnd"
        :answers="ml.postAnswers"
        @back="ml.backToTrail"
        @start="ml.goToComplete"
        :discipline="$t(`microLearning.disciplineNames.${ml.disc.value}`)"
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
import { useMicrolearning } from '@/composables/useMicrolearning';
import { ScreensEnum } from '@/types/microlearning';

import WelcomeScreen from '@/components/microlearning/WelcomeScreen.vue';
import BriefingScreen from '@/components/microlearning/BriefingScreen.vue';
import TrailScreen from '@/components/microlearning/TrailScreen.vue';
import CompleteScreen from '@/components/microlearning/CompleteScreen.vue';
import AutoEvaluationStart from '@/components/microlearning/AutoEvaluationStart.vue';
import AutoEvaluationEnd from '@/components/microlearning/AutoEvaluationEnd.vue';

const ml = useMicrolearning();
</script>

<style scoped>
.microlearning {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
