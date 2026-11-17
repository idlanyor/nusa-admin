<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import {
  NuButton, NuCalendar, NuCard, NuEmpty, NuInput, NuModal, NuPageHeader, NuSelect, NuTimeline, useToast,
  type NuCalendarEvent, type NuColor,
} from 'nusa-admin'

const toast = useToast()
const iso = (offset: number) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const events = ref<NuCalendarEvent[]>([
  { date: iso(0), title: 'Sprint planning', color: 'primary' },
  { date: iso(0), title: 'Design review', color: 'info' },
  { date: iso(1), title: 'Customer call', color: 'success' },
  { date: iso(3), title: 'Release v0.2', color: 'warning' },
  { date: iso(5), title: 'Invoice run', color: 'secondary' },
  { date: iso(-2), title: 'Server maintenance', color: 'danger' },
  { date: iso(8), title: 'Team offsite', color: 'success' },
])
const selected = ref(iso(0))
const modal = ref(false)
const draft = reactive<{ title: string; date: string; color: NuColor }>({ title: '', date: iso(0), color: 'primary' })

const dayEvents = computed(() => events.value.filter((e) => e.date === selected.value))
const selectedLabel = computed(() =>
  new Date(`${selected.value}T00:00:00`).toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' }),
)

function openNew() {
  draft.title = ''
  draft.date = selected.value
  modal.value = true
}
function save() {
  if (!draft.title.trim()) return
  events.value.push({ ...draft, title: draft.title.trim() })
  selected.value = draft.date
  modal.value = false
  toast.success('Event added.')
}
</script>

<template>
  <NuPageHeader title="Calendar" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Calendar' }]">
    <NuButton :icon="Plus" @click="openNew">New event</NuButton>
  </NuPageHeader>

  <div class="nu-row">
    <div class="nu-col-lg-9">
      <NuCard flush>
        <NuCalendar v-model="selected" :events="events" @event-click="toast.info(`${$event.title} · ${$event.date}`)" />
      </NuCard>
    </div>
    <div class="nu-col-lg-3">
      <NuCard :title="selectedLabel" :flush="!dayEvents.length">
        <NuTimeline v-if="dayEvents.length" :items="dayEvents.map((e) => ({ title: e.title, color: e.color }))" />
        <NuEmpty v-else title="Nothing scheduled" description="Pick another day or add an event.">
          <NuButton size="sm" variant="soft" @click="openNew">Add event</NuButton>
        </NuEmpty>
      </NuCard>
    </div>
  </div>

  <NuModal v-model="modal" title="New event" size="sm">
    <form id="event-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="save">
      <NuInput v-model="draft.title" label="Title" required />
      <NuInput v-model="draft.date" label="Date" type="date" required />
      <NuSelect
        v-model="draft.color"
        label="Color"
        :options="['primary', 'success', 'warning', 'danger', 'info', 'secondary'].map((c) => ({ label: c, value: c }))"
      />
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="event-form">Add</NuButton>
    </template>
  </NuModal>
</template>
