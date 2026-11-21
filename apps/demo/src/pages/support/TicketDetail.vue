<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle2, Paperclip, RotateCcw, Send } from 'lucide-vue-next'
import { NuAvatar, NuBadge, NuButton, NuCard, NuDescriptions, NuEmpty, NuPageHeader, NuSelect, NuTextarea, useConfirm, useToast } from 'nusa-admin'
import { priorityColor, statusColor, tickets, type Ticket } from '../../tickets'

const route = useRoute()
const toast = useToast()
const { confirm } = useConfirm()
const ticket = computed(() => tickets.find((t) => String(t.id) === route.params.id))
const reply = ref('')
const asStaff = ref(true)
const thread = ref<HTMLElement | null>(null)
const now = () => new Date().toISOString().slice(0, 16).replace('T', ' ')
const canned = [
  { label: 'Insert a canned reply…', value: '' },
  { label: 'Ask for screenshot', value: 'Could you send a screenshot of what you see? It helps us reproduce the issue quickly.' },
  { label: 'Investigating', value: 'Thanks for the report — we are looking into it and will update you within a few hours.' },
  { label: 'Resolved', value: 'This should now be fixed. Please let us know if you still see the problem.' },
]
const pick = ref('')

async function send() {
  const t = ticket.value
  if (!t || !reply.value.trim()) return
  t.messages.push({ from: asStaff.value ? 'Ayu Lestari (Support)' : t.customer, staff: asStaff.value, at: now(), body: reply.value.trim() })
  t.status = asStaff.value ? 'Answered' : 'Open'
  t.updated = now()
  reply.value = ''
  pick.value = ''
  await nextTick()
  thread.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
async function close() {
  if (!ticket.value) return
  if (await confirm({ title: `Close ticket #${ticket.value.id}?`, message: 'The customer can still reopen it by replying.', confirmLabel: 'Close ticket' })) {
    ticket.value.status = 'Closed'
    toast.success('Ticket closed.')
  }
}
function reopen() {
  if (ticket.value) ticket.value.status = 'Open'
}
function setPriority(p: string | number | undefined) {
  if (ticket.value && p) ticket.value.priority = p as Ticket['priority']
}
</script>

<template>
  <template v-if="ticket">
    <NuPageHeader :title="ticket.subject" :subtitle="`#${ticket.id} · ${ticket.category}`" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Support', to: '/support/tickets' }, { label: `#${ticket.id}` }]">
      <NuBadge :color="statusColor[ticket.status]" dot>{{ ticket.status }}</NuBadge>
      <NuButton v-if="ticket.status !== 'Closed'" variant="outline" color="secondary" :icon="CheckCircle2" @click="close">Close ticket</NuButton>
      <NuButton v-else variant="outline" color="secondary" :icon="RotateCcw" @click="reopen">Reopen</NuButton>
    </NuPageHeader>

    <div class="ticket">
      <NuCard title="Conversation" flush>
        <ol ref="thread" class="thread">
          <li v-for="(m, i) in ticket.messages" :key="i" :class="{ 'is-staff': m.staff }">
            <NuAvatar :name="m.from" :size="32" :color="m.staff ? 'primary' : 'secondary'" />
            <div class="thread__msg">
              <div class="thread__meta"><strong>{{ m.from }}</strong><NuBadge v-if="m.staff" color="primary">Staff</NuBadge><time>{{ m.at }}</time></div>
              <p>{{ m.body }}</p>
              <div v-if="m.attachments?.length" class="nu-cluster" style="--nu-gap: 6px; margin-top: 6px">
                <span v-for="a in m.attachments" :key="a" class="thread__file"><Paperclip />{{ a }}</span>
              </div>
            </div>
          </li>
        </ol>
        <template #footer>
          <form v-if="ticket.status !== 'Closed'" class="nu-stack" style="--nu-gap: 8px" @submit.prevent="send">
            <NuSelect v-model="pick" size="sm" aria-label="Canned reply" :options="canned" @update:model-value="reply = String($event || reply)" />
            <NuTextarea v-model="reply" :rows="4" placeholder="Write a reply…" aria-label="Reply" @keydown.ctrl.enter="send" @keydown.meta.enter="send" />
            <div class="nu-between">
              <label class="nu-text-sm nu-cluster" style="--nu-gap: 6px"><input v-model="asStaff" type="checkbox" /> Reply as staff</label>
              <NuButton type="submit" :icon="Send" :disabled="!reply.trim()">Send <kbd class="ticket__kbd">Ctrl ↵</kbd></NuButton>
            </div>
          </form>
          <NuEmpty v-else title="This ticket is closed" description="Reopen it to reply." />
        </template>
      </NuCard>

      <div class="nu-stack" style="--nu-gap: 12px">
        <NuCard title="Details">
          <NuDescriptions
            :items="[
              { label: 'Customer', value: ticket.customer },
              { label: 'Assignee', value: ticket.assignee ?? 'Unassigned' },
              { label: 'Category', value: ticket.category },
              { label: 'Last update', value: ticket.updated },
            ]"
          />
        </NuCard>
        <NuCard title="Priority">
          <NuSelect :model-value="ticket.priority" aria-label="Priority" :options="['Low', 'Normal', 'High', 'Urgent'].map((c) => ({ label: c, value: c }))" @update:model-value="setPriority" />
          <NuBadge :color="priorityColor[ticket.priority]" style="margin-top: 8px">{{ ticket.priority }}</NuBadge>
        </NuCard>
      </div>
    </div>
  </template>
  <NuCard v-else flush>
    <NuEmpty title="Ticket not found"><NuButton size="sm" to="/support/tickets">All tickets</NuButton></NuEmpty>
  </NuCard>
</template>

<style>
.ticket { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 12px; align-items: start; }
@media (max-width: 900px) { .ticket { grid-template-columns: 1fr; } }
.thread { margin: 0; padding: 8px 14px; list-style: none; display: flex; flex-direction: column; gap: 14px; }
.thread li { display: flex; gap: 10px; }
.thread__msg { flex: 1; min-width: 0; padding: 8px 12px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); }
.thread li.is-staff .thread__msg { background: color-mix(in srgb, var(--nu-primary) 5%, var(--nu-surface)); border-color: color-mix(in srgb, var(--nu-primary) 25%, var(--nu-border)); }
.thread__meta { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; font-size: 13px; }
.thread__meta time { margin-inline-start: auto; color: var(--nu-text-muted); font-size: 12px; }
.thread p { white-space: pre-wrap; overflow-wrap: anywhere; }
.thread__file { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); font-size: 12px; }
.thread__file svg { width: 12px; height: 12px; }
.ticket__kbd { margin-inline-start: 4px; padding: 0 4px; border-radius: 3px; background: color-mix(in srgb, var(--nu-on-color) 20%, transparent); font-size: 10.5px; }
</style>
