<script setup lang="ts">
import { t } from '../composables/useLocale'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch, type Component } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useOverlay } from '../composables/useOverlay'
import type { NuMenuItem } from '../types'
import NuIcon from './NuIcon.vue'

export interface NuCommand {
  label: string
  group?: string
  icon?: Component
  /** Extra words to match, e.g. synonyms. */
  keywords?: string
  /** Secondary text on the right (pages get their menu path). */
  description?: string
  /** Shortcut hint shown on the right, e.g. "⌘D". */
  hint?: string
  to?: RouteLocationRaw
  href?: string
  action?: () => void
}

/**
 * Ctrl/⌘+K command palette. Pages come from the sidebar `menu`; add your own `commands`.
 * `fallback` turns the typed text into one more command (e.g. "Search for …").
 */
const props = withDefaults(
  defineProps<{
    menu?: NuMenuItem[]
    commands?: NuCommand[]
    placeholder?: string
    /** Listen for Ctrl/⌘+K globally. */
    hotkey?: boolean
    fallback?: (query: string) => NuCommand | null
  }>(),
  { menu: () => [], commands: () => [], hotkey: true },
)
const open = defineModel<boolean>({ default: false })

const router = useRouter()
const id = useId()
const panel = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const query = ref('')
const active = ref(0)

useOverlay(open, panel, { onEscape: () => (open.value = false) })

function fromMenu(items: NuMenuItem[], group = t('pages'), trail: string[] = []): NuCommand[] {
  let current = group
  return items.flatMap((item) => {
    if (item.header) {
      current = item.label
      return []
    }
    if (item.children?.length) return fromMenu(item.children, current, [...trail, item.label])
    if (!item.to && (!item.href || item.href === '#')) return []
    return [{ label: item.label, group: current, icon: item.icon, keywords: trail.join(' '), description: trail.join(' › ') || undefined, to: item.to, href: item.to ? undefined : item.href }]
  })
}
const all = computed(() => [...props.commands, ...fromMenu(props.menu)])

/** Simple ranking: label prefix > word prefix > substring > keyword match. */
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return all.value.slice(0, 50)
  const scored = all.value
    .map((c) => {
      const label = c.label.toLowerCase()
      const score = label.startsWith(q) ? 0 : label.split(/\s+/).some((w) => w.startsWith(q)) ? 1 : label.includes(q) ? 2 : `${c.keywords ?? ''} ${c.group ?? ''}`.toLowerCase().includes(q) ? 3 : -1
      return { c, score }
    })
    .filter((x) => x.score >= 0)
    .sort((a, b) => a.score - b.score)
    .map((x) => x.c)
  const extra = props.fallback?.(query.value.trim())
  return extra ? [...scored, { ...extra, group: extra.group ?? t('search').replace('…', '') }] : scored
})
const grouped = computed(() => {
  const groups: { name: string; items: { cmd: NuCommand; index: number }[] }[] = []
  results.value.forEach((cmd, index) => {
    const name = cmd.group ?? t('commands')
    let g = groups.find((x) => x.name === name)
    if (!g) groups.push((g = { name, items: [] }))
    g.items.push({ cmd, index })
  })
  return groups
})

function run(cmd: NuCommand | undefined) {
  if (!cmd) return
  open.value = false
  if (cmd.action) cmd.action()
  else if (cmd.to) router.push(cmd.to)
  else if (cmd.href) window.open(cmd.href, '_blank', 'noopener')
}
function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown') (e.preventDefault(), (active.value = n ? (active.value + 1) % n : 0))
  else if (e.key === 'ArrowUp') (e.preventDefault(), (active.value = n ? (active.value - 1 + n) % n : 0))
  else if (e.key === 'Enter') (e.preventDefault(), run(results.value[active.value]))
}
watch(query, () => (active.value = 0))
watch(active, async (i) => {
  await nextTick()
  document.getElementById(`${id}-${i}`)?.scrollIntoView({ block: 'nearest' })
})
watch(open, async (isOpen) => {
  if (!isOpen) return
  query.value = ''
  active.value = 0
  await nextTick()
  input.value?.focus()
})

