<script setup lang="ts">
import { ref } from 'vue'
import { useOverlay } from '../composables/useOverlay'
import NuIcon from './NuIcon.vue'

withDefaults(defineProps<{ title?: string; side?: 'left' | 'right'; width?: string }>(), { side: 'right', width: '380px' })
const open = defineModel<boolean>({ default: false })

const panel = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}
useOverlay(open, panel, { onEscape: close })
</script>

<template>
  <Teleport to="body">
    <Transition name="nu-drawer">
      <div v-if="open" class="nu-drawer" :class="`nu-drawer--${side}`" @click.self="close">
        <aside ref="panel" class="nu-drawer__panel" :style="{ width }" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title">
          <header class="nu-drawer__header">
            <slot name="header"><h3 class="nu-drawer__title">{{ title }}</h3></slot>
            <button class="nu-modal__close" type="button" aria-label="Close" @click="close"><NuIcon name="x" /></button>
          </header>
          <div class="nu-drawer__body" data-overlay-body><slot :close="close" /></div>
          <footer v-if="$slots.footer" class="nu-drawer__footer"><slot name="footer" :close="close" /></footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.nu-drawer { position: fixed; inset: 0; z-index: 100; display: flex; background: var(--nu-backdrop); }
.nu-drawer--right { justify-content: flex-end; }
.nu-drawer__panel {
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  height: 100%;
  background: var(--nu-surface);
  color: var(--nu-text);
  box-shadow: var(--nu-shadow-lg);
  outline: 0;
}
.nu-drawer__header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--nu-border);
}
.nu-drawer__title { font-size: 15px; font-weight: 600; }
.nu-drawer__body { flex: 1 1 auto; padding: 14px; overflow-y: auto; }
.nu-drawer__footer { flex: none; display: flex; justify-content: flex-end; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--nu-border); }
.nu-drawer-enter-active, .nu-drawer-leave-active { transition: opacity 0.2s ease; }
.nu-drawer-enter-active .nu-drawer__panel, .nu-drawer-leave-active .nu-drawer__panel { transition: transform 0.2s ease; }
.nu-drawer-enter-from, .nu-drawer-leave-to { opacity: 0; }
.nu-drawer--right.nu-drawer-enter-from .nu-drawer__panel, .nu-drawer--right.nu-drawer-leave-to .nu-drawer__panel { transform: translateX(100%); }
.nu-drawer--left.nu-drawer-enter-from .nu-drawer__panel, .nu-drawer--left.nu-drawer-leave-to .nu-drawer__panel { transform: translateX(-100%); }
</style>
