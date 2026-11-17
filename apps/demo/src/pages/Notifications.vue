<script setup lang="ts">
import { computed, ref } from 'vue'
import { AtSign, Check, CircleDollarSign, MessageSquare, Server, Settings2, UserPlus } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuEmpty, NuPageHeader, NuSegmented, NuSwitch } from 'nusa-admin'

interface Note { id: number; kind: 'mention' | 'billing' | 'system' | 'team' | 'comment'; title: string; text: string; time: string; day: 'Today' | 'Yesterday' | 'Earlier'; read: boolean }
const notes = ref<Note[]>([
  { id: 1, kind: 'mention', title: 'Budi mentioned you', text: '“@Ayu can you check the roadmap draft before Thursday?”', time: '09:42', day: 'Today', read: false },
  { id: 2, kind: 'billing', title: 'Invoice INV-2041 paid', text: '$237.00 received via Mastercard •••• 7852.', time: '08:15', day: 'Today', read: false },
  { id: 3, kind: 'system', title: 'CPU usage above 80%', text: 'api-2 has been above 80% for 10 minutes.', time: '07:58', day: 'Today', read: false },
  { id: 4, kind: 'team', title: 'Dimas joined the Design team', text: 'Invited by Ayu Lestari.', time: '16:20', day: 'Yesterday', read: true },
  { id: 5, kind: 'comment', title: 'New comment on “Role-based menu”', text: 'Eka: Looks good, merging after QA.', time: '11:03', day: 'Yesterday', read: true },
  { id: 6, kind: 'billing', title: 'Card expires soon', text: 'Visa •••• 5248 expires in April.', time: '12 Nov', day: 'Earlier', read: true },
  { id: 7, kind: 'system', title: 'Backup completed', text: 'Nightly backup finished in 4 min 12 s.', time: '11 Nov', day: 'Earlier', read: true },
])
const icons = { mention: AtSign, billing: CircleDollarSign, system: Server, team: UserPlus, comment: MessageSquare }
const colors = { mention: 'primary', billing: 'success', system: 'danger', team: 'info', comment: 'warning' } as const

const filter = ref('all')
const shown = computed(() => notes.value.filter((n) => filter.value === 'all' || (filter.value === 'unread' ? !n.read : n.kind === filter.value)))
const unread = computed(() => notes.value.filter((n) => !n.read).length)
const days = computed(() => (['Today', 'Yesterday', 'Earlier'] as const).map((d) => ({ day: d, items: shown.value.filter((n) => n.day === d) })).filter((g) => g.items.length))
const markAll = () => notes.value.forEach((n) => (n.read = true))

const prefs = ref({ mentions: true, billing: true, system: true, team: false, digest: true })
</script>

<template>
  <NuPageHeader title="Notifications" :subtitle="unread ? `${unread} unread` : 'All caught up'" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Notifications' }]">
    <NuButton variant="outline" color="secondary" :icon="Check" :disabled="!unread" @click="markAll">Mark all as read</NuButton>
  </NuPageHeader>

  <div class="nu-row">
    <div class="nu-col-lg-8">
      <NuCard flush>
        <template #header>
          <NuSegmented
            v-model="filter"
            size="sm"
            label="Filter"
            :options="[{ label: 'All', value: 'all' }, { label: `Unread (${unread})`, value: 'unread' }, { label: 'Mentions', value: 'mention' }, { label: 'Billing', value: 'billing' }, { label: 'System', value: 'system' }]"
          />
        </template>
        <template v-for="g in days" :key="g.day">
          <div class="notes__day">{{ g.day }}</div>
          <ul class="notes">
            <li v-for="n in g.items" :key="n.id" :class="{ 'is-unread': !n.read }" @click="n.read = true">
              <span class="notes__icon" :class="`nu-c-${colors[n.kind]}`"><component :is="icons[n.kind]" /></span>
              <div class="nu-grow">
                <div class="nu-between"><strong>{{ n.title }}</strong><small>{{ n.time }}</small></div>
                <p>{{ n.text }}</p>
              </div>
              <NuBadge v-if="!n.read" dot color="primary"><span class="nu-sr-only">Unread</span></NuBadge>
            </li>
          </ul>
        </template>
        <NuEmpty v-if="!shown.length" title="Nothing here" description="No notifications match this filter." />
      </NuCard>
    </div>
    <div class="nu-col-lg-4">
      <NuCard title="Preferences">
        <template #tools><Settings2 style="width: 16px; height: 16px; color: var(--nu-text-muted)" /></template>
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuSwitch v-model="prefs.mentions" label="Mentions and replies" />
          <NuSwitch v-model="prefs.billing" label="Billing and payments" />
          <NuSwitch v-model="prefs.system" label="System alerts" />
          <NuSwitch v-model="prefs.team" label="Team changes" />
          <NuSwitch v-model="prefs.digest" label="Weekly email digest" />
        </div>
      </NuCard>
    </div>
  </div>
</template>

<style>
.notes__day { padding: 8px 14px 4px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--nu-text-muted); border-top: 1px solid var(--nu-border); }
.notes__day:first-of-type { border-top: 0; }
.notes { margin: 0; padding: 0; list-style: none; }
.notes li { display: flex; align-items: flex-start; gap: 10px; padding: 9px 14px; cursor: pointer; }
.notes li:hover { background: color-mix(in srgb, var(--nu-text) 4%, transparent); }
.notes li.is-unread { background: color-mix(in srgb, var(--nu-primary) 5%, transparent); }
.notes p { font-size: 13px; color: var(--nu-text-muted); }
.notes small { font-size: 12px; color: var(--nu-text-muted); white-space: nowrap; }
.notes__icon { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: color-mix(in srgb, var(--nu-c) 14%, transparent); color: var(--nu-c); }
.notes__icon svg { width: 15px; height: 15px; }
</style>
