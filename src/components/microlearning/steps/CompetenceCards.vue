<template>
  <section class="competence-step">
    <header class="step-header">
      <h2 class="step-title">{{ $t('microLearning.competence.title') }}</h2>

      <p class="step-intro">
        {{ step.intro }}
      </p>
    </header>

    <div class="competence-grid">
      <article v-for="competence in step.featured" :key="competence.id" class="competence-card">
        <span class="competence-tag" :class="competence.tagClass">
          {{ competence.tag }}
        </span>

        <h3 class="competence-name">
          {{ competence.name }}
        </h3>

        <div class="competence-content">
          <strong>Concrètement</strong>

          <p>
            {{ competence.concrete }}
          </p>
        </div>
      </article>
    </div>

    <aside v-if="step.also?.length" class="also-section">
      <p class="also-title">Cette discipline contribue également à développer</p>

      <div class="also-tags">
        <span v-for="tag in step.also" :key="tag" class="also-tag">
          {{ tag }}
        </span>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
interface Competence {
  id: string;
  tag: string;
  tagClass: 'transversal' | 'disciplinaire';
  name: string;
  concrete: string;
}

interface CompetenceStep {
  intro: string;
  featured: Competence[];
  also: string[];
}

defineProps<{
  step: CompetenceStep;
}>();
</script>

<style scoped lang="css">
.competence-step {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.step-title {
  margin: 0 0 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.step-intro {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.competence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.competence-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 1.5rem;

  background: white;

  border: 1px solid var(--border);

  border-radius: var(--radius);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.competence-card:hover {
  transform: translateY(-2px);

  border-color: var(--primary);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.competence-tag {
  align-self: flex-start;

  padding: 0.3rem 0.75rem;

  border-radius: 999px;

  font-size: 0.72rem;

  font-weight: 600;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.competence-tag.transversal {
  background: var(--lpi-violet-lighter);
  color: var(--lpi-violet);
}

.competence-tag.disciplinaire {
  background: var(--primary-lighter);
  color: var(--primary-hover);
}

.competence-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.competence-content {
  padding: 1rem;

  background: var(--neutral-10);

  border-left: 4px solid var(--primary);

  border-radius: var(--radius);
}

.competence-content strong {
  display: block;

  margin-bottom: 0.5rem;

  color: var(--primary-hover);

  font-size: 0.85rem;
}

.competence-content p {
  margin: 0;

  line-height: 1.6;

  color: var(--text-secondary);
}

.also-section {
  padding-top: 0.5rem;

  border-top: 1px solid var(--border);
}

.also-title {
  margin-bottom: 0.75rem;

  font-size: 0.85rem;

  font-weight: 600;

  color: var(--text-secondary);

  text-transform: uppercase;

  letter-spacing: 0.04em;
}

.also-tags {
  display: flex;

  flex-wrap: wrap;

  gap: 0.5rem;
}

.also-tag {
  padding: 0.4rem 0.85rem;

  border-radius: 999px;

  background: var(--neutral-10);

  border: 1px solid var(--neutral-20);

  font-size: 0.85rem;

  color: var(--text-primary);
}

@media (max-width: 768px) {
  .competence-grid {
    grid-template-columns: 1fr;
  }

  .step-title {
    font-size: 1.5rem;
  }

  .competence-card {
    padding: 1.25rem;
  }
}
</style>
