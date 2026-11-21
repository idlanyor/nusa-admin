<script setup lang="ts">
import { computed } from 'vue'

/**
 * Semicircle meter for usage values (CPU, memory, disk, quota). Color follows thresholds:
 * below `warn` → primary, from `warn` → warning, from `danger` → danger.
 */
const props = withDefaults(
  defineProps<{ value: number; max?: number; label?: string; unit?: string; size?: number; warn?: number; danger?: number; /** Text under the value, e.g. "6.1 / 16 GB". */ detail?: string }>(),
  { max: 100, unit: '%', size: 140, warn: 70, danger: 90 },
)
const pct = computed(() => Math.min(1, Math.max(0, props.value / props.max)))
const share = computed(() => pct.value * 100)
const color = computed(() => (share.value >= props.danger ? 'var(--nu-danger)' : share.value >= props.warn ? 'var(--nu-warning)' : 'var(--nu-primary)'))
const R = 40
const arc = Math.PI * R
const display = computed(() => (props.unit === '%' ? Math.round(share.value) : Number(props.value.toFixed(1))))
</script>

<template>
  <figure class="nu-gauge" :style="{ width: `${size}px` }">
    <svg :width="size" :height="size * 0.62" viewBox="0 0 100 62" role="meter" :aria-label="label" :aria-valuenow="value" aria-valuemin="0" :aria-valuemax="max">
      <path class="nu-gauge__track" d="M10 52a40 40 0 0 1 80 0" />
      <path class="nu-gauge__bar" d="M10 52a40 40 0 0 1 80 0" :stroke="color" :stroke-dasharray="`${pct * arc} ${arc}`" />
      <text x="50" y="47" text-anchor="middle" class="nu-gauge__value">{{ display }}<tspan class="nu-gauge__unit">{{ unit }}</tspan></text>
    </svg>
    <figcaption>
      <span v-if="label" class="nu-gauge__label">{{ label }}</span>
      <span v-if="detail" class="nu-gauge__detail">{{ detail }}</span>
    </figcaption>
  </figure>
</template>

<style>
.nu-gauge { display: inline-flex; flex-direction: column; align-items: center; margin: 0; }
.nu-gauge svg { display: block; overflow: visible; }
.nu-gauge path { fill: none; stroke-width: 8; stroke-linecap: round; }
.nu-gauge__track { stroke: color-mix(in srgb, var(--nu-text) 10%, transparent); }
.nu-gauge__bar { transition: stroke-dasharray 0.4s ease, stroke 0.2s ease; }
.nu-gauge__value { fill: var(--nu-text); font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
.nu-gauge__unit { fill: var(--nu-text-muted); font-size: 9px; font-weight: 600; }
.nu-gauge figcaption { display: flex; flex-direction: column; align-items: center; margin-top: 2px; text-align: center; }
.nu-gauge__label { font-weight: 600; font-size: 13px; }
.nu-gauge__detail { font-size: 12px; color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
</style>
