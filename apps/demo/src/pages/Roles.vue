<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, ShieldCheck } from 'lucide-vue-next'
import { NuAvatarGroup, NuBadge, NuButton, NuCard, NuInput, NuModal, NuPageHeader, NuTextarea, useToast } from 'nusa-admin'

interface Role { key: string; name: string; description: string; members: string[]; locked?: boolean; perms: Set<string> }
const toast = useToast()
const resources = [
  { key: 'users', label: 'Users' },
  { key: 'orders', label: 'Orders' },
  { key: 'projects', label: 'Projects' },
  { key: 'billing', label: 'Billing' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
]
const actions = ['view', 'create', 'edit', 'delete'] as const
const all = resources.flatMap((r) => actions.map((a) => `${r.key}.${a}`))
const roles = ref<Role[]>([
  { key: 'admin', name: 'Administrator', description: 'Full access to everything.', members: ['Ayu Lestari', 'Hendra Wijaya'], locked: true, perms: new Set(all) },
  { key: 'editor', name: 'Editor', description: 'Manages projects and orders; no billing or settings.', members: ['Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri'], perms: new Set(['users.view', 'orders.view', 'orders.create', 'orders.edit', 'projects.view', 'projects.create', 'projects.edit', 'projects.delete', 'reports.view']) },
  { key: 'viewer', name: 'Viewer', description: 'Read-only access.', members: ['Fajar Nugroho', 'Gita Maharani', 'Indah Permata'], perms: new Set(['users.view', 'orders.view', 'projects.view', 'reports.view']) },
])
const active = ref('editor')
const role = computed(() => roles.value.find((r) => r.key === active.value)!)
const dirty = ref(false)

function toggle(perm: string) {
  if (role.value.locked) return
  const p = role.value.perms
  p.has(perm) ? p.delete(perm) : p.add(perm)
  // a resource you can change but not see is meaningless: grant view with any other action
  const [res, act] = perm.split('.')
  if (act !== 'view' && p.has(perm)) p.add(`${res}.view`)
  if (act === 'view' && !p.has(perm)) actions.forEach((a) => p.delete(`${res}.${a}`))
  dirty.value = true
}
function toggleRow(res: string) {
  if (role.value.locked) return
  const has = actions.every((a) => role.value.perms.has(`${res}.${a}`))
  actions.forEach((a) => (has ? role.value.perms.delete(`${res}.${a}`) : role.value.perms.add(`${res}.${a}`)))
  dirty.value = true
}
function save() {
  dirty.value = false
  toast.success(`${role.value.name} permissions saved.`)
}

const creating = ref(false)
const draft = ref({ name: '', description: '' })
function create() {
  if (!draft.value.name.trim()) return
  const key = draft.value.name.toLowerCase().replace(/\W+/g, '-')
  roles.value.push({ key, name: draft.value.name.trim(), description: draft.value.description, members: [], perms: new Set(['reports.view']) })
  active.value = key
  creating.value = false
  draft.value = { name: '', description: '' }
}
</script>

<template>
  <NuPageHeader title="Roles & permissions" subtitle="What each role can see and do." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Roles' }]">
    <NuButton :icon="Plus" @click="creating = true">New role</NuButton>
  </NuPageHeader>

  <div class="roles">
    <div class="nu-stack" style="--nu-gap: 10px">
      <button v-for="r in roles" :key="r.key" type="button" class="role-card" :class="{ 'is-active': r.key === active }" @click="active = r.key">
        <div class="nu-between">
          <strong>{{ r.name }}</strong>
          <NuBadge v-if="r.locked" color="secondary"><ShieldCheck style="width: 12px; height: 12px" /> Built-in</NuBadge>
        </div>
        <p>{{ r.description }}</p>
        <div class="nu-between">
          <NuAvatarGroup v-if="r.members.length" :names="r.members" :size="24" :max="4" />
          <small v-else class="nu-text-muted">No members</small>
          <small class="nu-text-muted">{{ r.perms.size }}/{{ all.length }} permissions</small>
        </div>
      </button>
    </div>

    <NuCard :title="role.name" :subtitle="role.locked ? 'Built-in role — permissions can’t be changed.' : 'Click a cell to toggle; click a row name to toggle the whole row.'" flush>
      <div style="overflow-x: auto">
        <table class="st perm">
          <thead>
            <tr><th>Resource</th><th v-for="a in actions" :key="a">{{ a }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="res in resources" :key="res.key">
              <td><button type="button" class="perm__row" :disabled="role.locked" @click="toggleRow(res.key)">{{ res.label }}</button></td>
              <td v-for="a in actions" :key="a">
                <label class="nu-check" :class="{ 'is-disabled': role.locked }">
                  <input class="nu-check__input" type="checkbox" :checked="role.perms.has(`${res.key}.${a}`)" :disabled="role.locked" :aria-label="`${res.label}: ${a}`" @change="toggle(`${res.key}.${a}`)" />
                  <span class="nu-check__box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template v-if="!role.locked" #footer>
        <div class="nu-between">
          <span class="nu-text-sm nu-text-muted">{{ dirty ? 'Unsaved changes' : 'Saved' }}</span>
          <NuButton size="sm" :disabled="!dirty" @click="save">Save permissions</NuButton>
        </div>
      </template>
    </NuCard>
  </div>

  <NuModal v-model="creating" title="New role" size="sm">
    <form id="role-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="create">
      <NuInput v-model="draft.name" label="Name" required autofocus />
      <NuTextarea v-model="draft.description" label="Description" :rows="2" />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="role-form">Create role</NuButton>
    </template>
  </NuModal>
</template>

<style>
.roles { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 900px) { .roles { grid-template-columns: 1fr; } }
.role-card { display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 10px 12px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); color: var(--nu-text); text-align: start; cursor: pointer; }
.role-card:hover { border-color: color-mix(in srgb, var(--nu-primary) 50%, var(--nu-border)); }
.role-card.is-active { border-color: var(--nu-primary); box-shadow: 0 0 0 1px var(--nu-primary); }
.role-card p { font-size: 13px; color: var(--nu-text-muted); }
.perm th:not(:first-child), .perm td:not(:first-child) { width: 90px; text-align: center; text-transform: capitalize; }
.perm .nu-check { justify-content: center; }
.perm__row { padding: 0; border: 0; background: none; color: var(--nu-text); font-weight: 500; cursor: pointer; }
.perm__row:hover:not(:disabled) { color: var(--nu-primary); }
.perm__row:disabled { cursor: default; }
</style>
