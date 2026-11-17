<script setup lang="ts">
import type { Component } from 'vue'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: Component
    color?: NuColor
    /** `solid` fills the tile with the color (AdminLTE "small-box" look). */
    variant?: 'soft' | 'solid'
    /** Signed change in percent, e.g. 12.5 or -3.2. */
    delta?: number
    /** What the delta compares against, e.g. "vs last month". */
    deltaLabel?: string
    /** Set when a decrease is the good direction (costs, churn, errors). */
    invertDelta?: boolean
  }>(),
  { color: 'primary', variant: 'soft' },
)
</script>

<template>
  <div class="nu-stat" :class="[`nu-c-${color}`, `nu-stat--${variant}`]">
    <div class="nu-stat__main">
      <div class="nu-stat__label">{{ label }}</div>
      <div class="nu-stat__value">{{ value }}</div>
      <div v-if="delta !== undefined || deltaLabel" class="nu-stat__delta">
        <span
          v-if="delta !== undefined"
          class="nu-stat__trend"
          :class="(delta >= 0) !== !!invertDelta ? 'is-good' : 'is-bad'"
        >
          <NuIcon :name="delta >= 0 ? 'arrow-up' : 'arrow-down'" :size="13" />
          {{ Math.abs(delta) }}%
        </span>
        <span v-if="deltaLabel" class="nu-stat__delta-label">{{ deltaLabel }}</span>
      </div>
    </div>
    <div v-if="icon" class="nu-stat__icon"><component :is="icon" /></div>
    <div v-if="$slots.default" class="nu-stat__extra"><slot /></div>
  </div>
</template>

<style>
.nu-stat {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
}
.nu-stat__label { font-size: 13px; color: var(--nu-text-muted); }
.nu-stat__value {
  margin-top: 2px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.nu-stat__delta { display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 12.5px; }
.nu-stat__trend { display: inline-flex; align-items: center; gap: 2px; font-weight: 600; }
.nu-stat__trend.is-good { color: var(--nu-success); }
.nu-stat__trend.is-bad { color: var(--nu-danger); }
.nu-stat__delta-label { color: var(--nu-text-muted); }
.nu-stat__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--nu-radius);
  background: color-mix(in srgb, var(--nu-c) 14%, transparent);
  color: var(--nu-c);
}
.nu-stat__icon svg { width: 20px; height: 20px; }
.nu-stat__extra { grid-column: 1 / -1; min-width: 0; }

.nu-stat--solid { border-color: transparent; background: var(--nu-c); color: var(--nu-on-color); }
.nu-stat--solid .nu-stat__label,
.nu-stat--solid .nu-stat__delta-label,
.nu-stat--solid .nu-stat__trend { color: inherit; opacity: 0.85; }
.nu-stat--solid .nu-stat__icon { background: color-mix(in srgb, var(--nu-on-color) 18%, transparent); color: inherit; }
</style>
