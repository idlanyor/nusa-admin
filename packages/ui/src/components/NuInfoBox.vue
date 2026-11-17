<script setup lang="ts">
import type { Component } from 'vue'
import type { NuColor } from '../types'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: Component
    color?: NuColor
    /** 0–100; shows a thin bar under the value. */
    progress?: number
    description?: string
  }>(),
  { color: 'primary' },
)
</script>

<template>
  <div class="nu-info-box" :class="`nu-c-${color}`">
    <span v-if="icon" class="nu-info-box__icon"><component :is="icon" /></span>
    <div class="nu-info-box__body">
      <div class="nu-info-box__label">{{ label }}</div>
      <div class="nu-info-box__value">{{ value }}</div>
      <div v-if="progress !== undefined" class="nu-info-box__track"><span :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }" /></div>
      <div v-if="description" class="nu-info-box__desc">{{ description }}</div>
    </div>
  </div>
</template>

<style>
.nu-info-box {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 10px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
}
.nu-info-box__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 56px;
  min-height: 56px;
  border-radius: var(--nu-radius-sm);
  background: var(--nu-c);
  color: var(--nu-on-color);
}
.nu-info-box__icon svg { width: 24px; height: 24px; }
.nu-info-box__body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.nu-info-box__label { font-size: 12.5px; color: var(--nu-text-muted); }
.nu-info-box__value { font-size: 19px; font-weight: 700; line-height: 1.3; }
.nu-info-box__track { height: 3px; margin: 4px 0 3px; border-radius: 2px; background: color-mix(in srgb, var(--nu-c) 16%, transparent); overflow: hidden; }
.nu-info-box__track span { display: block; height: 100%; background: var(--nu-c); }
.nu-info-box__desc { font-size: 12px; color: var(--nu-text-muted); }
</style>
