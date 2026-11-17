<script setup lang="ts">
import type { NuColor } from '../types'

withDefaults(defineProps<{ color?: NuColor; title?: string }>(), { color: 'info' })
</script>

<template>
  <div class="nu-callout" :class="`nu-c-${color}`">
    <div v-if="title" class="nu-callout__title">{{ title }}</div>
    <div class="nu-callout__body"><slot /></div>
  </div>
</template>

<style>
.nu-callout {
  padding: 10px 14px;
  border: 1px solid var(--nu-border);
  border-left: 4px solid var(--nu-c);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
}
.nu-callout__title { margin-bottom: 2px; font-weight: 700; color: var(--nu-c); }
.nu-callout__body { color: var(--nu-text-muted); }
</style>
