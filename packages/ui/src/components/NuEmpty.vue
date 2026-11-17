<script setup lang="ts">
import type { Component } from 'vue'
import NuIcon from './NuIcon.vue'

defineProps<{ title: string; description?: string; icon?: Component }>()
</script>

<template>
  <div class="nu-empty">
    <span class="nu-empty__icon"><component :is="icon" v-if="icon" /><NuIcon v-else name="inbox" :size="22" /></span>
    <div class="nu-empty__title">{{ title }}</div>
    <p v-if="description" class="nu-empty__desc">{{ description }}</p>
    <div v-if="$slots.default" class="nu-empty__actions"><slot /></div>
  </div>
</template>

<style>
.nu-empty { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 24px 14px; text-align: center; }
.nu-empty__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 6px;
  border-radius: var(--nu-radius);
  background: color-mix(in srgb, var(--nu-text) 7%, transparent);
  color: var(--nu-text-muted);
}
.nu-empty__icon svg { width: 22px; height: 22px; }
.nu-empty__title { font-weight: 600; }
.nu-empty__desc { max-width: 340px; font-size: 13px; color: var(--nu-text-muted); }
.nu-empty__actions { display: flex; gap: 8px; margin-top: 8px; }
</style>
