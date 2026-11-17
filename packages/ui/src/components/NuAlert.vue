<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NuColor } from '../types'
import NuIcon, { type NuIconName } from './NuIcon.vue'

const props = withDefaults(
  defineProps<{ color?: NuColor; title?: string; dismissible?: boolean }>(),
  { color: 'info' },
)
const emit = defineEmits<{ dismiss: [] }>()

const visible = ref(true)
const ICONS: Record<NuColor, NuIconName> = {
  primary: 'info',
  secondary: 'info',
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  danger: 'x-circle',
}
const icon = computed(() => ICONS[props.color])

function dismiss() {
  visible.value = false
  emit('dismiss')
}
</script>

<template>
  <div v-if="visible" class="nu-alert" :class="`nu-c-${color}`" role="alert">
    <span class="nu-alert__icon"><slot name="icon"><NuIcon :name="icon" /></slot></span>
    <div class="nu-alert__body">
      <div v-if="title" class="nu-alert__title">{{ title }}</div>
      <div class="nu-alert__text"><slot /></div>
    </div>
    <button v-if="dismissible" class="nu-alert__close" type="button" aria-label="Dismiss" @click="dismiss">
      <NuIcon name="x" :size="16" />
    </button>
  </div>
</template>

<style>
.nu-alert {
  display: flex;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid color-mix(in srgb, var(--nu-c) 30%, transparent);
  border-left: 3px solid var(--nu-c);
  border-radius: var(--nu-radius-sm);
  background: color-mix(in srgb, var(--nu-c) 8%, var(--nu-surface));
}
.nu-alert__icon { color: var(--nu-c); padding-top: 1px; }
.nu-alert__body { flex: 1; min-width: 0; }
.nu-alert__title { font-weight: 600; }
.nu-alert__text { color: var(--nu-text); }
.nu-alert__close {
  flex: none;
  align-self: flex-start;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--nu-text-muted);
  cursor: pointer;
}
.nu-alert__close:hover { background: color-mix(in srgb, var(--nu-text) 10%, transparent); color: var(--nu-text); }
</style>
