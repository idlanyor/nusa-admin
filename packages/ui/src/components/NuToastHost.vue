<script setup lang="ts">
import { t } from '../composables/useLocale'
import { useToast } from '../composables/useToast'
import type { NuColor } from '../types'
import NuIcon, { type NuIconName } from './NuIcon.vue'

const { toasts, dismiss } = useToast()
const ICONS: Record<NuColor, NuIconName> = {
  primary: 'info',
  secondary: 'info',
  info: 'info',
  success: 'check-circle',
  warning: 'alert',
  danger: 'x-circle',
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup tag="div" name="nu-toast" class="nu-toasts" aria-live="polite">
      <div v-for="toast in toasts" :key="toast.id" class="nu-toast" :class="`nu-c-${toast.color}`" role="status">
        <NuIcon class="nu-toast__icon" :name="ICONS[toast.color]" />
        <div class="nu-toast__body">
          <div v-if="toast.title" class="nu-toast__title">{{ toast.title }}</div>
          <div>{{ toast.message }}</div>
        </div>
        <button class="nu-toast__close" type="button" :aria-label="t('dismiss')" @click="dismiss(toast.id)">
          <NuIcon name="x" :size="15" />
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style>
.nu-toasts {
  position: fixed;
  top: 16px;
  inset-inline-end: 16px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}
.nu-toast {
  display: flex;
  gap: 10px;
  padding: 9px 10px 9px 12px;
  border: 1px solid var(--nu-border);
  border-inline-start: 3px solid var(--nu-c);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  box-shadow: var(--nu-shadow-lg);
  pointer-events: auto;
}
.nu-toast__icon { color: var(--nu-c); margin-top: 1px; }
.nu-toast__body { flex: 1; min-width: 0; font-size: 13.5px; }
.nu-toast__title { font-weight: 600; }
.nu-toast__close {
  flex: none;
  align-self: flex-start;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--nu-text-muted);
  cursor: pointer;
}
.nu-toast__close:hover { color: var(--nu-text); }
.nu-toast-enter-active, .nu-toast-leave-active, .nu-toast-move { transition: all 0.22s ease; }
.nu-toast-enter-from, .nu-toast-leave-to { opacity: 0; transform: translateX(24px); }
.nu-toast-leave-active { position: absolute; inset-inline-end: 0; inset-inline-start: 0; }
</style>
