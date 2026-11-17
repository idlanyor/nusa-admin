<script setup lang="ts">
import { computed } from 'vue'
import NuAvatar from './NuAvatar.vue'

const props = withDefaults(defineProps<{ names: string[]; max?: number; size?: number }>(), { max: 4, size: 30 })
const shown = computed(() => props.names.slice(0, props.max))
const rest = computed(() => props.names.length - shown.value.length)
</script>

<template>
  <span class="nu-avatar-group" :aria-label="names.join(', ')">
    <NuAvatar v-for="n in shown" :key="n" :name="n" :size="size" :title="n" />
    <span v-if="rest > 0" class="nu-avatar nu-avatar-group__more" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }">
      +{{ rest }}
    </span>
  </span>
</template>

<style>
.nu-avatar-group { display: inline-flex; }
.nu-avatar-group > .nu-avatar { box-shadow: 0 0 0 2px var(--nu-surface); background: color-mix(in srgb, var(--nu-c, var(--nu-secondary)) 22%, var(--nu-surface)); }
.nu-avatar-group > .nu-avatar + .nu-avatar { margin-left: -8px; }
.nu-avatar-group__more { --nu-c: var(--nu-secondary); color: var(--nu-text-muted); }
</style>
