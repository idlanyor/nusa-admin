<script setup lang="ts">
import { computed, ref } from 'vue'
import { Archive, FileText, Inbox, Pencil, Reply, Send, Star, Trash2 } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuCheckbox, NuEmpty, NuInput, NuList, NuListItem, NuModal, NuPageHeader,
  NuTextarea, useToast,
} from 'nusa-admin'

interface Mail {
  id: number
  folder: 'inbox' | 'sent' | 'drafts' | 'trash'
  from: string
  subject: string
  preview: string
  time: string
  unread: boolean
  starred: boolean
  label?: 'Work' | 'Billing' | 'Personal'
}

const toast = useToast()
const mails = ref<Mail[]>([
  { id: 1, folder: 'inbox', from: 'Budi Santoso', subject: 'Q4 roadmap draft', preview: 'I put together the first pass of the roadmap. Could you take a look before Thursday and leave comments on the open questions?', time: '09:42', unread: true, starred: true, label: 'Work' },
  { id: 2, folder: 'inbox', from: 'Billing', subject: 'Invoice INV-2041 is paid', preview: 'Thanks — we received your payment of $237.00 for the Team plan. A receipt is attached for your records.', time: '08:15', unread: true, starred: false, label: 'Billing' },
  { id: 3, folder: 'inbox', from: 'Citra Dewi', subject: 'Customer feedback summary', preview: 'Here are the top five themes from last month\'s support tickets, with a few quotes for each.', time: 'Yesterday', unread: false, starred: false, label: 'Work' },
  { id: 4, folder: 'inbox', from: 'Dimas Pratama', subject: 'Lunch on Friday?', preview: 'The new place near the office finally opened. Want to try it on Friday around noon?', time: 'Yesterday', unread: false, starred: false, label: 'Personal' },
  { id: 5, folder: 'inbox', from: 'Eka Putri', subject: 'Design tokens review', preview: 'I tightened the radius and spacing scale as discussed. The table and card padding now follow the same steps.', time: 'Mon', unread: false, starred: true, label: 'Work' },
  { id: 6, folder: 'sent', from: 'Me', subject: 'Re: Q4 roadmap draft', preview: 'Looks good overall. I left comments on the two open questions.', time: 'Mon', unread: false, starred: false },
  { id: 7, folder: 'drafts', from: 'Me', subject: 'Offsite agenda', preview: 'Draft agenda for the team offsite…', time: 'Sun', unread: false, starred: false },
])

const folders = [
  { key: 'inbox', label: 'Inbox', icon: Inbox },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'drafts', label: 'Drafts', icon: FileText },
  { key: 'trash', label: 'Trash', icon: Trash2 },
] as const
const labelColor = { Work: 'primary', Billing: 'success', Personal: 'warning' } as const

const folder = ref<Mail['folder']>('inbox')
const query = ref('')
const openId = ref<number | null>(1)
const checked = ref<number[]>([])
const compose = ref(false)

const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  return mails.value.filter((m) => m.folder === folder.value && (!q || `${m.from} ${m.subject} ${m.preview}`.toLowerCase().includes(q)))
})
const current = computed(() => mails.value.find((m) => m.id === openId.value && m.folder === folder.value) ?? null)
const count = (key: Mail['folder']) => mails.value.filter((m) => m.folder === key && (key !== 'inbox' || m.unread)).length

function open(m: Mail) {
  openId.value = m.id
  m.unread = false
}
function toggle(id: number, on: boolean) {
  checked.value = on ? [...checked.value, id] : checked.value.filter((x) => x !== id)
}
function trash(ids: number[]) {
  for (const m of mails.value) if (ids.includes(m.id)) m.folder = 'trash'
  checked.value = []
  toast.info(`${ids.length} conversation${ids.length > 1 ? 's' : ''} moved to trash.`)
}
function send() {
  compose.value = false
  toast.success('Message sent.')
}
</script>

