<script setup lang="ts">
import { ref } from 'vue'
import { useOverlay } from '../composables/useOverlay'
import NuIcon from './NuIcon.vue'

const props = withDefaults(
  defineProps<{ title?: string; size?: 'sm' | 'md' | 'lg'; persistent?: boolean }>(),
  { size: 'md' },
)
const open = defineModel<boolean>({ default: false })

const panel = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}
useOverlay(open, panel, { onEscape: () => !props.persistent && close() })
</script>

<template>
  <Teleport to="body">
    <Transition name="nu-modal">
      <div v-if="open" class="nu-modal" @click.self="!persistent && close()">
        <div ref="panel" class="nu-modal__dialog" :class="`nu-modal__dialog--${size}`" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title">
          <header class="nu-modal__header">
            <slot name="header"><h3 class="nu-modal__title">{{ title }}</h3></slot>
            <button class="nu-modal__close" type="button" aria-label="Close" @click="close">
              <NuIcon name="x" />
            </button>
          </header>
          <div class="nu-modal__body" data-overlay-body><slot :close="close" /></div>
          <footer v-if="$slots.footer" class="nu-modal__footer"><slot name="footer" :close="close" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.nu-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: start center;
  padding: 8vh 16px 16px;
  overflow-y: auto;
  background: var(--nu-backdrop);
}
.nu-modal__dialog {
  width: 100%;
  max-width: 520px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  color: var(--nu-text);
  box-shadow: var(--nu-shadow-lg);
  outline: 0;
}
.nu-modal__dialog--sm { max-width: 380px; }
.nu-modal__dialog--lg { max-width: 800px; }
.nu-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--nu-border);
}
.nu-modal__title { font-size: 15px; font-weight: 600; }
.nu-modal__close {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text-muted);
  cursor: pointer;
}
.nu-modal__close:hover { background: color-mix(in srgb, var(--nu-text) 8%, transparent); color: var(--nu-text); }
.nu-modal__body { padding: 14px; }
.nu-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--nu-border);
}

.nu-modal-enter-active, .nu-modal-leave-active { transition: opacity 0.18s ease; }
.nu-modal-enter-active .nu-modal__dialog, .nu-modal-leave-active .nu-modal__dialog { transition: transform 0.18s ease; }
.nu-modal-enter-from, .nu-modal-leave-to { opacity: 0; }
.nu-modal-enter-from .nu-modal__dialog, .nu-modal-leave-to .nu-modal__dialog { transform: translateY(-12px); }
</style>
