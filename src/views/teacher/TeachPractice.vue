<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SpaceLabel from '@/components/SpaceLabel.vue';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';
import { TEACHING_PRACTICES } from '@/utils/teachingPractices';

// one shared teaching practice: its context, the sustainability connection, what the teacher
// did, the resources, their own account, and a way to adapt it in Activity Design
const route = useRoute();
const colours = TEACHER_SPACE_COLOURS.teach;
const texts = 'journey.teach.practices';
const practice = computed(() => TEACHING_PRACTICES.find((item) => item.id === route.params.id));

// Activity Design starts from the practice's subject and students
const adaptLink = computed(() => ({
  name: 'teach-activity',
  query: practice.value
    ? {
        subject: practice.value.topic,
        students: [practice.value.discipline, practice.value.level].join(', ')
      }
    : {}
}));
</script>
<template>
  <div class="teach-page">
    <div class="teach-content">
      <router-link class="back-link" :to="{ name: 'teach-practices' }">
        ← {{ $t(`${texts}.back`) }}
      </router-link>

      <p v-if="!practice" class="mt-5" data-testid="practice-not-found">
        {{ $t(`${texts}.notFound`) }}
      </p>

      <article v-else class="practice" data-testid="practice-page">
        <div class="mt-5">
          <SpaceLabel :text="$t('journey.teach.spaces.teach.name')" :tint="colours.tint" />
        </div>
        <h1 class="title is-3 is-size-4-mobile mt-3">{{ practice.course }}</h1>

        <section>
          <h2>{{ $t(`${texts}.context`) }}</h2>
          <p>{{ practice.discipline }} · {{ practice.course }} · {{ practice.level }}</p>
        </section>
        <section>
          <h2>{{ $t(`${texts}.connection`) }}</h2>
          <p>{{ practice.topic }}</p>
          <p>{{ practice.why }}</p>
        </section>
        <section>
          <h2>{{ $t(`${texts}.approach`) }}</h2>
          <p>{{ practice.approach }}</p>
        </section>
        <section v-if="practice.resources.length">
          <h2>{{ $t(`${texts}.resources`) }}</h2>
          <ul class="resources">
            <li v-for="resource in practice.resources" :key="resource.url">
              <a :href="resource.url" target="_blank" rel="noopener">{{ resource.title }}</a>
            </li>
          </ul>
        </section>
        <section v-if="practice.materials?.length" data-testid="practice-materials">
          <h2>{{ $t(`${texts}.materials`) }}</h2>
          <ul class="resources">
            <li v-for="material in practice.materials" :key="material.url">
              <a :href="material.url" target="_blank" rel="noopener">{{ material.title }}</a>
            </li>
          </ul>
        </section>
        <section v-if="practice.worked || practice.challenges || practice.adaptations">
          <h2>{{ $t(`${texts}.experience`) }}</h2>
          <p v-if="practice.worked">
            <strong>{{ $t(`${texts}.worked`) }} :</strong> {{ practice.worked }}
          </p>
          <p v-if="practice.challenges">
            <strong>{{ $t(`${texts}.challenges`) }} :</strong> {{ practice.challenges }}
          </p>
          <p v-if="practice.adaptations">
            <strong>{{ $t(`${texts}.adaptations`) }} :</strong> {{ practice.adaptations }}
          </p>
        </section>

        <router-link class="button is-small is-primary mt-5" :to="adaptLink" data-testid="adapt">
          {{ $t(`${texts}.adapt`) }}
        </router-link>
      </article>
    </div>
  </div>
</template>

<style scoped>
.teach-page {
  height: 100%;
  overflow-y: auto;
}

.teach-content {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.practice section {
  margin-top: 1.25rem;
}

.practice h2 {
  font-size: 1rem;
  font-weight: 700;
}

.practice p {
  margin-top: 0.25rem;
}

.resources {
  margin: 0.25rem 0 0 1.25rem;
  list-style: disc;
}
</style>
