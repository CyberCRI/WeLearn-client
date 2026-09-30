<template>
  <section class="activity-step">
    <header class="step-header">
      <p class="step-intro">
        {{ step.intro }}
      </p>
      <p class="step-instruction">{{ $t('microLearning.activities.instruction') }}</p>
    </header>

    <section v-for="(apport, apportIndex) in step.apports" :key="apport.label" class="apport">
      <header class="apport-header">
        <span class="apport-badge" :class="apport.color">
          {{ apport.label }}
        </span>
      </header>

      <div class="activity-grid">
        <label
          v-for="(activity, actIndex) in apport.acts"
          :key="activity.title"
          class="activity-card"
          :class="{ selected: isSelected(activity) }"
        >
          <input
            type="radio"
            name="activity"
            class="visually-hidden"
            :checked="isSelected(activity)"
            @click="
              $emit(
                'selected',
                isSelected(activity) ? null : { apport: apportIndex, act: actIndex }
              )
            "
          />
          <div class="activity-select">
            <div class="radio" aria-hidden="true">✓</div>

            <div>
              <h3>
                {{ activity.title }}
              </h3>

              <p>
                {{ activity.desc }}
              </p>
            </div>
          </div>
        </label>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { Activity, ActivitiesStep, ActivityRef } from '@/types/microlearning';

const props = defineProps<{
  step: ActivitiesStep;
  selected: Activity | null;
}>();

function isSelected(activity: Activity) {
  return props.selected?.title === activity.title;
}

defineEmits<{
  (e: 'selected', activity: ActivityRef | null): void;
}>();
</script>

<style scoped lang="css">
.activity-step {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.step-intro {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 1rem;
}

.step-instruction {
  margin: 0;
  font-weight: 600;
  color: var(--neutral-100);
}

.visually-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.activity-card:focus-within {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* -------------------------------------------------------------------------- */
/* APPORT                                                                      */
/* -------------------------------------------------------------------------- */

.apport {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.apport-header {
  display: flex;
  align-items: center;
}

.apport-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Couleurs */

.apport-badge.ct {
  background: var(--primary-lighter);
  color: var(--primary-hover);
}

.apport-badge.cp {
  background: var(--lpi-violet-lighter);
  color: var(--lpi-violet);
}

.apport-badge.ck {
  background: #edf8e9;
  color: #41825a;
}

.apport-badge.cy {
  background: #fff6d9;
  color: #9a7600;
}

/* -------------------------------------------------------------------------- */
/* ACTIVITIES                                                                  */
/* -------------------------------------------------------------------------- */

.activity-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.activity-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--primary-lighter);
  border-radius: 8px;

  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.activity-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-lighter);
}

.activity-card h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.activity-card p {
  margin: 0;
  color: var(--neutral-80);
  line-height: 1.7;
  flex: 1;
}
.activity-select {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.radio {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--neutral-30);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 13px;
  color: transparent;
  transition: 0.2s;
  margin-top: 2px;
}

.activity-card.selected .radio {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.activity-card {
  position: relative;
  cursor: pointer;
}

.activity-card.selected {
  border-color: var(--primary);

  box-shadow: 0 0 0 3px var(--primary-lighter);
}
/* -------------------------------------------------------------------------- */
/* BUTTON                                                                      */
/* -------------------------------------------------------------------------- */

.activity-card button {
  align-self: flex-start;
  margin-top: auto;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.activity-card button:hover {
  background: var(--primary-hover);
}

.activity-card.selected button {
  background: #41825a;
}

/* -------------------------------------------------------------------------- */
/* RESPONSIVE                                                                  */
/* -------------------------------------------------------------------------- */

@media (max-width: 768px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
