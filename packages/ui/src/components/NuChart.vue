<script setup lang="ts">
import { computed, ref } from 'vue'
import { useElementWidth } from '../composables/useElementWidth'
import type { NuChartSeries } from '../types'

const props = withDefaults(
  defineProps<{
    type?: 'line' | 'area' | 'bar'
    series: NuChartSeries[]
    /** One label per data point (x axis). */
    labels: string[]
    height?: number
    /** Format y-axis ticks and tooltip values. */
    format?: (value: number) => string
    /** Accessible summary of what the chart shows. */
    label?: string
  }>(),
  { type: 'line', height: 280 },
)

const el = ref<HTMLElement | null>(null)
const width = useElementWidth(el)
const hover = ref<number | null>(null)

const PAD = { top: 12, right: 14, bottom: 28, left: 48 }
const BAR_MAX = 24
const BAR_GAP = 2

const colored = computed(() =>
  props.series.map((s, i) => ({ ...s, color: s.color ?? `var(--nu-chart-${(i % 8) + 1})` })),
)
const count = computed(() => props.labels.length)
const plotW = computed(() => Math.max(10, width.value - PAD.left - PAD.right))
const plotH = computed(() => props.height - PAD.top - PAD.bottom)

/** Round the axis up to a clean step (1/2/5 × 10ⁿ) so ticks land on readable numbers. */
const axis = computed(() => {
  const max = Math.max(0, ...props.series.flatMap((s) => s.data))
  if (max === 0) return { max: 1, ticks: [0, 1] }
  const rough = max / 4
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough)!
  const top = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v)
  return { max: top, ticks }
})

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const fmtTick = (v: number) => (props.format ? props.format(v) : axis.value.max >= 10000 ? compact.format(v) : v.toLocaleString())
const fmtValue = (v: number) => (props.format ? props.format(v) : v.toLocaleString())

const band = computed(() => plotW.value / Math.max(1, count.value))
const x = (i: number) =>
  props.type === 'bar' || count.value < 2
    ? PAD.left + band.value * (i + 0.5)
    : PAD.left + (i / (count.value - 1)) * plotW.value
const y = (v: number) => PAD.top + (1 - Math.max(0, v) / axis.value.max) * plotH.value
const baseline = computed(() => PAD.top + plotH.value)

const lines = computed(() =>
  colored.value.map((s) => {
    const d = s.data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
    const area = s.data.length ? `${d} L${x(s.data.length - 1).toFixed(1)} ${baseline.value} L${x(0).toFixed(1)} ${baseline.value} Z` : ''
    return { ...s, d, area }
  }),
)

const bars = computed(() => {
  const n = colored.value.length
  const w = Math.max(2, Math.min(BAR_MAX, (band.value * 0.72 - BAR_GAP * (n - 1)) / n))
  const group = w * n + BAR_GAP * (n - 1)
  return colored.value.flatMap((s, si) =>
    s.data.map((v, i) => {
      const left = x(i) - group / 2 + si * (w + BAR_GAP)
      const top = y(v)
      const h = baseline.value - top
      const r = Math.min(4, w / 2, h)
      // Rounded data-end, square at the baseline.
      const d = `M${left} ${baseline.value} V${top + r} Q${left} ${top} ${left + r} ${top} H${left + w - r} Q${left + w} ${top} ${left + w} ${top + r} V${baseline.value} Z`
      return { key: `${si}-${i}`, d, color: s.color, index: i }
    }),
  )
})

/** Thin out x labels so they never collide. */
const labelStep = computed(() => Math.max(1, Math.ceil(count.value / Math.max(1, Math.floor(plotW.value / 64)))))

function onMove(e: PointerEvent) {
  if (!el.value || !count.value) return
  const px = e.clientX - el.value.getBoundingClientRect().left - PAD.left
  const i = props.type === 'bar' || count.value < 2 ? Math.floor(px / band.value) : Math.round((px / plotW.value) * (count.value - 1))
  hover.value = Math.min(count.value - 1, Math.max(0, i))
}

const tipStyle = computed(() => {
  if (hover.value === null) return {}
  const cx = x(hover.value)
  const flip = cx > width.value / 2
  return { left: `${cx}px`, top: `${PAD.top}px`, transform: `translateX(${flip ? 'calc(-100% - 12px)' : '12px'})` }
})
</script>