<template>
  <NuPageHeader title="Mailbox" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Mailbox' }]">
    <NuButton :icon="Pencil" @click="compose = true">Compose</NuButton>
  </NuPageHeader>

  <div class="mailbox">
    <NuCard flush class="mailbox__folders">
      <NuList>
        <NuListItem v-for="f in folders" :key="f.key" :icon="f.icon" :title="f.label" clickable :active="folder === f.key" @click="folder = f.key; checked = []">
          <template v-if="count(f.key)" #end><NuBadge :color="f.key === 'inbox' ? 'primary' : 'secondary'">{{ count(f.key) }}</NuBadge></template>
        </NuListItem>
      </NuList>
    </NuCard>

    <NuCard flush class="mailbox__list">
      <div class="mailbox__toolbar">
        <NuInput v-model="query" size="sm" type="search" placeholder="Search mail" aria-label="Search mail" style="flex: 1" />
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Archive" square aria-label="Archive selected" :disabled="!checked.length" @click="checked = []" />
        <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square aria-label="Delete selected" :disabled="!checked.length" @click="trash(checked)" />
      </div>
      <ul class="mailbox__items">
        <li v-for="m in list" :key="m.id" :class="{ 'is-unread': m.unread, 'is-open': m.id === openId }">
          <NuCheckbox :model-value="checked.includes(m.id)" :aria-label="`Select ${m.subject}`" @update:model-value="toggle(m.id, $event)" />
          <button class="mailbox__star" type="button" :class="{ 'is-on': m.starred }" :aria-label="m.starred ? 'Unstar' : 'Star'" :aria-pressed="m.starred" @click="m.starred = !m.starred"><Star /></button>
          <button class="mailbox__row" type="button" @click="open(m)">
            <span class="mailbox__from">{{ m.from }}</span>
            <span class="mailbox__time">{{ m.time }}</span>
            <span class="mailbox__subject">{{ m.subject }}</span>
            <span class="mailbox__preview">{{ m.preview }}</span>
          </button>
        </li>
      </ul>
      <NuEmpty v-if="!list.length" title="No messages" description="Nothing in this folder matches." />
    </NuCard>

    <NuCard flush class="mailbox__reader">
      <template v-if="current">
        <header class="mailbox__reader-head">
          <div class="nu-grow">
            <h2>{{ current.subject }}</h2>
            <div class="nu-cluster" style="margin-top: 6px">
              <NuAvatar :name="current.from" :size="28" />
              <span class="nu-fw-600">{{ current.from }}</span>
              <span class="nu-text-sm nu-text-muted">{{ current.time }}</span>
              <NuBadge v-if="current.label" :color="labelColor[current.label]">{{ current.label }}</NuBadge>
            </div>
          </div>
          <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square aria-label="Delete" @click="trash([current.id])" />
        </header>
        <div class="mailbox__body">
          <p>Hi Ayu,</p>
          <p>{{ current.preview }}</p>
          <p>Thanks,<br />{{ current.from }}</p>
        </div>
        <footer class="mailbox__reader-foot">
          <NuButton size="sm" :icon="Reply" @click="compose = true">Reply</NuButton>
        </footer>
      </template>
      <NuEmpty v-else title="Select a message" description="Choose a conversation from the list to read it." />
    </NuCard>
  </div>

  <NuModal v-model="compose" title="New message">
    <form id="compose-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="send">
      <NuInput label="To" type="email" placeholder="name@example.com" required />
      <NuInput label="Subject" required />
      <NuTextarea label="Message" :rows="6" />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Discard</NuButton>
      <NuButton type="submit" form="compose-form" :icon="Send">Send</NuButton>
    </template>
  </NuModal>
</template>

<style>
.mailbox { display: grid; grid-template-columns: 190px minmax(280px, 380px) minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 1100px) { .mailbox { grid-template-columns: 190px minmax(0, 1fr); } .mailbox__reader { grid-column: 1 / -1; } }
@media (max-width: 700px) { .mailbox { grid-template-columns: 1fr; } }
.mailbox__toolbar { display: flex; align-items: center; gap: 4px; padding: 8px; border-bottom: 1px solid var(--nu-border); }
.mailbox__items { margin: 0; padding: 0; list-style: none; }
.mailbox__items li { display: flex; align-items: flex-start; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--nu-border); }
.mailbox__items li:last-child { border-bottom: 0; }
.mailbox__items li.is-open { background: color-mix(in srgb, var(--nu-primary) 7%, transparent); }
.mailbox__items .nu-check { margin-top: 1px; }
.mailbox__star { display: grid; padding: 1px; border: 0; background: transparent; color: color-mix(in srgb, var(--nu-text) 30%, transparent); cursor: pointer; }
.mailbox__star svg { width: 16px; height: 16px; }
.mailbox__star.is-on { color: #e8a200; }
.mailbox__star.is-on svg { fill: currentColor; }
.mailbox__row {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--nu-text);
  text-align: left;
  cursor: pointer;
}
.mailbox__from, .mailbox__subject, .mailbox__preview { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mailbox__time { font-size: 12px; color: var(--nu-text-muted); }
.mailbox__subject, .mailbox__preview { grid-column: 1 / -1; font-size: 13px; }
.mailbox__preview { color: var(--nu-text-muted); }
.mailbox__items li.is-unread :is(.mailbox__from, .mailbox__subject) { font-weight: 700; }
.mailbox__reader-head { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--nu-border); }
.mailbox__reader-head h2 { font-size: 16px; }
.mailbox__body { display: grid; gap: 10px; padding: 14px; max-width: 68ch; }
.mailbox__reader-foot { padding: 10px 14px; border-top: 1px solid var(--nu-border); }
</style>
