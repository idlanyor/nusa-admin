<script setup lang="ts">
import type { NuColor } from '../types'

withDefaults(
  defineProps<{ color?: NuColor; variant?: 'soft' | 'solid' | 'outline'; pill?: boolean; dot?: boolean }>(),
  { color: 'primary', variant: 'soft' },
)
</script>

<template>
  <span class="nu-badge" :class="[`nu-c-${color}`, `nu-badge--${variant}`, { 'nu-badge--pill': pill }]">
    <span v-if="dot" class="nu-badge__dot" />
    <slot />
  </span>
</template>

<style>
.nu-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  border: 1px solid transparent;
  border-radius: 3px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}
.nu-badge--pill { border-radius: 999px; }
.nu-badge--soft { background: color-mix(in srgb, var(--nu-c) 14%, transparent); color: var(--nu-c); }
.nu-badge--solid { background: var(--nu-c); color: var(--nu-on-color); }
.nu-badge--outline { border-color: color-mix(in srgb, var(--nu-c) 50%, transparent); color: var(--nu-c); }
.nu-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
</style>
