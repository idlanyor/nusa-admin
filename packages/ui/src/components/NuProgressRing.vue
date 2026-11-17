<script setup lang="ts">
import { computed } from 'vue'
import type { NuColor } from '../types'

const props = withDefaults(
  defineProps<{ value: number; max?: number; size?: number; thickness?: number; color?: NuColor; label?: string }>(),
  { max: 100, size: 64, thickness: 6, color: 'primary' },
)
const pct = computed(() => Math.min(1, Math.max(0, props.value / props.max)))
const r = computed(() => (props.size - props.thickness) / 2)
const c = computed(() => 2 * Math.PI * r.value)
</script>

<template>
  <span
    class="nu-ring"
    :class="`nu-c-${color}`"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-label="label"
  >
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <g fill="none" :stroke-width="thickness" :transform="`rotate(-90 ${size / 2} ${size / 2})`">
        <circle class="nu-ring__track" :cx="size / 2" :cy="size / 2" :r="r" />
        <circle class="nu-ring__bar" :cx="size / 2" :cy="size / 2" :r="r" stroke-linecap="round" :stroke-dasharray="`${pct * c} ${c}`" />
      </g>
    </svg>
    <span class="nu-ring__label" :style="{ fontSize: `${Math.max(11, Math.round(size * 0.22))}px` }">
      <slot>{{ Math.round(pct * 100) }}%</slot>
    </span>
  </span>
</template>

<style>
.nu-ring { position: relative; flex: none; display: inline-grid; place-items: center; }
.nu-ring svg { position: absolute; inset: 0; }
.nu-ring__track { stroke: color-mix(in srgb, var(--nu-c) 16%, transparent); }
.nu-ring__bar { stroke: var(--nu-c); transition: stroke-dasharray 0.4s ease; }
.nu-ring__label { font-weight: 700; font-variant-numeric: tabular-nums; }
</style>
