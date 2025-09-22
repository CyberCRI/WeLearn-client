<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  goal: number               // 1..17
  size?: number              // taille du carré (px)
  rounded?: number           // rayon d'arrondi (px)
  showNumber?: boolean
  showLabel?: boolean
  /** Lien interne (Vue Router) vers une page détaillée */
  to?: string | Record<string, any>
}>(), {
  size: 112,
  rounded: 16,
  showNumber: true,
  showLabel: true
})

const SDG_COLORS: Record<number, string> = {
  1: '#e5243b',  2: '#dda63a',  3: '#4c9f38',  4: '#c5192d',  5: '#ff3a21',
  6: '#26bde2',  7: '#fcc30b',  8: '#a21942',  9: '#fd6925', 10: '#dd1367',
 11: '#fd9d24', 12: '#bf8b2e', 13: '#3f7e44', 14: '#0a97d9', 15: '#56c02b',
 16: '#00689d', 17: '#19486a',
}

const color = computed(() => SDG_COLORS[props.goal] || '#999999')
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to"
    class="sdg-tile"
    :style="{
      '--size': size + 'px',
      '--radius': rounded + 'px',
      backgroundColor: color
    }"
    role="button"
    @click="!to"
  >
    <div class="content">
      <div v-if="showLabel" class="label" :title="label">{{ goal }}. {{ $t(`sdgs.${goal}`) }}</div>
    </div>
  </component>
</template>

<style scoped>
.sdg-tile {
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.content {
  position: relative;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
  padding: 10px;
}

.label {
    position:relative;
    font-size: 25px; font-weight: 600; line-height: 1.2;
    color: white; text-shadow: 0 1px 2px rgba(0,0,0,.4);
}
</style>
