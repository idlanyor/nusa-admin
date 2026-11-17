<script setup lang="ts">
import { computed } from 'vue'
import type { NuColor } from '../types'

const props = withDefaults(
  defineProps<{ value: number; max?: number; color?: NuColor; height?: number; label?: string; showValue?: boolean; /** Keep `label` for assistive tech only. */ labelHidden?: boolean }>(),
  { max: 100, color: 'primary', height: 8 },
)
const pct = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div class="nu-progress" :class="`nu-c-${color}`">
    <div v-if="(label && !labelHidden) || showValue" class="nu-progress__head">
      <span>{{ label }}</span>
      <span v-if="showValue" class="nu-progress__value">{{ Math.round(pct) }}%</span>
    </div>
    <div
      class="nu-progress__track"
      :style="{ height: `${height}px` }"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label"
    >
      <div class="nu-progress__bar" :style="{ width: `${pct}%` }" />
    </div>
  </div>
</template>

<style>
.nu-progress__head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12.5px;
}
.nu-progress__value { color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
.nu-progress__track {
  overflow: hidden;
  border-radius: var(--nu-radius-sm);
  background: color-mix(in srgb, var(--nu-c) 16%, transparent);
}
.nu-progress__bar {
  height: 100%;
  border-radius: inherit;
  background: var(--nu-c);
  transition: width 0.4s ease;
}
</style>
