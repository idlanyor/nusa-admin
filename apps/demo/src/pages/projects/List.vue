<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { NuAvatarGroup, NuBadge, NuButton, NuCard, NuModal, NuPageHeader, NuProgress, NuSegmented, NuTable, useToast, type NuTableColumn } from 'nusa-admin'
import { projectStatusColor, projects as seed, type Project } from '../../data'

const toast = useToast()
const projects = ref<Project[]>([...seed])
const status = ref('all')
const rows = computed(() => projects.value.filter((p) => status.value === 'all' || p.status === status.value))
const removing = ref<Project | null>(null)

const columns: NuTableColumn<Project>[] = [
  { key: 'name', label: 'Project', sortable: true },
  { key: 'team', label: 'Team' },
  { key: 'progress', label: 'Progress', sortable: true, width: '180px' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: '', align: 'right', width: '120px' },
]

function remove() {
  if (!removing.value) return
  projects.value = projects.value.filter((p) => p.id !== removing.value!.id)
  toast.info(`${removing.value.name} deleted.`)
  removing.value = null
}
</script>

<template>
  <NuPageHeader title="Projects" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Projects' }]">
    <NuButton :icon="Plus" to="/projects/new">New project</NuButton>
  </NuPageHeader>

  <NuCard flush>
    <NuTable :columns="columns" :rows="rows" row-key="id" searchable search-placeholder="Search projects…" :page-size="10">
      <template #toolbar>
        <NuSegmented v-model="status" size="sm" label="Status" :options="[{ label: 'All', value: 'all' }, { label: 'In progress', value: 'In progress' }, { label: 'Done', value: 'Done' }, { label: 'On hold', value: 'On hold' }]" />
      </template>
      <template #cell-name="{ row }">
        <RouterLink :to="`/projects/${row.id}`" class="nu-fw-600">{{ row.name }}</RouterLink>
        <div class="nu-text-sm nu-text-muted">{{ row.client }} · due {{ row.end }}</div>
      </template>
      <template #cell-team="{ row }"><NuAvatarGroup :names="row.team" :size="26" :max="3" /></template>
      <template #cell-progress="{ row }">
        <div class="nu-cluster" style="flex-wrap: nowrap">
          <NuProgress class="nu-grow" :value="row.progress" :height="5" :color="row.progress === 100 ? 'success' : 'primary'" :label="`${row.name} progress`" label-hidden />
          <span class="nu-text-sm nu-tabular">{{ row.progress }}%</span>
        </div>
      </template>
      <template #cell-status="{ row }"><NuBadge :color="projectStatusColor[row.status as Project['status']]" dot>{{ row.status }}</NuBadge></template>
      <template #cell-actions="{ row }">
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Eye" square :aria-label="`View ${row.name}`" :to="`/projects/${row.id}`" />
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="`Edit ${row.name}`" :to="`/projects/${row.id}/edit`" />
        <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="`Delete ${row.name}`" @click="removing = row as Project" />
      </template>
    </NuTable>
  </NuCard>

  <NuModal :model-value="!!removing" title="Delete project?" size="sm" @update:model-value="!$event && (removing = null)">
    <p>{{ removing?.name }} and its files will be removed.</p>
    <template #footer>
      <NuButton variant="ghost" color="secondary" @click="removing = null">Cancel</NuButton>
      <NuButton color="danger" @click="remove">Delete</NuButton>
    </template>
  </NuModal>
</template>
