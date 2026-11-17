<script setup lang="ts">
import { ref } from 'vue'
import { Bell, CreditCard, Inbox, Send, Star, Trash2, User } from 'lucide-vue-next'
import {
  NuAccordion, NuBadge, NuBreadcrumb, NuButton, NuCard, NuDropdown, NuDropdownItem, NuList, NuListItem, NuPageHeader,
  NuPagination, NuSegmented, NuSteps, NuTabs,
} from 'nusa-admin'

const tab = ref('profile')
const pill = ref('week')
const page = ref(4)
const step = ref(1)
const range = ref('month')
const folder = ref('inbox')

const tabs = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'billing', label: 'Billing', icon: CreditCard },
  { key: 'notifications', label: 'Notifications', icon: Bell },
]
const steps = [{ title: 'Account' }, { title: 'Profile' }, { title: 'Billing' }, { title: 'Done' }]
</script>

<template>
  <NuPageHeader
    title="Navigation"
    subtitle="Tabs, steps, breadcrumbs, pagination, lists and menus."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Navigation' }]"
  />

  <div class="nu-row">
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Tabs">
        <NuTabs v-model="tab" :tabs="tabs">
          <template #profile>Profile settings. Each tab is a named slot matching its <code>key</code>.</template>
          <template #billing>Billing details and invoices.</template>
          <template #notifications>Choose what you want to be notified about.</template>
        </NuTabs>
      </NuCard>

      <NuCard title="Pills &amp; segmented">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuTabs
            v-model="pill"
            variant="pills"
            :tabs="[{ key: 'day', label: 'Day' }, { key: 'week', label: 'Week' }, { key: 'month', label: 'Month' }]"
          >
            <template #day>Today's numbers.</template>
            <template #week>This week's numbers.</template>
            <template #month>This month's numbers.</template>
          </NuTabs>
          <div class="nu-cluster">
            <NuSegmented v-model="range" :options="[{ label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }, { label: 'Year', value: 'year' }]" label="Range" />
            <NuSegmented v-model="range" size="sm" :options="[{ label: 'W', value: 'week' }, { label: 'M', value: 'month' }, { label: 'Y', value: 'year' }]" label="Range, small" />
          </div>
        </div>
      </NuCard>

      <NuCard title="Steps">
        <div class="nu-stack" style="--nu-gap: 12px">
          <NuSteps v-model="step" :steps="steps" clickable />
          <div class="nu-cluster">
            <NuButton size="sm" variant="outline" color="secondary" :disabled="step === 0" @click="step--">Back</NuButton>
            <NuButton size="sm" :disabled="step === steps.length - 1" @click="step++">Next</NuButton>
          </div>
        </div>
      </NuCard>

      <NuCard title="Breadcrumb &amp; pagination">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Library', to: '/' }, { label: 'Data' }]" />
          <div class="nu-cluster">
            <NuPagination v-model="page" :total="200" />
            <span class="nu-text-muted">Page {{ page }} of 20</span>
          </div>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Accordion" flush>
        <NuAccordion
          style="border: 0"
          :default-open="['a']"
          :items="[
            { key: 'a', title: 'Is the kit tied to a CSS framework?', content: 'No. Styles are plain CSS driven by custom properties.' },
            { key: 'b', title: 'Can several panels be open at once?', content: 'Yes — pass the multiple prop.' },
            { key: 'c', title: 'Can I put rich content inside?', content: 'Use a slot named after the item key.' },
          ]"
        />
      </NuCard>

      <NuCard title="List" flush>
        <NuList>
          <NuListItem :icon="Inbox" title="Inbox" clickable :active="folder === 'inbox'" @click="folder = 'inbox'">
            <template #end><NuBadge>12</NuBadge></template>
          </NuListItem>
          <NuListItem :icon="Star" title="Starred" clickable :active="folder === 'starred'" @click="folder = 'starred'" />
          <NuListItem :icon="Send" title="Sent" subtitle="Last sent 2 hours ago" clickable :active="folder === 'sent'" @click="folder = 'sent'" />
          <NuListItem :icon="Trash2" title="Trash" clickable :active="folder === 'trash'" @click="folder = 'trash'" />
        </NuList>
      </NuCard>

      <NuCard title="Dropdowns">
        <div class="nu-cluster">
          <NuDropdown align="left">
            <template #trigger><NuButton variant="outline" color="secondary">Actions</NuButton></template>
            <NuDropdownItem :icon="User">Profile</NuDropdownItem>
            <NuDropdownItem :icon="CreditCard">Billing</NuDropdownItem>
            <div class="nu-dropdown__divider" />
            <NuDropdownItem :icon="Trash2" danger>Delete</NuDropdownItem>
          </NuDropdown>
          <NuDropdown align="left" width="180px">
            <template #trigger><NuButton>With header</NuButton></template>
            <div class="nu-dropdown__header">Export as</div>
            <NuDropdownItem>CSV</NuDropdownItem>
            <NuDropdownItem>Excel</NuDropdownItem>
            <NuDropdownItem disabled>PDF (soon)</NuDropdownItem>
          </NuDropdown>
        </div>
      </NuCard>
    </div>
  </div>
</template>
