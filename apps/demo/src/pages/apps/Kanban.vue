<script setup lang="ts">
import { ref } from 'vue'
import { MessageSquare, Paperclip, Plus } from 'lucide-vue-next'
import { NuAvatarGroup, NuBadge, NuButton, NuPageHeader, type NuColor } from 'nusa-admin'

interface Task {
  id: number
  title: string
  tag: string
  tagColor: NuColor
  people: string[]
  comments: number
  files: number
}
interface Column {
  key: string
  title: string
  tasks: Task[]
}

let seq = 100
const columns = ref<Column[]>([
  {
    key: 'backlog',
    title: 'Backlog',
    tasks: [
      { id: 1, title: 'Audit color contrast in dark mode', tag: 'Design', tagColor: 'info', people: ['Ayu Lestari'], comments: 2, files: 0 },
      { id: 2, title: 'Add CSV export to orders table', tag: 'Feature', tagColor: 'primary', people: ['Budi Santoso', 'Eka Putri'], comments: 5, files: 1 },
      { id: 3, title: 'Write onboarding emails', tag: 'Content', tagColor: 'secondary', people: ['Citra Dewi'], comments: 0, files: 2 },
    ],
  },
  {
    key: 'progress',
    title: 'In progress',
    tasks: [
      { id: 4, title: 'Invoice PDF layout', tag: 'Feature', tagColor: 'primary', people: ['Dimas Pratama', 'Ayu Lestari'], comments: 8, files: 3 },
      { id: 5, title: 'Fix timezone bug in reports', tag: 'Bug', tagColor: 'danger', people: ['Fajar Nugroho'], comments: 3, files: 0 },
    ],
  },
  {
    key: 'review',
    title: 'Review',
    tasks: [{ id: 6, title: 'Role-based sidebar menu', tag: 'Feature', tagColor: 'primary', people: ['Gita Maharani', 'Budi Santoso', 'Eka Putri'], comments: 4, files: 1 }],
  },
  {
    key: 'done',
    title: 'Done',
    tasks: [
      { id: 7, title: 'Set up CI with Bun', tag: 'Chore', tagColor: 'success', people: ['Hendra Wijaya'], comments: 1, files: 0 },
      { id: 8, title: 'Login page', tag: 'Feature', tagColor: 'primary', people: ['Ayu Lestari'], comments: 2, files: 0 },
    ],
  },
])

const dragging = ref<{ task: Task; from: string } | null>(null)
const over = ref<string | null>(null)

function drop(to: Column) {
  const d = dragging.value
  over.value = null
  dragging.value = null
  if (!d || d.from === to.key) return
  const from = columns.value.find((c) => c.key === d.from)!
  from.tasks = from.tasks.filter((t) => t.id !== d.task.id)
  to.tasks.push(d.task)
}
/** Keyboard / touch alternative to dragging. */
function shift(col: Column, task: Task, dir: -1 | 1) {
  const target = columns.value[columns.value.indexOf(col) + dir]
  if (!target) return
  col.tasks = col.tasks.filter((t) => t.id !== task.id)
  target.tasks.push(task)
}
function add(col: Column) {
  col.tasks.push({ id: ++seq, title: 'New task', tag: 'Feature', tagColor: 'primary', people: ['Ayu Lestari'], comments: 0, files: 0 })
}
</script>

<template>
  <NuPageHeader title="Kanban" subtitle="Drag cards between columns, or use the arrow buttons." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Kanban' }]" />

  <div class="kanban">
    <section
      v-for="(col, ci) in columns"
      :key="col.key"
      class="kanban__col"
      :class="{ 'is-over': over === col.key }"
      @dragover.prevent="over = col.key"
      @dragleave="over === col.key && (over = null)"
      @drop.prevent="drop(col)"
    >
      <header class="kanban__head">
        <strong>{{ col.title }}</strong>
        <NuBadge color="secondary">{{ col.tasks.length }}</NuBadge>
        <NuButton class="kanban__add" size="sm" variant="ghost" color="secondary" :icon="Plus" square :aria-label="`Add task to ${col.title}`" @click="add(col)" />
      </header>
      <article
        v-for="task in col.tasks"
        :key="task.id"
        class="kanban__card"
        draggable="true"
        @dragstart="dragging = { task, from: col.key }"
        @dragend="dragging = null; over = null"
      >
        <NuBadge :color="task.tagColor">{{ task.tag }}</NuBadge>
        <p class="kanban__title">{{ task.title }}</p>
        <div class="nu-between">
          <NuAvatarGroup :names="task.people" :size="22" :max="3" />
          <span class="kanban__meta">
            <span v-if="task.comments"><MessageSquare />{{ task.comments }}</span>
            <span v-if="task.files"><Paperclip />{{ task.files }}</span>
            <button type="button" :disabled="ci === 0" :aria-label="`Move ${task.title} left`" @click="shift(col, task, -1)">←</button>
            <button type="button" :disabled="ci === columns.length - 1" :aria-label="`Move ${task.title} right`" @click="shift(col, task, 1)">→</button>
          </span>
        </div>
      </article>
      <p v-if="!col.tasks.length" class="kanban__empty">Drop a card here</p>
    </section>
  </div>
</template>

<style>
.kanban { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(250px, 1fr); gap: 12px; overflow-x: auto; padding-bottom: 6px; align-items: start; }
.kanban__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface-2);
}
.kanban__col.is-over { border-color: var(--nu-primary); background: color-mix(in srgb, var(--nu-primary) 6%, var(--nu-surface-2)); }
.kanban__head { display: flex; align-items: center; gap: 8px; padding: 0 2px; }
.kanban__add { margin-inline-start: auto; }
.kanban__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 10px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
  cursor: grab;
}
.kanban__card > .nu-between { width: 100%; }
.kanban__title { font-weight: 500; }
.kanban__meta { display: flex; align-items: center; gap: 8px; color: var(--nu-text-muted); font-size: 12px; }
.kanban__meta span { display: inline-flex; align-items: center; gap: 3px; }
.kanban__meta svg { width: 13px; height: 13px; }
.kanban__meta button { padding: 0 4px; border: 1px solid var(--nu-border); border-radius: 3px; background: var(--nu-surface); color: var(--nu-text-muted); cursor: pointer; }
.kanban__meta button:disabled { opacity: 0.35; cursor: not-allowed; }
.kanban__empty { padding: 14px; border: 1.5px dashed var(--nu-border); border-radius: var(--nu-radius-sm); text-align: center; color: var(--nu-text-muted); font-size: 13px; }
</style>
