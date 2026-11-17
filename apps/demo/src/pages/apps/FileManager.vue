<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, File, FileImage, FileSpreadsheet, FileText, Folder, FolderPlus, HardDrive, MoreHorizontal, Pencil, Trash2, Upload } from 'lucide-vue-next'
import {
  NuButton, NuCard, NuDrawer, NuDropdown, NuDropdownItem, NuEmpty, NuFileUpload, NuIconButton, NuInput, NuModal, NuPageHeader, NuProgress, NuTable,
  NuTreeView, useToast, type NuTableColumn, type NuTreeNode,
} from 'nusa-admin'

interface FileRow { id: number; name: string; folder: string; type: 'pdf' | 'image' | 'sheet' | 'doc' | 'other'; size: number; modified: string; owner: string }

const toast = useToast()
const folders: NuTreeNode[] = [
  { id: 'all', label: 'All files', icon: HardDrive },
  {
    id: 'projects', label: 'Projects', icon: Folder, children: [
      { id: 'website', label: 'Website redesign', icon: Folder },
      { id: 'mobile', label: 'Mobile banking app', icon: Folder },
    ],
  },
  { id: 'finance', label: 'Finance', icon: Folder, children: [{ id: 'invoices', label: 'Invoices', icon: Folder }, { id: 'reports', label: 'Reports', icon: Folder }] },
  { id: 'design', label: 'Design', icon: Folder },
]
const files = ref<FileRow[]>([
  { id: 1, name: 'Homepage wireframe.png', folder: 'website', type: 'image', size: 2_480_000, modified: '2026-11-15', owner: 'Ayu Lestari' },
  { id: 2, name: 'Content plan.docx', folder: 'website', type: 'doc', size: 84_000, modified: '2026-11-12', owner: 'Budi Santoso' },
  { id: 3, name: 'API contract.pdf', folder: 'mobile', type: 'pdf', size: 612_000, modified: '2026-11-14', owner: 'Dimas Pratama' },
  { id: 4, name: 'Test matrix.xlsx', folder: 'mobile', type: 'sheet', size: 142_000, modified: '2026-11-10', owner: 'Eka Putri' },
  { id: 5, name: 'INV-2041.pdf', folder: 'invoices', type: 'pdf', size: 96_000, modified: '2026-11-01', owner: 'Ayu Lestari' },
  { id: 6, name: 'INV-1987.pdf', folder: 'invoices', type: 'pdf', size: 95_000, modified: '2026-10-01', owner: 'Ayu Lestari' },
  { id: 7, name: 'Q3 revenue.xlsx', folder: 'reports', type: 'sheet', size: 318_000, modified: '2026-10-05', owner: 'Gita Maharani' },
  { id: 8, name: 'Brand guidelines.pdf', folder: 'design', type: 'pdf', size: 8_900_000, modified: '2026-09-21', owner: 'Ayu Lestari' },
  { id: 9, name: 'Logo source.svg', folder: 'design', type: 'image', size: 12_000, modified: '2026-11-16', owner: 'Ayu Lestari' },
])
const folder = ref<string | number | null>('all')
const childIds = (id: string | number): (string | number)[] => {
  const find = (list: NuTreeNode[]): NuTreeNode | undefined => list.flatMap((n) => [n, ...(n.children ?? [])]).find((n) => n.id === id)
  const node = find(folders)
  return [id, ...(node?.children ?? []).flatMap((c) => childIds(c.id))]
}
const shown = computed(() => (folder.value === 'all' || folder.value === null ? files.value : files.value.filter((f) => childIds(folder.value!).includes(f.folder))))
const folderName = computed(() => folders.flatMap((n) => [n, ...(n.children ?? [])]).find((n) => n.id === folder.value)?.label ?? 'All files')
const used = computed(() => files.value.reduce((s, f) => s + f.size, 0))

const size = (b: number) => (b < 1e6 ? `${(b / 1e3).toFixed(0)} KB` : `${(b / 1e6).toFixed(1)} MB`)
const typeIcon = { pdf: FileText, image: FileImage, sheet: FileSpreadsheet, doc: FileText, other: File }
const columns: NuTableColumn<FileRow>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'owner', label: 'Owner', sortable: true },
  { key: 'modified', label: 'Modified', sortable: true },
  { key: 'size', label: 'Size', sortable: true, align: 'right', format: size },
  { key: 'actions', label: '', align: 'right', width: '56px' },
]

