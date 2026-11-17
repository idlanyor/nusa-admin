<script setup lang="ts">
import type { NuColor } from '../types'

/** Corner ribbon. Place inside any positioned box (NuCard already is). */
withDefaults(defineProps<{ text: string; color?: NuColor; size?: 'md' | 'lg' }>(), { color: 'primary', size: 'md' })
</script>

<template>
  <div class="nu-ribbon" :class="[`nu-c-${color}`, `nu-ribbon--${size}`]" aria-hidden="true">
    <span>{{ text }}</span>
  </div>
</template>

<style>
.nu-ribbon {
  position: absolute;
  top: -1px;
  inset-inline-end: -1px;
  z-index: 3;
  width: 72px;
  height: 72px;
  overflow: hidden;
  pointer-events: none;
}
.nu-ribbon--lg { width: 96px; height: 96px; }
.nu-ribbon span {
  position: absolute;
  top: 16px;
  inset-inline-end: -26px;
  width: 110px;
  padding: 2px 0;
  background: var(--nu-c);
  color: var(--nu-on-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-align: center;
  text-transform: uppercase;
  transform: rotate(45deg);
}
.nu-ribbon--lg span { top: 22px; inset-inline-end: -30px; width: 140px; font-size: 12px; }
</style>
