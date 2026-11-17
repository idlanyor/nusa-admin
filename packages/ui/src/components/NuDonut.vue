<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NuDonutSegment } from '../types'

const props = withDefaults(
  defineProps<{
    segments: NuDonutSegment[]
    size?: number
    thickness?: number
    /** Caption under the center total. */
    totalLabel?: string
    format?: (value: number) => string
  }>(),
  { size: 176, thickness: 22, totalLabel: 'Total' },
)

const hover = ref<number | null>(null)
const GAP = 2

const fmt = (v: number) => (props.format ? props.format(v) : v.toLocaleString())
const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))
const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const arcs = computed(() => {
  let offset = 0
  return props.segments.map((s, i) => {
    const share = total.value ? s.value / total.value : 0
    const len = share * circumference.value
    const arc = {
      ...s,
      color: s.color ?? `var(--nu-chart-${(i % 8) + 1})`,
      share,
      dash: `${Math.max(0, len - GAP)} ${circumference.value - Math.max(0, len - GAP)}`,
      offset: -offset,
    }
    offset += len
    return arc
  })
})

const center = computed(() => {
  const a = hover.value === null ? null : arcs.value[hover.value]
  return a ? { value: fmt(a.value), label: a.label } : { value: fmt(total.value), label: props.totalLabel }
})
</script>

<template>
  <figure class="nu-donut">
    <div class="nu-donut__ring" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" role="img" :aria-label="`${totalLabel}: ${fmt(total)}`">
        <g :transform="`rotate(-90 ${size / 2} ${size / 2})`" fill="none" :stroke-width="thickness">
          <circle
            v-for="(a, i) in arcs"
            :key="a.label"
            :cx="size / 2"
            :cy="size / 2"
            :r="radius"
            :stroke="a.color"
            :stroke-dasharray="a.dash"
            :stroke-dashoffset="a.offset"
            :opacity="hover === null || hover === i ? 1 : 0.4"
            @pointerenter="hover = i"
            @pointerleave="hover = null"
          />
        </g>
      </svg>
      <div class="nu-donut__center">
        <strong>{{ center.value }}</strong>
        <span>{{ center.label }}</span>
      </div>
    </div>
    <ul class="nu-donut__legend">
      <li v-for="(a, i) in arcs" :key="a.label" :class="{ 'is-dim': hover !== null && hover !== i }" @pointerenter="hover = i" @pointerleave="hover = null">
        <span class="nu-donut__swatch" :style="{ background: a.color }" />
        <span class="nu-donut__name">{{ a.label }}</span>
        <span class="nu-donut__value">{{ fmt(a.value) }}</span>
        <span class="nu-donut__share">{{ (a.share * 100).toFixed(0) }}%</span>
      </li>
    </ul>
  </figure>
</template>

<style>
.nu-donut { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px 20px; margin: 0; }
.nu-donut__ring { position: relative; flex: none; }
.nu-donut__ring svg { display: block; }
.nu-donut__ring circle { transition: opacity 0.15s ease; }
.nu-donut__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
}
.nu-donut__center strong { font-size: 22px; font-weight: 700; line-height: 1.2; }
.nu-donut__center span { font-size: 12px; color: var(--nu-text-muted); }
.nu-donut__legend { flex: 1 1 180px; display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: 13px; }
.nu-donut__legend li { display: flex; align-items: center; gap: 8px; transition: opacity 0.15s ease; }
.nu-donut__legend li.is-dim { opacity: 0.5; }
.nu-donut__swatch { flex: none; width: 10px; height: 10px; border-radius: 3px; }
.nu-donut__name { flex: 1; min-width: 0; }
.nu-donut__value { font-weight: 600; font-variant-numeric: tabular-nums; }
.nu-donut__share { width: 36px; text-align: right; color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
</style>
