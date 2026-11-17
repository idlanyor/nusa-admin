<script setup lang="ts">
import { t } from '../composables/useLocale'
import { onBeforeUnmount, ref, watch } from 'vue'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

const props = defineProps<{
  title?: string
  subtitle?: string
  /** Colored top border, like AdminLTE's `card-outline`. */
  accent?: NuColor
  collapsible?: boolean
  defaultCollapsed?: boolean
  /** Remove body padding (tables, lists, charts that bleed to the edge). */
  flush?: boolean
  loading?: boolean
  /** Fill the header with the accent color (AdminLTE `card-primary`). */
  solid?: boolean
  /** Show a refresh tool; handle `@refresh` (e.g. set `loading`). */
  refreshable?: boolean
  /** Show a tool that expands the card to fill the screen. */
  maximizable?: boolean
  /** Show a tool that removes the card. */
  removable?: boolean
}>()
const emit = defineEmits<{ refresh: []; remove: [] }>()

const collapsed = ref(props.defaultCollapsed ?? false)
const maximized = ref(false)
const removed = ref(false)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') maximized.value = false
}
watch(maximized, (on) => {
  if (typeof document === 'undefined') return
  if (on) document.addEventListener('keydown', onKey)
  else document.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => typeof document !== 'undefined' && document.removeEventListener('keydown', onKey))

function remove() {
  removed.value = true
  emit('remove')
}
</script>

<template>
  <section
    v-if="!removed"
    class="nu-card"
    :class="[
      accent && `nu-c-${accent}`,
      accent && (solid ? 'nu-card--solid' : 'nu-card--accent'),
      { 'is-collapsed': collapsed && !maximized, 'is-maximized': maximized },
    ]"
  >
    <header v-if="title || $slots.header || $slots.tools || collapsible || refreshable || maximizable || removable" class="nu-card__header">
      <slot name="header">
        <div class="nu-card__titles">
          <h3 class="nu-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="nu-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div class="nu-card__tools">
        <slot name="tools" />
        <button v-if="refreshable" class="nu-card__tool" type="button" :aria-label="t('refresh')" @click="emit('refresh')">
          <NuIcon name="refresh" :size="15" />
        </button>
        <button
          v-if="maximizable"
          class="nu-card__tool"
          type="button"
          :aria-pressed="maximized"
          :aria-label="maximized ? t('restoreSize') : t('maximize')"
          @click="maximized = !maximized"
        >
          <NuIcon :name="maximized ? 'minimize' : 'maximize'" :size="15" />
        </button>
        <button
          v-if="collapsible && !maximized"
          class="nu-card__tool"
          type="button"
          :aria-expanded="!collapsed"
          :aria-label="collapsed ? t('expand') : t('collapse')"
          @click="collapsed = !collapsed"
        >
          <NuIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="16" />
        </button>
        <button v-if="removable" class="nu-card__tool" type="button" :aria-label="t('removeCard')" @click="remove">
          <NuIcon name="x" :size="16" />
        </button>
      </div>
    </header>
    <div v-show="!collapsed || maximized" class="nu-card__body" :class="{ 'nu-card__body--flush': flush }">
      <slot />
    </div>
    <footer v-if="$slots.footer" v-show="!collapsed || maximized" class="nu-card__footer"><slot name="footer" /></footer>
    <div v-if="loading" class="nu-card__loading" :aria-label="t('loading')"><span /></div>
  </section>
</template>

<style>
.nu-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
}
.nu-card--accent { border-top: 3px solid var(--nu-c); }
.nu-card--solid { border-color: color-mix(in srgb, var(--nu-c) 45%, var(--nu-border)); }
.nu-card--solid > .nu-card__header {
  border-radius: calc(var(--nu-radius) - 1px) calc(var(--nu-radius) - 1px) 0 0;
  border-bottom-color: transparent;
  background: var(--nu-c);
  color: var(--nu-on-color);
}
.nu-card--solid > .nu-card__header :is(.nu-card__subtitle, .nu-card__tool) { color: inherit; opacity: 0.85; }
.nu-card--solid > .nu-card__header .nu-card__tool:hover { background: color-mix(in srgb, var(--nu-on-color) 18%, transparent); opacity: 1; }
.nu-card.is-maximized {
  position: fixed;
  inset: 8px;
  z-index: 90;
  overflow: auto;
  box-shadow: var(--nu-shadow-lg);
}
.nu-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--nu-border);
}
.nu-card.is-collapsed .nu-card__header { border-bottom-color: transparent; }
.nu-card__titles { min-width: 0; }
.nu-card__title { font-size: 14.5px; font-weight: 600; }
.nu-card__subtitle { margin-top: 1px; font-size: 12.5px; color: var(--nu-text-muted); }
.nu-card__tools { display: flex; align-items: center; gap: 6px; flex: none; }
.nu-card__tool {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text-muted);
  cursor: pointer;
}
.nu-card__tool:hover { background: color-mix(in srgb, var(--nu-text) 8%, transparent); color: var(--nu-text); }
.nu-card__body { flex: 1 1 auto; padding: 14px; min-width: 0; }
.nu-card__body--flush { padding: 0; }
.nu-card__footer {
  padding: 8px 14px;
  border-top: 1px solid var(--nu-border);
  border-radius: 0 0 var(--nu-radius) var(--nu-radius);
  background: var(--nu-surface-2);
}
.nu-card__loading {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  border-radius: inherit;
  background: color-mix(in srgb, var(--nu-surface) 70%, transparent);
}
.nu-card__loading span {
  width: 26px;
  height: 26px;
  border: 3px solid var(--nu-primary);
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: nu-spin 0.7s linear infinite;
}
</style>
