<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import NuIcon from './NuIcon.vue'

export interface NuTreeNode {
  id: string | number
  label: string
  icon?: Component
  /** Short text on the right, e.g. a count or size. */
  meta?: string
  children?: NuTreeNode[]
}

/** Expandable tree with keyboard support (↑↓ move, →← open/close, Enter select). v-model is the selected id. */
const props = withDefaults(defineProps<{ nodes: NuTreeNode[]; defaultExpanded?: (string | number)[]; label?: string }>(), { label: 'Tree' })
const selected = defineModel<string | number | null>({ default: null })
const emit = defineEmits<{ select: [node: NuTreeNode] }>()
const expanded = ref(new Set(props.defaultExpanded ?? []))
const focusId = ref<string | number | null>(null)

/** Visible rows in order, with depth. */
const rows = computed(() => {
  const out: { node: NuTreeNode; depth: number }[] = []
  const walk = (list: NuTreeNode[], depth: number) => {
    for (const node of list) {
      out.push({ node, depth })
      if (node.children?.length && expanded.value.has(node.id)) walk(node.children, depth + 1)
    }
  }
  walk(props.nodes, 0)
  return out
})
const parentOf = (id: string | number, list = props.nodes, parent: NuTreeNode | null = null): NuTreeNode | null => {
  for (const n of list) {
    if (n.id === id) return parent
    const found = n.children ? parentOf(id, n.children, n) : null
    if (found) return found
  }
  return null
}

function toggle(node: NuTreeNode, force?: boolean) {
  if (!node.children?.length) return
  const next = new Set(expanded.value)
  if (force ?? !next.has(node.id)) next.add(node.id)
  else next.delete(node.id)
  expanded.value = next
}
function choose(node: NuTreeNode) {
  selected.value = node.id
  focusId.value = node.id
  emit('select', node)
}
function moveFocus(to: NuTreeNode | undefined) {
  if (!to) return
  focusId.value = to.id
  document.getElementById(`nu-tree-${String(to.id)}`)?.focus()
}
function onKey(e: KeyboardEvent, node: NuTreeNode) {
  const i = rows.value.findIndex((r) => r.node.id === node.id)
  if (e.key === 'ArrowDown') (e.preventDefault(), moveFocus(rows.value[i + 1]?.node))
  else if (e.key === 'ArrowUp') (e.preventDefault(), moveFocus(rows.value[i - 1]?.node))
  else if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (node.children?.length && !expanded.value.has(node.id)) toggle(node, true)
    else moveFocus(node.children?.[0])
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (expanded.value.has(node.id)) toggle(node, false)
    else moveFocus(parentOf(node.id) ?? undefined)
  } else if (e.key === 'Enter' || e.key === ' ') (e.preventDefault(), choose(node))
}
const tabbable = (id: string | number) => (focusId.value ?? selected.value ?? rows.value[0]?.node.id) === id
</script>

<template>
  <ul class="nu-tree" role="tree" :aria-label="label">
    <li
      v-for="{ node, depth } in rows"
      :id="`nu-tree-${String(node.id)}`"
      :key="node.id"
      class="nu-tree__row"
      :class="{ 'is-selected': selected === node.id }"
      role="treeitem"
      :aria-level="depth + 1"
      :aria-expanded="node.children?.length ? expanded.has(node.id) : undefined"
      :aria-selected="selected === node.id"
      :tabindex="tabbable(node.id) ? 0 : -1"
      :style="{ '--nu-depth': depth }"
      @click="choose(node)"
      @keydown="onKey($event, node)"
    >
      <span class="nu-tree__caret" :class="{ 'is-open': expanded.has(node.id), 'is-leaf': !node.children?.length }" @click.stop="toggle(node)">
        <NuIcon name="chevron-right" :size="14" />
      </span>
      <component :is="node.icon" v-if="node.icon" class="nu-tree__icon" />
      <span class="nu-tree__label">{{ node.label }}</span>
      <span v-if="node.meta" class="nu-tree__meta">{{ node.meta }}</span>
    </li>
  </ul>
</template>

<style>
.nu-tree { margin: 0; padding: 4px; list-style: none; font-size: 13.5px; }
.nu-tree__row {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding-inline: calc(4px + var(--nu-depth) * 16px) 8px;
  border-radius: var(--nu-radius-sm);
  cursor: pointer;
  outline: 0;
}
.nu-tree__row:hover { background: color-mix(in srgb, var(--nu-text) 5%, transparent); }
.nu-tree__row:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--nu-primary) 60%, transparent); }
.nu-tree__row.is-selected { background: color-mix(in srgb, var(--nu-primary) 12%, transparent); color: var(--nu-primary); font-weight: 600; }
.nu-tree__caret { display: grid; place-items: center; width: 18px; height: 18px; color: var(--nu-text-muted); transition: transform var(--nu-transition); }
.nu-tree__caret.is-open { transform: rotate(90deg); }
[dir='rtl'] .nu-tree__caret.is-open { transform: scaleX(-1) rotate(90deg); }
.nu-tree__caret.is-leaf { visibility: hidden; }
.nu-tree__icon { flex: none; width: 16px; height: 16px; color: var(--nu-text-muted); }
.nu-tree__row.is-selected .nu-tree__icon { color: inherit; }
.nu-tree__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nu-tree__meta { font-size: 12px; color: var(--nu-text-muted); font-weight: 400; font-variant-numeric: tabular-nums; }
</style>
