<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ data: number[]; color?: string; height?: number; area?: boolean; label?: string }>(),
  { color: 'var(--nu-chart-1)', height: 36, area: true },
)

const W = 100
const points = computed(() => {
  const d = props.data
  if (!d.length) return []
  const min = Math.min(...d)
  const span = Math.max(...d) - min || 1
  const pad = 3
  return d.map((v, i) => [
    d.length === 1 ? W / 2 : (i / (d.length - 1)) * W,
    pad + (1 - (v - min) / span) * (props.height - pad * 2),
  ])
})
const line = computed(() => points.value.map(([x, y], i) => `${i ? 'L' : 'M'}${x!.toFixed(2)} ${y!.toFixed(2)}`).join(' '))
const fill = computed(() => (points.value.length ? `${line.value} L${W} ${props.height} L0 ${props.height} Z` : ''))
</script>

<template>
  <svg
    class="nu-sparkline"
    :viewBox="`0 0 ${W} ${height}`"
    :height="height"
    width="100%"
    preserveAspectRatio="none"
    role="img"
    :aria-label="label ?? 'Trend'"
  >
    <path v-if="area" :d="fill" :fill="color" fill-opacity="0.1" />
    <path :d="line" fill="none" :stroke="color" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
  </svg>
</template>

<style>
.nu-sparkline { display: block; overflow: visible; }
</style>
