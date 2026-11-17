<script setup lang="ts">
import type { NuColor } from '../types'

withDefaults(defineProps<{ size?: number; color?: NuColor; label?: string }>(), { size: 20, color: 'primary', label: 'Loading' })
</script>

<template>
  <span
    class="nu-spinner"
    :class="`nu-c-${color}`"
    :style="{ width: `${size}px`, height: `${size}px`, borderWidth: `${Math.max(2, Math.round(size / 9))}px` }"
    role="status"
    :aria-label="label"
  />
</template>

<style>
.nu-spinner {
  flex: none;
  display: inline-block;
  border-style: solid;
  border-color: var(--nu-c);
  border-right-color: transparent;
  border-radius: 50%;
  animation: nu-spin 0.7s linear infinite;
}
</style>
