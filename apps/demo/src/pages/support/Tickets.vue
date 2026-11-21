<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LifeBuoy, Plus } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuDrawer, NuFileUpload, NuInput, NuPageHeader, NuSegmented, NuSelect, NuStatCard, NuTable, NuTextarea,
  rules, useForm, useToast, type NuTableColumn,
} from 'nusa-admin'
import { createTicket, priorityColor, statusColor, tickets, type Ticket } from '../../tickets'

const router = useRouter()
const toast = useToast()
const status = ref('active')
const rows = computed(() => tickets.filter((t) => (status.value === 'all' ? true : status.value === 'active' ? t.status !== 'Closed' : t.status === status.value)))
const count = (s: Ticket['status']) => tickets.filter((t) => t.status === s).length
const columns: NuTableColumn<Ticket>[] = [
  { key: 'id', label: '#', sortable: true, width: '70px' },
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'assignee', label: 'Assignee' },
  { key: 'updated', label: 'Last update', sortable: true },
]

const creating = ref(false)
const files = ref<File[]>([])
const form = useForm(
  { subject: '', category: 'Technical' as Ticket['category'], priority: 'Normal' as Ticket['priority'], body: '' },
  { subject: [rules.required(), rules.minLength(6)], body: [rules.required(), rules.minLength(20, 'Describe the problem in a few sentences (20+ characters).')] },
)
const submit = form.handleSubmit(async (v) => {
  const t = createTicket({ ...v, customer: 'Ayu Lestari', attachments: files.value.map((f) => f.name) })
  creating.value = false
  form.reset()
  files.value = []
  toast.success(`Ticket #${t.id} created.`)
  router.push(`/support/tickets/${t.id}`)
})
</script>

<template>
  <NuPageHeader title="Support tickets" subtitle="Questions, problems and requests from customers." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Support' }]">
    <NuButton :icon="Plus" @click="creating = true">New ticket</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-6 nu-col-lg-3"><NuStatCard label="Open" :value="count('Open')" :icon="LifeBuoy" color="info" /></div>
      <div class="nu-col-6 nu-col-lg-3"><NuStatCard label="Waiting on customer" :value="count('Pending')" color="warning" /></div>
      <div class="nu-col-6 nu-col-lg-3"><NuStatCard label="Answered" :value="count('Answered')" color="success" /></div>
      <div class="nu-col-6 nu-col-lg-3"><NuStatCard label="Avg. first reply" value="38 min" :delta="-12" invert-delta delta-label="vs last week" /></div>
    </div>

    <NuCard flush>
      <NuTable :columns="columns" :rows="rows" row-key="id" searchable search-placeholder="Search tickets…" :page-size="10">
        <template #toolbar>
          <NuSegmented v-model="status" size="sm" label="Status" :options="[{ label: 'Active', value: 'active' }, { label: 'Open', value: 'Open' }, { label: 'Pending', value: 'Pending' }, { label: 'Closed', value: 'Closed' }, { label: 'All', value: 'all' }]" />
        </template>
        <template #cell-id="{ row }"><span class="nu-tabular nu-text-muted">#{{ row.id }}</span></template>
        <template #cell-subject="{ row }">
          <RouterLink :to="`/support/tickets/${row.id}`" class="nu-fw-600">{{ row.subject }}</RouterLink>
          <div class="nu-text-sm nu-text-muted">{{ row.category }} · {{ row.customer }} · {{ (row as Ticket).messages.length }} messages</div>
        </template>
        <template #cell-priority="{ row }"><NuBadge :color="priorityColor[(row as Ticket).priority]">{{ row.priority }}</NuBadge></template>
        <template #cell-status="{ row }"><NuBadge :color="statusColor[(row as Ticket).status]" dot>{{ row.status }}</NuBadge></template>
        <template #cell-assignee="{ row }">
          <span v-if="row.assignee" class="nu-cluster" style="flex-wrap: nowrap; --nu-gap: 6px"><NuAvatar :name="row.assignee" :size="22" />{{ row.assignee }}</span>
          <span v-else class="nu-text-muted">Unassigned</span>
        </template>
      </NuTable>
    </NuCard>
  </div>

  <NuDrawer v-model="creating" title="New ticket" width="440px">
    <form id="ticket-form" class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="submit">
      <NuInput v-bind="form.field('subject')" label="Subject" required />
      <div class="nu-row" style="--nu-gap: 12px">
        <div class="nu-col-6"><NuSelect v-bind="form.field('category')" label="Category" :options="['Technical', 'Billing', 'Sales', 'Account'].map((c) => ({ label: c, value: c }))" /></div>
        <div class="nu-col-6"><NuSelect v-bind="form.field('priority')" label="Priority" :options="['Low', 'Normal', 'High', 'Urgent'].map((c) => ({ label: c, value: c }))" /></div>
      </div>
      <NuTextarea v-bind="form.field('body')" label="Describe the problem" :rows="6" required />
      <NuFileUpload v-model="files" multiple label="Attach screenshots or logs" hint="Optional, up to 10 MB each" />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="ticket-form" :loading="form.submitting.value">Create ticket</NuButton>
    </template>
  </NuDrawer>
</template>
