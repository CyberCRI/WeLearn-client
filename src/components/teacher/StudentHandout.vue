<script setup lang="ts">
import { ref } from 'vue';
import { useActivityDesignStore } from '@/stores/activityDesign';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';

// the student handout of the approved activity: created from it (no new generation), previewed
// and edited as one text, then copied or downloaded as a printable .docx. what the activity
// lacks for students is listed above it, for the teacher only
const store = useActivityDesignStore();
const texts = 'journey.teach.activity.handout';

const isCopied = ref(false);
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(store.handout?.text || '');
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};

const handleDownload = async () => {
  if (!store.handout) return;
  downloadDocx(await convertMarkdownToDocx(store.handout.text), 'handout.docx');
};
</script>
<template>
  <section class="handout" data-testid="handout">
    <button
      v-if="!store.handout"
      type="button"
      class="button is-small is-primary"
      data-testid="create-handout"
      @click="store.createHandout()"
    >
      {{ $t(`${texts}.create`) }}
    </button>

    <template v-else>
      <h3 class="handout-title">{{ $t(`${texts}.title`) }}</h3>
      <p class="muted">{{ $t(`${texts}.intro`) }}</p>
      <div
        v-if="store.handout.gaps.length"
        class="notification is-warning is-light gaps"
        data-testid="handout-gaps"
      >
        <p>
          <strong>{{ $t(`${texts}.gapsTitle`) }}</strong>
        </p>
        <ul>
          <li v-for="gap in store.handout.gaps" :key="gap">{{ $t(`${texts}.gaps.${gap}`) }}</li>
        </ul>
      </div>
      <textarea
        :value="store.handout.text"
        class="textarea"
        rows="24"
        data-testid="handout-text"
        @input="store.setHandoutText(($event.target as HTMLTextAreaElement).value)"
      />
      <div class="actions">
        <button
          type="button"
          class="button is-small"
          data-testid="copy-handout"
          @click="handleCopy"
        >
          {{ isCopied ? $t(`${texts}.copied`) : $t(`${texts}.copy`) }}
        </button>
        <button
          type="button"
          class="button is-small"
          data-testid="download-handout"
          @click="handleDownload"
        >
          {{ $t(`${texts}.download`) }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          data-testid="recreate-handout"
          @click="store.createHandout()"
        >
          {{ $t(`${texts}.recreate`) }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.handout {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--neutral-20);
}

.handout-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.muted {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.gaps ul {
  margin: 0.25rem 0 0 1.25rem;
  list-style: disc;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
</style>
