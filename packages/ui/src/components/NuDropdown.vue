<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

withDefaults(defineProps<{ align?: 'left' | 'right'; width?: string }>(), { align: 'right', width: '220px' })

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const menu = ref<HTMLElement | null>(null)

const ITEM = 'a[href], button:not([disabled]), [role="menuitem"]:not([disabled])'
const items = () => Array.from(menu.value?.querySelectorAll<HTMLElement>(ITEM) ?? [])
const trigger = () => root.value?.querySelector<HTMLElement>('.nu-dropdown__trigger :is(button, a, [tabindex])') ?? null

/** Close; pass `true` to hand focus back to the trigger (keyboard dismissals). */
function close(refocus?: unknown) {
  if (!open.value) return
  open.value = false
  if (refocus === true) trigger()?.focus()
}
async function show(focus: 'first' | 'last' | null = null) {
  open.value = true
  if (!focus) return
  await nextTick()
  const list = items()
  ;(focus === 'first' ? list[0] : list[list.length - 1])?.focus()
}
function move(delta: number) {
  const list = items()
  if (!list.length) return
  const i = list.indexOf(document.activeElement as HTMLElement)
  list[(i + delta + list.length) % list.length]!.focus()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    show(e.key === 'ArrowDown' ? 'first' : 'last')
  }
}
function onMenuKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') (e.preventDefault(), move(1))
  else if (e.key === 'ArrowUp') (e.preventDefault(), move(-1))
  else if (e.key === 'Home') (e.preventDefault(), items()[0]?.focus())
  else if (e.key === 'End') (e.preventDefault(), items().at(-1)?.focus())
  else if (e.key === 'Tab') close()
}
/** Choosing an item closes the menu; use `@click.stop` on an item to keep it open. */
function onMenuClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest(ITEM)) close()
}
function onDocPointer(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) close()
}
function onDocKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    // Don't let an enclosing modal/drawer treat this Escape as its own.
    e.stopImmediatePropagation()
    close(true)
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onDocKey, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onDocKey, true)
})

defineExpose({ close })
</script>

<template>
  <div ref="root" class="nu-dropdown" :class="{ 'is-open': open }">
    <div class="nu-dropdown__trigger" aria-haspopup="menu" :aria-expanded="open" @click="open ? close() : show()" @keydown="onTriggerKeydown">
      <slot name="trigger" :open="open" />
    </div>
    <Transition name="nu-pop">
      <div
        v-if="open"
        ref="menu"
        class="nu-dropdown__menu"
        :class="`nu-dropdown__menu--${align}`"
        :style="{ width }"
        role="menu"
        @keydown="onMenuKeydown"
        @click="onMenuClick"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<style>
.nu-dropdown { position: relative; display: inline-flex; }
.nu-dropdown__trigger { display: inline-flex; }
.nu-dropdown__menu {
  position: absolute;
  top: calc(100% + 4px);
  z-index: 60;
  max-width: calc(100vw - 24px);
  padding: 4px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-lg);
}
.nu-dropdown__menu--right { right: 0; }
.nu-dropdown__menu--left { left: 0; }
.nu-dropdown__header { padding: 6px 8px; font-size: 12px; font-weight: 600; color: var(--nu-text-muted); }
.nu-dropdown__divider { height: 1px; margin: 4px -4px; background: var(--nu-border); }

.nu-pop-enter-active, .nu-pop-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.nu-pop-enter-from, .nu-pop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
