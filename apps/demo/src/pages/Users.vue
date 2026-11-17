<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuDrawer, NuInput, NuModal, NuPageHeader, NuSegmented, NuSelect, NuSwitch, NuTable,
  useToast, type NuTableColumn,
} from 'nusa-admin'

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  active: boolean
  joined: string
}

const toast = useToast()
const names = ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri', 'Fajar Nugroho', 'Gita Maharani', 'Hendra Wijaya', 'Indah Permata', 'Joko Susilo', 'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini', 'Nanda Saputra']
const roles: User['role'][] = ['Admin', 'Editor', 'Viewer', 'Editor', 'Viewer']
let seq = names.length
const users = ref<User[]>(
  names.map((name, i) => ({
    id: i + 1,
    name,
    email: `${name.split(' ')[0]!.toLowerCase()}@example.com`,
    role: roles[i % roles.length]!,
    active: i % 4 !== 3,
    joined: new Date(2026, 9 - (i % 9), 3 + i).toISOString().slice(0, 10),
  })),
)

const columns: NuTableColumn<User>[] = [
  { key: 'name', label: 'User', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'active', label: 'Status', sortable: true },
  { key: 'joined', label: 'Joined', sortable: true },
  { key: 'actions', label: '', align: 'right', width: '90px' },
]
const roleColor = { Admin: 'primary', Editor: 'info', Viewer: 'secondary' } as const
const roleOptions = ['Admin', 'Editor', 'Viewer'].map((r) => ({ label: r, value: r }))

const filter = ref('all')
const selected = ref<(string | number)[]>([])
function removeMany(ids: (string | number)[]) {
  users.value = users.value.filter((u) => !ids.includes(u.id))
  selected.value = []
  toast.info(`${ids.length} user(s) removed.`)
}
const rows = computed(() => users.value.filter((u) => filter.value === 'all' || (filter.value === 'active') === u.active))

const drawer = ref(false)
const editing = ref<number | null>(null)
const form = reactive({ name: '', email: '', role: 'Viewer' as User['role'], active: true })
const error = ref('')
const removing = ref<User | null>(null)

function openForm(user?: User) {
  editing.value = user?.id ?? null
  Object.assign(form, user ? { name: user.name, email: user.email, role: user.role, active: user.active } : { name: '', email: '', role: 'Viewer', active: true })
  error.value = ''
  drawer.value = true
}
function save() {
  if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
    error.value = 'Enter a name and a valid email address.'
    return
  }
  const existing = users.value.find((u) => u.id === editing.value)
  if (existing) Object.assign(existing, form)
  else users.value.unshift({ id: ++seq, ...form, joined: new Date().toISOString().slice(0, 10) })
  drawer.value = false
  toast.success(existing ? 'User updated.' : 'User added.')
}
function remove() {
  const u = removing.value
  if (!u) return
  users.value = users.value.filter((x) => x.id !== u.id)
  removing.value = null
  toast.info(`${u.name} was removed.`)
}
</script>

<template>
  <NuPageHeader title="Users" subtitle="A CRUD list: table, filter, drawer form and confirm dialog." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Users' }]">
    <NuButton :icon="Plus" @click="openForm()">Add user</NuButton>
  </NuPageHeader>

  <NuCard flush>
    <NuTable v-model:selected="selected" :columns="columns" :rows="rows" row-key="id" searchable search-placeholder="Search users…" :page-size="8" selectable exportable="users.csv">
      <template #bulk="{ selected: ids }">
        <NuButton size="sm" variant="soft" color="danger" :icon="Trash2" @click="removeMany(ids)">Remove selected</NuButton>
      </template>
      <template #toolbar>
        <NuSegmented v-model="filter" size="sm" label="Status filter" :options="[{ label: 'All', value: 'all' }, { label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]" />
      </template>
      <template #cell-name="{ row }">
        <div class="nu-cluster">
          <NuAvatar :name="row.name" :size="30" :status="row.active ? 'online' : 'offline'" />
          <div>
            <div class="nu-fw-600">{{ row.name }}</div>
            <div class="nu-text-sm nu-text-muted">{{ row.email }}</div>
          </div>
        </div>
      </template>
      <template #cell-role="{ row }"><NuBadge :color="roleColor[row.role as User['role']]">{{ row.role }}</NuBadge></template>
      <template #cell-active="{ row }"><NuBadge :color="row.active ? 'success' : 'secondary'" dot>{{ row.active ? 'Active' : 'Inactive' }}</NuBadge></template>
      <template #cell-actions="{ row }">
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="`Edit ${row.name}`" @click="openForm(row as User)" />
        <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="`Delete ${row.name}`" @click="removing = row as User" />
      </template>
    </NuTable>
  </NuCard>

  <NuDrawer v-model="drawer" :title="editing ? 'Edit user' : 'Add user'">
    <form id="user-form" class="nu-stack" style="--nu-gap: 10px" novalidate @submit.prevent="save">
      <NuInput v-model="form.name" label="Full name" required autocomplete="name" />
      <NuInput v-model="form.email" label="Email" type="email" required autocomplete="email" :error="error" />
      <NuSelect v-model="form.role" label="Role" :options="roleOptions" />
      <NuSwitch v-model="form.active" label="Active" />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="user-form">{{ editing ? 'Save changes' : 'Add user' }}</NuButton>
    </template>
  </NuDrawer>

  <NuModal :model-value="!!removing" title="Remove user?" size="sm" @update:model-value="!$event && (removing = null)">
    <p>{{ removing?.name }} will lose access immediately.</p>
    <template #footer>
      <NuButton variant="ghost" color="secondary" @click="removing = null">Cancel</NuButton>
      <NuButton color="danger" @click="remove">Remove</NuButton>
    </template>
  </NuModal>
</template>