function onHotkey(e: KeyboardEvent) {
  if (props.hotkey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}
onMounted(() => document.addEventListener('keydown', onHotkey))
onBeforeUnmount(() => document.removeEventListener('keydown', onHotkey))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="nu-cmdk" @click.self="open = false">
      <div ref="panel" class="nu-cmdk__panel" role="dialog" aria-modal="true" :aria-label="t('commandPalette')" tabindex="-1">
        <div class="nu-cmdk__search">
          <NuIcon name="search" :size="16" />
          <input
            ref="input"
            v-model="query"
            :placeholder="placeholder ?? t('commandPlaceholder')"
            role="combobox"
            aria-expanded="true"
            :aria-controls="`${id}-list`"
            :aria-activedescendant="results.length ? `${id}-${active}` : undefined"
            aria-autocomplete="list"
            @keydown="onKey"
          />
          <kbd>Esc</kbd>
        </div>
        <div :id="`${id}-list`" class="nu-cmdk__list" role="listbox">
          <template v-for="g in grouped" :key="g.name">
            <div class="nu-cmdk__group" role="presentation">{{ g.name }}</div>
            <div
              v-for="{ cmd, index } in g.items"
              :id="`${id}-${index}`"
              :key="index"
              class="nu-cmdk__item"
              :class="{ 'is-active': index === active }"
              role="option"
              :aria-selected="index === active"
              @pointermove="active = index"
              @click="run(cmd)"
            >
              <span class="nu-cmdk__icon"><component :is="cmd.icon" v-if="cmd.icon" /><NuIcon v-else name="chevron-right" :size="14" /></span>
              <span class="nu-grow nu-truncate">{{ cmd.label }}</span>
              <span v-if="cmd.description" class="nu-cmdk__trail">{{ cmd.description }}</span>
              <kbd v-if="cmd.hint">{{ cmd.hint }}</kbd>
            </div>
          </template>
          <div v-if="!results.length" class="nu-cmdk__empty">{{ t('noResultsFor', { query }) }}</div>
        </div>
        <footer class="nu-cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> {{ t('toNavigate') }}</span><span><kbd>Enter</kbd> {{ t('toOpen') }}</span></footer>
      </div>
    </div>
  </Teleport>
</template>

<style>
.nu-cmdk { position: fixed; inset: 0; z-index: 110; display: flex; justify-content: center; align-items: flex-start; padding: 12vh 16px 16px; background: var(--nu-backdrop); }
.nu-cmdk__panel { width: 100%; max-width: 580px; overflow: hidden; border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); color: var(--nu-text); box-shadow: var(--nu-shadow-lg); outline: 0; }
.nu-cmdk__search { display: flex; align-items: center; gap: 10px; padding: 0 14px; border-bottom: 1px solid var(--nu-border); color: var(--nu-text-muted); }
.nu-cmdk__search input { flex: 1; min-width: 0; height: 46px; border: 0; outline: 0; background: transparent; color: var(--nu-text); font-size: 15px; }
.nu-cmdk kbd { padding: 1px 5px; border: 1px solid var(--nu-border); border-radius: 4px; background: var(--nu-surface-2); color: var(--nu-text-muted); font-size: 11px; }
.nu-cmdk__list { max-height: min(400px, 55vh); padding: 6px; overflow-y: auto; }
.nu-cmdk__group { padding: 8px 8px 4px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--nu-text-muted); }
.nu-cmdk__item { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: var(--nu-radius-sm); cursor: pointer; }
.nu-cmdk__item.is-active { background: color-mix(in srgb, var(--nu-primary) 12%, transparent); color: var(--nu-primary); }
.nu-cmdk__icon { display: grid; place-items: center; width: 18px; color: var(--nu-text-muted); }
.nu-cmdk__item.is-active .nu-cmdk__icon { color: inherit; }
.nu-cmdk__icon svg { width: 16px; height: 16px; }
.nu-cmdk__trail { font-size: 12px; color: var(--nu-text-muted); white-space: nowrap; }
.nu-cmdk__empty { padding: 20px; text-align: center; color: var(--nu-text-muted); }
.nu-cmdk__foot { display: flex; gap: 14px; padding: 7px 14px; border-top: 1px solid var(--nu-border); background: var(--nu-surface-2); font-size: 12px; color: var(--nu-text-muted); }
.nu-cmdk__foot kbd { margin-inline-end: 2px; }
</style>
