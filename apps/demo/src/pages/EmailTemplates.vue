<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mail, Send } from 'lucide-vue-next'
import {
  NuBadge, NuButton, NuCard, NuCombobox, NuInput, NuList, NuListItem, NuPageHeader, NuSegmented, NuTable, NuTextarea, useConfirm, useToast,
  type NuTableColumn,
} from 'nusa-admin'

interface Template { key: string; name: string; subject: string; body: string }
const toast = useToast()
const { confirm } = useConfirm()
const templates = ref<Template[]>([
  { key: 'welcome', name: 'Welcome', subject: 'Welcome to {{app_name}}, {{name}}!', body: 'Hi {{name}},\n\nThanks for signing up. Your workspace is ready at {{dashboard_url}}.\n\nNeed help? Just reply to this email.\n\n— The {{app_name}} team' },
  { key: 'invoice', name: 'Invoice paid', subject: 'Receipt for {{invoice_id}}', body: 'Hi {{name}},\n\nWe received {{amount}} for invoice {{invoice_id}}. Thank you!\n\nDownload: {{invoice_url}}' },
  { key: 'reset', name: 'Password reset', subject: 'Reset your {{app_name}} password', body: 'Hi {{name}},\n\nClick the link below to choose a new password. It expires in 30 minutes.\n\n{{reset_url}}\n\nIf you didn’t ask for this, ignore this email.' },
  { key: 'renewal', name: 'Renewal reminder', subject: 'Your plan renews on {{renew_date}}', body: 'Hi {{name}},\n\nYour {{plan}} plan renews on {{renew_date}} for {{amount}}. Top up your wallet to avoid interruptions.' },
])
const SAMPLE: Record<string, string> = { app_name: 'Nusa Admin', name: 'Ayu', dashboard_url: 'https://app.example.com', invoice_id: 'INV-2041', amount: '$237.00', invoice_url: 'https://app.example.com/i/2041', reset_url: 'https://app.example.com/reset/…', plan: 'Team', renew_date: '1 Dec 2026' }
const activeKey = ref('welcome')
const active = computed(() => templates.value.find((t) => t.key === activeKey.value)!)
const placeholders = computed(() => [...new Set(`${active.value.subject} ${active.value.body}`.match(/\{\{\s*\w+\s*\}\}/g) ?? [])])
const fill = (s: string) => s.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => SAMPLE[k] ?? `{{${k}}}`)
const unknown = computed(() => placeholders.value.filter((p) => !(p.replace(/[{}\s]/g, '') in SAMPLE)))
const tag = (k: string) => `{{${k}}}`
function insert(p: string) {
  active.value.body += p
}
const tab = ref('edit')

/* Broadcast */
const audience = ref<(string | number)[]>(['customers'])
const bSubject = ref('')
const bBody = ref('')
async function broadcast() {
  const n = audience.value.length * 412
  if (await confirm({ title: `Send to about ${n} people?`, message: 'Broadcasts can’t be recalled once sent.', confirmLabel: 'Send broadcast' })) {
    log.value.unshift({ id: Date.now(), to: `${audience.value.join(', ')} (${n})`, subject: bSubject.value, status: 'Queued', at: 'just now' })
    bSubject.value = bBody.value = ''
    toast.success('Broadcast queued.')
  }
}

/* Log */
interface Sent { id: number; to: string; subject: string; status: 'Sent' | 'Queued' | 'Bounced'; at: string }
const log = ref<Sent[]>([
  { id: 1, to: 'ayu@example.com', subject: 'Receipt for INV-2041', status: 'Sent', at: '08:15' },
  { id: 2, to: 'budi@example.com', subject: 'Welcome to Nusa Admin, Budi!', status: 'Sent', at: '07:58' },
  { id: 3, to: 'old-address@example.net', subject: 'Your plan renews on 1 Dec 2026', status: 'Bounced', at: 'Yesterday' },
])
const logStatus = ref('all')
const logColumns: NuTableColumn<Sent>[] = [{ key: 'to', label: 'To' }, { key: 'subject', label: 'Subject' }, { key: 'status', label: 'Status' }, { key: 'at', label: 'When', align: 'right' }]
const logColor = { Sent: 'success', Queued: 'info', Bounced: 'danger' } as const
</script>