<template>
  <figure class="nu-chart">
    <ul v-if="colored.length > 1" class="nu-chart__legend">
      <li v-for="s in colored" :key="s.name">
        <span class="nu-chart__swatch" :style="{ background: s.color }" />{{ s.name }}
      </li>
    </ul>
    <div ref="el" class="nu-chart__plot" :style="{ height: `${height}px` }" @pointermove="onMove" @pointerleave="hover = null">
      <svg :width="width" :height="height" role="img" :aria-label="label ?? `${type} chart`">
        <g class="nu-chart__grid">
          <line v-for="t in axis.ticks" :key="t" :x1="PAD.left" :x2="width - PAD.right" :y1="y(t)" :y2="y(t)" />
        </g>
        <g class="nu-chart__ticks">
          <text v-for="t in axis.ticks" :key="t" :x="PAD.left - 8" :y="y(t)" text-anchor="end" dominant-baseline="middle">
            {{ fmtTick(t) }}
          </text>
          <template v-for="(l, i) in labels" :key="i">
            <text v-if="i % labelStep === 0" :x="x(i)" :y="height - 8" text-anchor="middle">{{ l }}</text>
          </template>
        </g>

        <template v-if="type === 'bar'">
          <rect
            v-if="hover !== null"
            class="nu-chart__band"
            :x="PAD.left + band * hover"
            :y="PAD.top"
            :width="band"
            :height="plotH"
          />
          <path v-for="b in bars" :key="b.key" :d="b.d" :fill="b.color" :opacity="hover === null || hover === b.index ? 1 : 0.45" />
        </template>

        <template v-else>
          <line v-if="hover !== null" class="nu-chart__crosshair" :x1="x(hover)" :x2="x(hover)" :y1="PAD.top" :y2="baseline" />
          <template v-for="s in lines" :key="s.name">
            <path v-if="type === 'area'" :d="s.area" :fill="s.color" fill-opacity="0.1" />
            <path :d="s.d" fill="none" :stroke="s.color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
            <circle v-if="hover !== null && s.data[hover] !== undefined" class="nu-chart__dot" :cx="x(hover)" :cy="y(s.data[hover]!)" r="4.5" :fill="s.color" />
          </template>
        </template>
      </svg>

      <div v-if="hover !== null" class="nu-chart__tip" :style="tipStyle">
        <div class="nu-chart__tip-title">{{ labels[hover] }}</div>
        <div v-for="s in colored" :key="s.name" class="nu-chart__tip-row">
          <span class="nu-chart__swatch" :style="{ background: s.color }" />
          <span class="nu-chart__tip-name">{{ s.name }}</span>
          <strong>{{ s.data[hover] === undefined ? '—' : fmtValue(s.data[hover]!) }}</strong>
        </div>
      </div>
    </div>
  </figure>
</template>

<style>
.nu-chart { margin: 0; min-width: 0; }
.nu-chart__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
  font-size: 12.5px;
  color: var(--nu-text-muted);
}
.nu-chart__legend li { display: inline-flex; align-items: center; gap: 6px; }
.nu-chart__swatch { flex: none; width: 10px; height: 10px; border-radius: 3px; }
.nu-chart__plot { position: relative; width: 100%; touch-action: pan-y; }
.nu-chart__plot svg { display: block; }
.nu-chart__grid line { stroke: var(--nu-chart-grid); stroke-width: 1; }
.nu-chart__ticks text { fill: var(--nu-text-muted); font-size: 11.5px; font-variant-numeric: tabular-nums; }
.nu-chart__crosshair { stroke: var(--nu-text-muted); stroke-width: 1; opacity: 0.5; }
.nu-chart__band { fill: var(--nu-text); opacity: 0.05; }
.nu-chart__dot { stroke: var(--nu-surface); stroke-width: 2; }
.nu-chart__tip {
  position: absolute;
  z-index: 5;
  min-width: 130px;
  padding: 8px 10px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow);
  font-size: 12.5px;
  white-space: nowrap;
  pointer-events: none;
}
.nu-chart__tip-title { margin-bottom: 4px; font-weight: 600; }
.nu-chart__tip-row { display: flex; align-items: center; gap: 6px; }
.nu-chart__tip-name { flex: 1; margin-right: 10px; color: var(--nu-text-muted); }
.nu-chart__tip-row strong { font-variant-numeric: tabular-nums; }
</style>
