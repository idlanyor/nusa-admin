<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'

/** Click-to-open panel anchored to a trigger, for rich content (forms, details). Closes on outside click and Escape. */
withDefaults(defineProps<{ placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'; width?: string; title?: string }>(), {
  placement: 'bottom-start',
  width: '280px',
})
const open = defineModel<boolean>({ default: false })
const id = useId()
const root = ref<HTMLElement | null>(null)

function close(refocus = false) {
  if (!open.value) return
  open.value = false
  if (refocus) root.value?.querySelector<HTMLElement>('.nu-popover__trigger :is(button, a, [tabindex])')?.focus()
}
const onDoc = (e: PointerEvent) => open.value && root.value && !root.value.contains(e.target as Node) && close()
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open.value && (e.stopPropagation(), close(true))
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="nu-popover" @keydown="onKey">
    <div class="nu-popover__trigger" :aria-expanded="open" :aria-controls="id" @click="open = !open">
      <slot name="trigger" :open="open" />
    </div>
    <Transition name="nu-pop">
      <div v-if="open" :id="id" class="nu-popover__panel" :class="`nu-popover__panel--${placement}`" :style="{ width }" role="dialog" :aria-label="title">
        <div v-if="title" class="nu-popover__title">{{ title }}</div>
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<style>
.nu-popover { position: relative; display: inline-flex; }
.nu-popover__trigger { display: inline-flex; }
.nu-popover__panel {
  position: absolute;
  z-index: 60;
  max-width: calc(100vw - 24px);
  padding: 10px 12px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-lg);
}
.nu-popover__panel--bottom-start { top: calc(100% + 6px); inset-inline-start: 0; }
.nu-popover__panel--bottom-end { top: calc(100% + 6px); inset-inline-end: 0; }
.nu-popover__panel--top-start { bottom: calc(100% + 6px); inset-inline-start: 0; }
.nu-popover__panel--top-end { bottom: calc(100% + 6px); inset-inline-end: 0; }
.nu-popover__title { margin-bottom: 6px; font-weight: 600; }
</style>