<template>
  <NuPageHeader title="Email" subtitle="Templates, broadcasts and delivery log." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Email' }]" />

  <div class="nu-stack">
    <div class="mail-tpl">
      <NuCard title="Templates" flush>
        <NuList>
          <NuListItem v-for="t in templates" :key="t.key" :icon="Mail" :title="t.name" :subtitle="t.key" clickable :active="t.key === activeKey" @click="activeKey = t.key" />
        </NuList>
      </NuCard>

      <NuCard :title="active.name">
        <template #tools><NuSegmented v-model="tab" size="sm" label="View" :options="[{ label: 'Edit', value: 'edit' }, { label: 'Preview', value: 'preview' }]" /></template>
        <div v-if="tab === 'edit'" class="nu-stack" style="--nu-gap: 10px">
          <NuInput v-model="active.subject" label="Subject" />
          <NuTextarea v-model="active.body" label="Body" :rows="9" />
          <div>
            <div class="nu-field__label" style="margin-bottom: 4px">Placeholders <span class="nu-text-muted" style="font-weight: 400">(click to insert)</span></div>
            <div class="nu-cluster" style="--nu-gap: 4px">
              <button v-for="k in Object.keys(SAMPLE)" :key="k" type="button" class="ph" @click="insert(tag(k))" v-text="tag(k)" />
            </div>
            <p v-if="unknown.length" class="nu-field__error" style="margin-top: 6px">Unknown: {{ unknown.join(', ') }}</p>
          </div>
        </div>
        <div v-else class="mail-preview">
          <div class="mail-preview__head"><span class="nu-text-muted">Subject:</span> <strong>{{ fill(active.subject) }}</strong></div>
          <div class="mail-preview__body">{{ fill(active.body) }}</div>
        </div>
        <template #footer>
          <div class="nu-between">
            <span class="nu-text-sm nu-text-muted">{{ placeholders.length }} placeholders · sample data in preview</span>
            <div class="nu-cluster">
              <NuButton size="sm" variant="ghost" color="secondary" @click="toast.info('Test email sent to ayu@example.com (demo).')">Send test</NuButton>
              <NuButton size="sm" @click="toast.success(`${active.name} saved.`)">Save</NuButton>
            </div>
          </div>
        </template>
      </NuCard>
    </div>

    <div class="nu-row">
      <div class="nu-col-lg-5">
        <NuCard title="Broadcast" subtitle="One-off email to a segment">
          <form class="nu-stack" style="--nu-gap: 10px" @submit.prevent="broadcast">
            <NuCombobox v-model="audience" multiple label="Audience" :options="[{ label: 'All customers', value: 'customers' }, { label: 'Trial users', value: 'trial' }, { label: 'Admins', value: 'admins' }]" />
            <NuInput v-model="bSubject" label="Subject" required />
            <NuTextarea v-model="bBody" label="Message" :rows="4" required />
            <div><NuButton type="submit" :icon="Send" :disabled="!audience.length || !bSubject.trim() || !bBody.trim()">Send broadcast</NuButton></div>
          </form>
        </NuCard>
      </div>
      <div class="nu-col-lg-7">
        <NuCard title="Delivery log" flush>
          <NuTable :columns="logColumns" :rows="log.filter((l) => logStatus === 'all' || l.status === logStatus)" row-key="id" :page-size="6">
            <template #toolbar><NuSegmented v-model="logStatus" size="sm" label="Status" :options="[{ label: 'All', value: 'all' }, { label: 'Sent', value: 'Sent' }, { label: 'Queued', value: 'Queued' }, { label: 'Bounced', value: 'Bounced' }]" /></template>
            <template #cell-status="{ row }"><NuBadge :color="logColor[(row as Sent).status]">{{ row.status }}</NuBadge></template>
          </NuTable>
        </NuCard>
      </div>
    </div>
  </div>
</template>

<style>
.mail-tpl { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 800px) { .mail-tpl { grid-template-columns: 1fr; } }
.ph { padding: 1px 6px; border: 1px dashed var(--nu-border); border-radius: 4px; background: var(--nu-surface-2); color: var(--nu-text); font-family: var(--nu-font-mono); font-size: 12px; cursor: pointer; }
.ph:hover { border-color: var(--nu-primary); color: var(--nu-primary); }
.mail-preview { border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); overflow: hidden; }
.mail-preview__head { padding: 8px 12px; border-bottom: 1px solid var(--nu-border); background: var(--nu-surface-2); }
.mail-preview__body { padding: 14px; white-space: pre-wrap; line-height: 1.6; }
</style>
