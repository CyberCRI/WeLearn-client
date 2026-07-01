<template>
  <div class="microlearning">
    <Transition name="fade" mode="out-in">
      <WelcomeScreen
        v-if="ml.screen === 'welcome'"
        :disciplines="ml.disciplines"
        @select="ml.selectDiscipline"
      />

      <BriefingScreen
        v-else-if="ml.screen === 'briefing'"
        :discipline="ml.discipline!"
        @back="ml.restart"
        @start="ml.startTrail"
      />

      <TrailScreen
        v-else-if="ml.screen === 'trail'"
        :discipline="ml.discipline!"
        :step="ml.step.value"
        @previous="ml.prevStep"
        @next="ml.nextStep"
        @finish="ml.finish"
      />

      <CompleteScreen v-else :discipline="ml.discipline!" @restart="ml.restart;" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useMicrolearning } from '@/composables/useMicrolearning';

import WelcomeScreen from '@/components/microlearning/WelcomeScreen.vue';
import BriefingScreen from '@/components/microlearning/BriefingScreen.vue';
import TrailScreen from '@/components/microlearning/TrailScreen.vue';
import CompleteScreen from '@/components/microlearning/CompleteScreen.vue';

const ml = useMicrolearning();
</script>

<style scoped>
.microlearning {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
