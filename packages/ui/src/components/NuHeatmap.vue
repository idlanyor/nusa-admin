<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'

/**
 * Calendar heatmap (one cell per day, weeks as columns), e.g. activity or contributions.
 * `values` maps YYYY-MM-DD → count. Colors use the sequential `--nu-seq-*` ramp.
 */
const props = withDefaults(defineProps<{ values: Record<string, number>; /** Last day shown (YYYY-MM-DD); default today. */ end?: string; weeks?: number; label?: string; unit?: string }>(), {
  weeks: 26,
  label: 'Activity',
  unit: 'events',
})
const { locale } = useLocale()
const hover = ref<{ date: string; value: number } | null>(null)

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const columns = computed(() => {
  const last = props.end ? new Date(`${props.end}T00:00:00`) : new Date()
  const start = new Date(last)
  start.setDate(last.getDate() - last.getDay() - (props.weeks - 1) * 7)
  const cols: { date: string; value: number; future: boolean; month: number }[][] = []
  for (let w = 0; w < props.weeks; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const day = new Date(start)
      day.setDate(start.getDate() + w * 7 + d)
      col.push({ date: iso(day), value: props.values[iso(day)] ?? 0, future: day > last, month: day.getMonth() })
    }
    cols.push(col)
  }
  return cols
})
const max = computed(() => Math.max(1, ...Object.values(props.values)))
const level = (v: number) => (v <= 0 ? 0 : Math.min(5, Math.ceil((v / max.value) * 5)))
const monthLabels = computed(() =>
  columns.value.map((col, i) => (i === 0 || col[0]!.month !== columns.value[i - 1]![0]!.month ? new Date(`${col[0]!.date}T00:00:00`).toLocaleDateString(locale.value, { month: 'short' }) : '')),
)
const total = computed(() => columns.value.flat().filter((c) => !c.future).reduce((s, c) => s + c.value, 0))
const fmtDate = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(locale.value, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
</script>

<template>
  <figure class="nu-heatmap">
    <div class="nu-heatmap__scroll">
      <div class="nu-heatmap__months" aria-hidden="true"><span v-for="(m, i) in monthLabels" :key="i">{{ m }}</span></div>
      <div class="nu-heatmap__grid" role="img" :aria-label="`${label}: ${total.toLocaleString()} ${unit} in the last ${weeks} weeks`">
        <div v-for="(col, i) in columns" :key="i" class="nu-heatmap__col">
          <span
            v-for="cell in col"
            :key="cell.date"
            class="nu-heatmap__cell"
            :class="{ 'is-future': cell.future }"
            :style="{ background: cell.future ? 'transparent' : `var(--nu-seq-${level(cell.value) || 'empty'})` }"
            @pointerenter="!cell.future && (hover = cell)"
            @pointerleave="hover = null"
          />
        </div>
      </div>
    </div>
    <figcaption class="nu-heatmap__foot">
      <span>{{ hover ? `${hover.value.toLocaleString()} ${unit} · ${fmtDate(hover.date)}` : `${total.toLocaleString()} ${unit}` }}</span>
      <span class="nu-heatmap__legend" aria-hidden="true">Less <i style="background: var(--nu-seq-empty)" /><i v-for="n in 5" :key="n" :style="{ background: `var(--nu-seq-${n})` }" /> More</span>
    </figcaption>
  </figure>
</template>

<style>
.nu-heatmap { margin: 0; }
.nu-heatmap__scroll { overflow-x: auto; direction: ltr; }
.nu-heatmap__months { display: grid; grid-auto-flow: column; grid-auto-columns: 14px; gap: 3px; height: 16px; font-size: 11px; color: var(--nu-text-muted); white-space: nowrap; }
.nu-heatmap__grid { display: flex; gap: 3px; }
.nu-heatmap__col { display: grid; grid-template-rows: repeat(7, 11px); gap: 3px; }
.nu-heatmap__cell { width: 14px; height: 11px; border-radius: 2px; }
.nu-heatmap__cell:not(.is-future):hover { outline: 1px solid var(--nu-text); }
.nu-heatmap__foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 8px; font-size: 12px; color: var(--nu-text-muted); }
.nu-heatmap__legend { display: inline-flex; align-items: center; gap: 3px; }
.nu-heatmap__legend i { width: 10px; height: 10px; border-radius: 2px; }
</style>
