<script setup lang="ts">
import { computed } from 'vue'
import type { NuColor } from '../types'

const props = withDefaults(
  defineProps<{
    src?: string
    /** Used for initials and alt text. */
    name?: string
    size?: number
    color?: NuColor
    status?: 'online' | 'away' | 'busy' | 'offline'
    square?: boolean
  }>(),
  { size: 36, color: 'primary' },
)

const initials = computed(() =>
  (props.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join(''),
)
</script>

<template>
  <span
    class="nu-avatar"
    :class="[`nu-c-${color}`, { 'nu-avatar--square': square }]"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.38)}px` }"
  >
    <img v-if="src" :src="src" :alt="name ?? ''" />
    <span v-else>{{ initials || '?' }}</span>
    <span v-if="status" class="nu-avatar__status" :class="`is-${status}`" :title="status" />
  </span>
</template>

<style>
.nu-avatar {
  position: relative;
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--nu-c) 16%, transparent);
  color: var(--nu-c);
  font-weight: 600;
  line-height: 1;
}
.nu-avatar--square { border-radius: var(--nu-radius-sm); }
.nu-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
.nu-avatar__status {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 28%;
  height: 28%;
  min-width: 8px;
  min-height: 8px;
  max-width: 14px;
  max-height: 14px;
  border: 2px solid var(--nu-surface);
  border-radius: 50%;
  background: var(--nu-secondary);
}
.nu-avatar__status.is-online { background: var(--nu-success); }
.nu-avatar__status.is-away { background: var(--nu-warning); }
.nu-avatar__status.is-busy { background: var(--nu-danger); }
</style>
