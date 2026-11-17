<script setup lang="ts">
import { ref } from 'vue'
import { ChartPie, CircleDollarSign, Eye, MessageSquare, ShoppingBag, Star, UserPlus, Users } from 'lucide-vue-next'
import {
  NuButton, NuCallout, NuCard, NuDirectChat, NuInfoBox, NuPageHeader, NuRibbon, NuSmallBox, NuStatCard, NuTodoList,
  NuUserCard, useToast, type NuChatMessage, type NuTodo,
} from 'nusa-admin'

const toast = useToast()
const refreshing = ref(false)
function refresh() {
  refreshing.value = true
  setTimeout(() => (refreshing.value = false), 900)
}

const todos = ref<NuTodo[]>([
  { id: 1, text: 'Design a nice theme', done: false, due: '2 mins', dueColor: 'danger' },
  { id: 2, text: 'Make the theme responsive', done: true, due: '4 hours', dueColor: 'info' },
  { id: 3, text: 'Let theme shine like a star', done: false, due: '1 day', dueColor: 'warning' },
  { id: 4, text: 'Check your messages and notifications', done: false, due: '3 days', dueColor: 'success' },
  { id: 5, text: 'Ship the release notes', done: false, due: '1 week', dueColor: 'primary' },
])
const chat = ref<NuChatMessage[]>([
  { from: 'Citra Dewi', text: 'Is this template really for free? That is unbelievable!', time: '23 Jan 2:00 pm' },
  { from: 'Ayu Lestari', text: 'You better believe it!', time: '23 Jan 2:05 pm', me: true },
  { from: 'Citra Dewi', text: 'Working with Nusa Admin on a great new app! Wanna join?', time: '23 Jan 5:37 pm' },
])
</script>

<template>
  <NuPageHeader title="Widgets" subtitle="Ready-made blocks for dashboards." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Widgets' }]" />

  <div class="nu-stack">
    <h2 class="section-title">Small boxes</h2>
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="New orders" value="150" :icon="ShoppingBag" color="info" to="/tables/data" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="Bounce rate" value="53%" :icon="ChartPie" color="success" to="/ui/charts" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="User registrations" value="44" :icon="UserPlus" color="warning" to="/users" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="Unique visitors" value="65" :icon="Eye" color="danger" to="/dashboard-2" /></div>
    </div>

    <h2 class="section-title">Info boxes &amp; stat cards</h2>
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Messages" value="1,410" :icon="MessageSquare" color="info" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Bookmarks" value="410" :icon="Star" color="success" :progress="70" description="70% increase in 30 days" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Sales" value="$24,310" :icon="CircleDollarSign" color="success" :delta="3.2" delta-label="vs last month" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Members" value="9,312" :icon="Users" variant="solid" /></div>
    </div>

    <h2 class="section-title">Cards</h2>
    <div class="nu-row">
      <div class="nu-col-md-6 nu-col-lg-3">
        <NuCard title="Outline card" accent="primary" collapsible removable>Colored top border. Collapse or remove it with the tools.</NuCard>
      </div>
      <div class="nu-col-md-6 nu-col-lg-3">
        <NuCard title="Solid header" accent="success" solid collapsible maximizable>The header is filled with the accent color. Try maximize.</NuCard>
      </div>
      <div class="nu-col-md-6 nu-col-lg-3">
        <NuCard title="Refreshable" accent="warning" solid refreshable :loading="refreshing" @refresh="refresh">
          Handle <code>@refresh</code> and toggle <code>loading</code> while data reloads.
        </NuCard>
      </div>
      <div class="nu-col-md-6 nu-col-lg-3">
        <NuCard title="With ribbon" accent="danger">
          <NuRibbon text="New" color="danger" />
          Ribbons sit in the corner of any card.
          <template #footer><NuButton size="sm" variant="soft" color="danger" @click="toast.info('Footer action')">Action</NuButton></template>
        </NuCard>
      </div>
    </div>

    <h2 class="section-title">User cards</h2>
    <div class="nu-row">
      <div class="nu-col-md-4">
        <NuUserCard name="Ayu Lestari" role="Product designer" color="info" :stats="[{ label: 'Sales', value: '3,200' }, { label: 'Followers', value: '13,000' }, { label: 'Products', value: 35 }]" />
      </div>
      <div class="nu-col-md-4">
        <NuUserCard name="Budi Santoso" role="Backend engineer" color="warning" align="left" :stats="[{ label: 'Projects', value: 31 }, { label: 'Tasks', value: 5 }, { label: 'Reviews', value: 12 }]" />
      </div>
      <div class="nu-col-md-4">
        <NuUserCard name="Citra Dewi" role="Customer success" color="success">
          <p class="nu-text-sm nu-text-muted" style="margin-bottom: 8px">Keeps 98% of accounts happy and renewing.</p>
          <NuButton size="sm" block variant="soft" color="success" to="/apps/chat">Send message</NuButton>
        </NuUserCard>
      </div>
    </div>

    <h2 class="section-title">To-do list &amp; direct chat</h2>
    <div class="nu-row">
      <div class="nu-col-lg-6">
        <NuCard title="To do list" flush>
          <template #tools><span class="nu-text-sm nu-text-muted">{{ todos.filter((t) => !t.done).length }} open</span></template>
          <NuTodoList v-model="todos" addable />
        </NuCard>
      </div>
      <div class="nu-col-lg-6">
        <NuCard title="Direct chat" accent="primary" flush collapsible removable>
          <NuDirectChat :messages="chat" height="260px" @send="(text) => chat.push({ from: 'Ayu Lestari', text, me: true, time: 'now' })" />
        </NuCard>
      </div>
    </div>

    <h2 class="section-title">Callouts</h2>
    <div class="nu-row">
      <div class="nu-col-md-6"><NuCallout color="danger" title="I am a danger callout!">There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul.</NuCallout></div>
      <div class="nu-col-md-6"><NuCallout color="info" title="I am an info callout!">Follow the steps to continue to payment.</NuCallout></div>
    </div>
  </div>
</template>

