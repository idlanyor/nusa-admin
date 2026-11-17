<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { NuAvatar, NuBadge, NuButton, NuCard, NuInput, NuPageHeader } from 'nusa-admin'

interface Message {
  me: boolean
  text: string
  time: string
}
interface Contact {
  name: string
  status: 'online' | 'away' | 'busy' | 'offline'
  unread: number
  messages: Message[]
}

const contacts = ref<Contact[]>([
  {
    name: 'Budi Santoso',
    status: 'online',
    unread: 2,
    messages: [
      { me: false, text: 'Morning! Did you see the roadmap draft?', time: '09:40' },
      { me: true, text: 'Yes, reading it now. The Q4 scope looks realistic.', time: '09:42' },
      { me: false, text: 'Great. Anything you would cut?', time: '09:43' },
      { me: false, text: 'I am unsure about the mobile app item.', time: '09:43' },
    ],
  },
  { name: 'Citra Dewi', status: 'away', unread: 0, messages: [{ me: false, text: 'Feedback summary is in your inbox.', time: 'Yesterday' }] },
  { name: 'Dimas Pratama', status: 'busy', unread: 0, messages: [{ me: true, text: 'Friday lunch works for me.', time: 'Yesterday' }] },
  { name: 'Eka Putri', status: 'offline', unread: 0, messages: [{ me: false, text: 'Tokens are updated.', time: 'Mon' }] },
])
const active = ref(0)
const draft = ref('')
const scroller = ref<HTMLElement | null>(null)
const contact = computed(() => contacts.value[active.value]!)

function select(i: number) {
  active.value = i
  contacts.value[i]!.unread = 0
}
async function send() {
  const text = draft.value.trim()
  if (!text) return
  contact.value.messages.push({ me: true, text, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) })
  draft.value = ''
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight })
}
</script>

<template>
  <NuPageHeader title="Chat" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Chat' }]" />

  <div class="chat">
    <NuCard title="Conversations" flush>
      <ul class="chat__contacts">
        <li v-for="(c, i) in contacts" :key="c.name">
          <button type="button" :class="{ 'is-active': i === active }" @click="select(i)">
            <NuAvatar :name="c.name" :status="c.status" :size="34" />
            <span class="nu-grow">
              <span class="chat__name">{{ c.name }}</span>
              <span class="chat__last">{{ c.messages[c.messages.length - 1]?.text }}</span>
            </span>
            <NuBadge v-if="c.unread" variant="solid" pill>{{ c.unread }}</NuBadge>
          </button>
        </li>
      </ul>
    </NuCard>

    <NuCard flush>
      <template #header>
        <div class="nu-cluster">
          <NuAvatar :name="contact.name" :status="contact.status" :size="32" />
          <div>
            <div class="nu-fw-600">{{ contact.name }}</div>
            <div class="nu-text-sm nu-text-muted">{{ contact.status }}</div>
          </div>
        </div>
      </template>
      <div ref="scroller" class="chat__messages">
        <div v-for="(m, i) in contact.messages" :key="i" class="chat__msg" :class="{ 'is-me': m.me }">
          <p>{{ m.text }}</p>
          <time>{{ m.time }}</time>
        </div>
      </div>
      <template #footer>
        <form class="chat__form" @submit.prevent="send">
          <NuInput v-model="draft" placeholder="Type a message" aria-label="Message" style="flex: 1" />
          <NuButton type="submit" :icon="Send" :disabled="!draft.trim()">Send</NuButton>
        </form>
      </template>
    </NuCard>
  </div>
</template>

<style>
.chat { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 800px) { .chat { grid-template-columns: 1fr; } }
.chat__contacts { margin: 0; padding: 0; list-style: none; }
.chat__contacts li + li { border-top: 1px solid var(--nu-border); }
.chat__contacts button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 14px; border: 0; background: transparent; color: var(--nu-text); text-align: left; cursor: pointer; }
.chat__contacts button:hover { background: color-mix(in srgb, var(--nu-text) 4%, transparent); }
.chat__contacts button.is-active { background: color-mix(in srgb, var(--nu-primary) 9%, transparent); }
.chat__name, .chat__last { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chat__name { font-weight: 600; }
.chat__last { font-size: 12.5px; color: var(--nu-text-muted); }
.chat__messages { display: flex; flex-direction: column; gap: 8px; height: 420px; padding: 14px; overflow-y: auto; }
.chat__msg { align-self: flex-start; max-width: min(70%, 520px); }
.chat__msg p { padding: 7px 10px; border-radius: var(--nu-radius); background: color-mix(in srgb, var(--nu-text) 7%, transparent); }
.chat__msg time { display: block; margin-top: 2px; font-size: 11px; color: var(--nu-text-muted); }
.chat__msg.is-me { align-self: flex-end; text-align: right; }
.chat__msg.is-me p { background: var(--nu-primary); color: var(--nu-on-color); text-align: left; }
.chat__form { display: flex; gap: 8px; }
</style>
