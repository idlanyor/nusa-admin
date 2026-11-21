<script setup lang="ts">
import { ref, type Component } from 'vue'
import { t } from '../composables/useLocale'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

/**
 * Full-width announcement strip (top of a page or the layout). With `id` + `dismissible`,
 * a closed banner stays closed in this browser until the id changes.
 */
const props = withDefaults(defineProps<{ id?: string; color?: NuColor; icon?: Component; dismissible?: boolean; variant?: 'soft' | 'solid' }>(), {
  color: 'primary',
  variant: 'solid',
})
const KEY = 'nu-banners-dismissed'
const read = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
const visible = ref(!(props.id && read().includes(props.id)))
function dismiss() {
  visible.value = false
  if (!props.id) return
  try {
    localStorage.setItem(KEY, JSON.stringify([...new Set([...read(), props.id])].slice(-50)))
  } catch {
    /* not persisted */
  }
}
</script>

<template>
  <div v-if="visible" class="nu-banner" :class="[`nu-c-${color}`, `nu-banner--${variant}`]" role="region" :aria-label="t('announcement')">
    <component :is="icon" v-if="icon" class="nu-banner__icon" />
    <div class="nu-banner__text"><slot /></div>
    <div v-if="$slots.actions" class="nu-banner__actions"><slot name="actions" /></div>
    <button v-if="dismissible" type="button" class="nu-banner__close" :aria-label="t('dismiss')" @click="dismiss"><NuIcon name="x" :size="15" /></button>
  </div>
</template>

<style>
.nu-banner { display: flex; align-items: center; gap: 10px; padding: 7px 12px; font-size: 13.5px; border-radius: var(--nu-radius-sm); }
.nu-banner--solid { background: var(--nu-c); color: var(--nu-on-color); }
.nu-banner--soft { background: color-mix(in srgb, var(--nu-c) 12%, var(--nu-surface)); color: var(--nu-text); border: 1px solid color-mix(in srgb, var(--nu-c) 30%, transparent); }
.nu-banner__icon { flex: none; width: 17px; height: 17px; }
.nu-banner--soft .nu-banner__icon { color: var(--nu-c); }
.nu-banner__text { flex: 1; min-width: 0; }
.nu-banner__text a { color: inherit; font-weight: 600; text-decoration: underline; }
.nu-banner__actions { display: flex; gap: 6px; flex: none; }
.nu-banner__close { display: grid; flex: none; padding: 3px; border: 0; border-radius: 4px; background: transparent; color: inherit; opacity: 0.8; cursor: pointer; }
.nu-banner__close:hover { opacity: 1; background: color-mix(in srgb, currentColor 15%, transparent); }
</style>