const uploadOpen = ref(false)
const uploads = ref<File[]>([])
const renaming = ref<FileRow | null>(null)
const newName = ref('')
let seq = 100
function upload() {
  const target = folder.value === 'all' || folder.value === null ? 'projects' : String(folder.value)
  for (const f of uploads.value) {
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    const type: FileRow['type'] = ext === 'pdf' ? 'pdf' : ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(ext) ? 'image' : ['xlsx', 'csv'].includes(ext) ? 'sheet' : ['doc', 'docx', 'md', 'txt'].includes(ext) ? 'doc' : 'other'
    files.value.unshift({ id: ++seq, name: f.name, folder: target, type, size: f.size, modified: new Date().toISOString().slice(0, 10), owner: 'Ayu Lestari' })
  }
  toast.success(`${uploads.value.length} file(s) uploaded to ${folderName.value}.`)
  uploads.value = []
  uploadOpen.value = false
}
function startRename(f: FileRow) {
  renaming.value = f
  newName.value = f.name
}
function rename() {
  if (renaming.value && newName.value.trim()) renaming.value.name = newName.value.trim()
  renaming.value = null
}
function remove(f: FileRow) {
  files.value = files.value.filter((x) => x.id !== f.id)
  toast.info(`${f.name} moved to trash.`)
}
</script>

<template>
  <NuPageHeader title="File manager" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Files' }]">
    <NuButton variant="outline" color="secondary" :icon="FolderPlus" @click="toast.info('New folder (demo).')">New folder</NuButton>
    <NuButton :icon="Upload" @click="uploadOpen = true">Upload</NuButton>
  </NuPageHeader>

  <div class="files">
    <div class="nu-stack" style="--nu-gap: 12px">
      <NuCard title="Folders" flush>
        <NuTreeView v-model="folder" :nodes="folders" :default-expanded="['projects', 'finance']" label="Folders" />
      </NuCard>
      <NuCard title="Storage">
        <NuProgress :value="used" :max="50e6" :label="`${size(used)} of 50 MB`" show-value />
      </NuCard>
    </div>

    <NuCard :title="folderName" :subtitle="`${shown.length} files`" flush>
      <NuTable v-if="shown.length" :columns="columns" :rows="shown" row-key="id" searchable search-placeholder="Search files…" :page-size="8">
        <template #cell-name="{ row }">
          <span class="files__name"><component :is="typeIcon[(row as FileRow).type]" />{{ row.name }}</span>
        </template>
        <template #cell-actions="{ row }">
          <NuDropdown width="170px">
            <template #trigger><NuIconButton :icon="MoreHorizontal" :label="`Actions for ${row.name}`" /></template>
            <NuDropdownItem :icon="Download" @click="toast.info(`${row.name} downloaded (demo).`)">Download</NuDropdownItem>
            <NuDropdownItem :icon="Pencil" @click="startRename(row as FileRow)">Rename</NuDropdownItem>
            <div class="nu-dropdown__divider" />
            <NuDropdownItem :icon="Trash2" danger @click="remove(row as FileRow)">Delete</NuDropdownItem>
          </NuDropdown>
        </template>
      </NuTable>
      <NuEmpty v-else title="This folder is empty" description="Upload files or drop them here.">
        <NuButton size="sm" :icon="Upload" @click="uploadOpen = true">Upload</NuButton>
      </NuEmpty>
    </NuCard>
  </div>

  <NuDrawer v-model="uploadOpen" :title="`Upload to ${folderName}`">
    <NuFileUpload v-model="uploads" multiple hint="Up to 25 MB per file" />
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton :disabled="!uploads.length" @click="upload">Upload {{ uploads.length || '' }}</NuButton>
    </template>
  </NuDrawer>

  <NuModal :model-value="!!renaming" title="Rename file" size="sm" @update:model-value="!$event && (renaming = null)">
    <form id="rename-form" @submit.prevent="rename"><NuInput v-model="newName" label="Name" autofocus /></form>
    <template #footer>
      <NuButton variant="ghost" color="secondary" @click="renaming = null">Cancel</NuButton>
      <NuButton type="submit" form="rename-form">Rename</NuButton>
    </template>
  </NuModal>
</template>

<style>
.files { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 800px) { .files { grid-template-columns: 1fr; } }
.files__name { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; }
.files__name svg { width: 16px; height: 16px; color: var(--nu-text-muted); flex: none; }
</style>
