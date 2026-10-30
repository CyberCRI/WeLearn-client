<script setup lang="ts">
import { computed } from 'vue';
import { sourceLink } from '@/utils/connections';
import type { DataTable } from '@/utils/activityDesign';

// the figures an activity uses, as a compact table: values copied from one verified document,
// units in the headers, the context they hold in, and where they really come from. a small bar
// chart only when every value is on the same basis and there is a single numeric column
const props = defineProps<{ table: DataTable }>();
const texts = 'journey.teach.activity.result';

const toNumber = (cell: string) => {
  // spaces inside numbers ("105 000", narrow no-break spaces included in \s) are not part of them
  const match = cell.replace(/\s/g, '').match(/-?\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

// one label column and one numeric column, all filled: then bars can be compared
const chart = computed(() => {
  const { rows, columns, isComparable } = props.table;
  if (!isComparable || columns.length !== 2) return null;
  const values = rows.map((row) => toNumber(row[1]));
  if (values.some((value) => value === null || value < 0)) return null;
  const max = Math.max(...(values as number[]));
  if (!max) return null;
  return rows.map((row, index) => ({
    label: row[0],
    value: row[1],
    width: `${Math.max(2, ((values[index] as number) / max) * 100)}%`
  }));
});

const link = computed(() => sourceLink(props.table.document));
</script>
<template>
  <figure class="data-table" data-testid="data-table">
    <figcaption class="caption">{{ table.caption }}</figcaption>
    <div class="table-container">
      <table class="table is-narrow is-fullwidth">
        <thead>
          <tr>
            <th v-for="column in table.columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in table.rows" :key="index">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="chart" class="chart" data-testid="data-chart" aria-hidden="true">
      <div v-for="bar in chart" :key="bar.label" class="bar-row">
        <span class="bar-label">{{ bar.label }}</span>
        <span class="bar-track"><span class="bar" :style="{ width: bar.width }" /></span>
        <span class="bar-value">{{ bar.value }}</span>
      </div>
    </div>

    <p class="context" data-testid="data-context">
      <strong>{{ $t(`${texts}.dataContext`) }} :</strong> {{ table.context }}
    </p>
    <p class="source" data-testid="data-source">
      {{ $t(`${texts}.dataSource`) }} :
      <a :href="link" target="_blank" rel="noopener">{{ table.document.payload.document_title }}</a>
      <span v-if="table.reportedFrom" data-testid="data-reported-from">
        — {{ $t(`${texts}.reportedFrom`, { source: table.reportedFrom }) }}
      </span>
      <span v-if="!table.isComparable" class="muted"> · {{ $t(`${texts}.notComparable`) }}</span>
    </p>
  </figure>
</template>

<style scoped>
.data-table {
  margin: 0.75rem 0 0;
}

.caption {
  font-weight: 600;
}

.table-container {
  margin-top: 0.5rem;
}

.chart {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0.25rem 0 0.75rem;
}

.bar-row {
  display: grid;
  grid-template-columns: 8rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.bar-track {
  height: 0.6rem;
  border-radius: 999px;
  background: var(--neutral-10);
}

.bar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
}

.context,
.source {
  font-size: 0.85rem;
  color: var(--neutral-80);
}

.source {
  margin-top: 0.25rem;
}

.muted {
  color: var(--neutral-70);
}
</style>
