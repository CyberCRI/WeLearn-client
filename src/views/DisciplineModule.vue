<template>
  <div class="microlearning">
    <RouterLink v-if="ml.screen.value === ScreensEnum.welcome" to="/learn" class="back-link">
      ← {{ $t('learn.module.backToLearn') }}
    </RouterLink>
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

import WelcomeScreen from '@/components/learn/discipline/WelcomeScreen.vue';
import BriefingScreen from '@/components/learn/discipline/BriefingScreen.vue';
import TrailScreen from '@/components/learn/discipline/TrailScreen.vue';
import CompleteScreen from '@/components/learn/discipline/CompleteScreen.vue';
import AutoEvaluationStart from '@/components/learn/discipline/AutoEvaluationStart.vue';
import AutoEvaluationEnd from '@/components/learn/discipline/AutoEvaluationEnd.vue';

const ml = useDisciplineModule();
</script>

<style scoped>
.back-link {
  display: inline-block;
  margin: 1rem 0 0 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.microlearning {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
