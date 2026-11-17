<script setup lang="ts">
import { t } from '../composables/useLocale'
import { ref } from 'vue'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

export interface NuTodo {
  id: string | number
  text: string
  done: boolean
  /** Short tag such as "2 days" or "Today". */
  due?: string
  dueColor?: NuColor
}

const props = withDefaults(defineProps<{ addable?: boolean; addPlaceholder?: string; sortable?: boolean }>(), {
  sortable: true,
})
const items = defineModel<NuTodo[]>({ default: () => [] })
const emit = defineEmits<{ add: [text: string] }>()

const draft = ref('')
const dragIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

function toggle(i: number) {
  items.value = items.value.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t))
}
function remove(i: number) {
  items.value = items.value.filter((_, idx) => idx !== i)
}
function add() {
  const text = draft.value.trim()
  if (!text) return
  emit('add', text)
  items.value = [...items.value, { id: `${Date.now()}`, text, done: false }]
  draft.value = ''
}
function drop(target: number) {
  const from = dragIndex.value
  dragIndex.value = overIndex.value = null
  if (from === null || from === target) return
  const next = [...items.value]
  const [moved] = next.splice(from, 1)
  next.splice(target, 0, moved!)
  items.value = next
}
function move(i: number, delta: number) {
  const j = i + delta
  if (j < 0 || j >= items.value.length) return
  const next = [...items.value]
  ;[next[i], next[j]] = [next[j]!, next[i]!]
  items.value = next
}
</script>

<template>
  <div class="nu-todo">
    <ul class="nu-todo__list">
      <li
        v-for="(todo, i) in items"
        :key="todo.id"
        class="nu-todo__item"
        :class="{ 'is-done': todo.done, 'is-over': overIndex === i && dragIndex !== i }"
        :draggable="props.sortable"
        @dragstart="dragIndex = i"
        @dragover.prevent="overIndex = i"
        @dragend="dragIndex = overIndex = null"
        @drop.prevent="drop(i)"
      >
        <span
          v-if="props.sortable"
          class="nu-todo__handle"
          tabindex="0"
          role="button"
          :aria-label="t('reorder', { label: todo.text })"
          @keydown.up.prevent="move(i, -1)"
          @keydown.down.prevent="move(i, 1)"
        >
          <NuIcon name="grip" :size="15" />
        </span>
        <label class="nu-check">
          <input class="nu-check__input" type="checkbox" :checked="todo.done" @change="toggle(i)" />
          <span class="nu-check__box"><NuIcon name="check" :size="12" /></span>
          <span class="nu-todo__text">{{ todo.text }}</span>
        </label>
        <span v-if="todo.due" class="nu-badge nu-badge--soft" :class="`nu-c-${todo.dueColor ?? 'secondary'}`">{{ todo.due }}</span>
        <button class="nu-todo__remove" type="button" :aria-label="t('deleteItem', { label: todo.text })" @click="remove(i)"><NuIcon name="trash" :size="14" /></button>
      </li>
    </ul>
    <form v-if="addable" class="nu-todo__add" @submit.prevent="add">
      <input v-model="draft" class="nu-todo__input" :placeholder="addPlaceholder ?? t('addTask')" :aria-label="addPlaceholder ?? t('addTask')" />
    </form>
  </div>
</template>

<style>
.nu-todo__list { margin: 0; padding: 0; list-style: none; }
.nu-todo__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 8px;
  border-bottom: 1px solid var(--nu-border);
  border-inline-start: 2px solid transparent;
  background: var(--nu-surface);
}
.nu-todo__item:hover { border-inline-start-color: var(--nu-primary); }
.nu-todo__item.is-over { box-shadow: inset 0 2px 0 var(--nu-primary); }
.nu-todo__item .nu-check { flex: 1; min-width: 0; }
.nu-todo__text { min-width: 0; overflow-wrap: anywhere; }
.nu-todo__item.is-done .nu-todo__text { color: var(--nu-text-muted); text-decoration: line-through; }
.nu-todo__handle { display: grid; color: var(--nu-text-muted); cursor: grab; border-radius: 3px; }
.nu-todo__remove {
  display: grid;
  padding: 3px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--nu-text-muted);
  opacity: 0;
  cursor: pointer;
}
.nu-todo__item:is(:hover, :focus-within) .nu-todo__remove { opacity: 1; }
.nu-todo__remove:hover { color: var(--nu-danger); }
.nu-todo__add { padding: 8px 14px; }
.nu-todo__input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px dashed var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text);
  outline: 0;
}
.nu-todo__input:focus { border-style: solid; border-color: var(--nu-primary); }
@media (hover: none) { .nu-todo__remove { opacity: 1; } }
</style>
