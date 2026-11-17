<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuPageHeader, NuSwitch, useToast } from 'nusa-admin'

interface Row { id: number; name: string; age: number; country: string; married: boolean }
const toast = useToast()
const countries = ['Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Vietnam']
let seq = 5
const rows = ref<Row[]>([
  { id: 1, name: 'Ayu Lestari', age: 29, country: 'Indonesia', married: false },
  { id: 2, name: 'Budi Santoso', age: 34, country: 'Indonesia', married: true },
  { id: 3, name: 'Siti Aminah', age: 41, country: 'Malaysia', married: true },
  { id: 4, name: 'Wei Ling', age: 26, country: 'Singapore', married: false },
  { id: 5, name: 'Somchai Dee', age: 38, country: 'Thailand', married: true },
])
const editing = ref<number | null>(null)
const draft = reactive<Row>({ id: 0, name: '', age: 0, country: countries[0]!, married: false })

function edit(r: Row) {
  Object.assign(draft, r)
  editing.value = r.id
}
function save() {
  if (!draft.name.trim() || !(draft.age > 0)) {
    toast.error('Name and a positive age are required.')
    return
  }
  const i = rows.value.findIndex((r) => r.id === editing.value)
  if (i !== -1) rows.value[i] = { ...draft, name: draft.name.trim() }
  editing.value = null
}
function cancel() {
  if (editing.value !== null && !rows.value.find((r) => r.id === editing.value)?.name) rows.value = rows.value.filter((r) => r.id !== editing.value)
  editing.value = null
}
function add() {
  const row = { id: ++seq, name: '', age: 18, country: countries[0]!, married: false }
  rows.value.unshift(row)
  edit(row)
}
function remove(id: number) {
  rows.value = rows.value.filter((r) => r.id !== id)
}
</script>

<template>
  <NuPageHeader title="Editable grid" subtitle="Inline edit, add and delete rows." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Tables' }, { label: 'Editable' }]">
    <NuButton :icon="Plus" :disabled="editing !== null" @click="add">Add row</NuButton>
  </NuPageHeader>

  <NuCard flush>
    <div style="overflow-x: auto">
      <table class="st st--hover grid">
        <thead><tr><th>Name</th><th style="width: 90px">Age</th><th style="width: 170px">Country</th><th style="width: 100px">Married</th><th style="width: 90px" /></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id" :class="{ 'is-editing': editing === r.id }" @keydown.enter="editing === r.id && save()" @keydown.esc="editing === r.id && cancel()">
            <template v-if="editing === r.id">
              <td><input v-model="draft.name" class="grid__input" aria-label="Name" autofocus /></td>
              <td><input v-model.number="draft.age" class="grid__input" type="number" min="1" aria-label="Age" /></td>
              <td>
                <select v-model="draft.country" class="grid__input" aria-label="Country"><option v-for="c in countries" :key="c">{{ c }}</option></select>
              </td>
              <td><NuSwitch v-model="draft.married" aria-label="Married" /></td>
              <td class="grid__actions">
                <NuButton size="sm" variant="ghost" color="success" :icon="Check" square aria-label="Save" @click="save" />
                <NuButton size="sm" variant="ghost" color="secondary" :icon="X" square aria-label="Cancel" @click="cancel" />
              </td>
            </template>
            <template v-else>
              <td>{{ r.name }}</td>
              <td class="nu-tabular">{{ r.age }}</td>
              <td>{{ r.country }}</td>
              <td><NuBadge :color="r.married ? 'success' : 'secondary'">{{ r.married ? 'Yes' : 'No' }}</NuBadge></td>
              <td class="grid__actions">
                <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="`Edit ${r.name}`" :disabled="editing !== null" @click="edit(r)" />
                <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="`Delete ${r.name}`" :disabled="editing !== null" @click="remove(r.id)" />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer><span class="nu-text-sm nu-text-muted">Enter saves, Esc cancels. {{ rows.length }} rows.</span></template>
  </NuCard>
</template>

<style>
.grid tr.is-editing td { background: color-mix(in srgb, var(--nu-primary) 6%, transparent); }
.grid__input { width: 100%; height: 28px; padding: 0 8px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: var(--nu-surface); color: var(--nu-text); }
.grid__input:focus { outline: 0; border-color: var(--nu-primary); }
.grid__actions { text-align: right; white-space: nowrap; }
</style>
