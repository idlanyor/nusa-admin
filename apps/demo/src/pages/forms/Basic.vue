<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AtSign, Search } from 'lucide-vue-next'
import {
  NuButton, NuCard, NuCheckbox, NuInput, NuPageHeader, NuSelect, NuSwitch, NuTextarea, useToast,
} from 'nusa-admin'

const toast = useToast()
const form = reactive({ name: '', email: '', role: '', bio: '', newsletter: true, terms: false })
const errors = reactive<{ name?: string; email?: string; role?: string }>({})
const saving = ref(false)

const roles = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
]

function submit() {
  errors.name = form.name.trim() ? undefined : 'Enter a name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.'
  errors.role = form.role ? undefined : 'Choose a role.'
  if (errors.name || errors.email || errors.role) return
  saving.value = true
  setTimeout(() => {
    saving.value = false
    toast.success({ title: 'User created', message: `${form.name} was added as ${form.role}.` })
  }, 700)
}
</script>

<template>
  <NuPageHeader title="Basic forms" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Forms' }, { label: 'Basic' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-7">
      <NuCard title="Create user" subtitle="A validated form built from the kit's inputs">
        <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="submit">
          <div class="nu-row" style="--nu-gap: 12px">
            <div class="nu-col-md-6">
              <NuInput v-model="form.name" label="Full name" placeholder="Ayu Lestari" required :error="errors.name" autocomplete="name" />
            </div>
            <div class="nu-col-md-6">
              <NuInput v-model="form.email" label="Email" type="email" placeholder="ayu@example.com" required :error="errors.email" autocomplete="email">
                <template #prefix><AtSign /></template>
              </NuInput>
            </div>
          </div>
          <NuSelect v-model="form.role" label="Role" :options="roles" placeholder="Choose a role" required :error="errors.role" />
          <NuTextarea v-model="form.bio" label="Bio" placeholder="A short introduction" hint="Shown on the public profile." />
          <NuSwitch v-model="form.newsletter" label="Send product updates by email" />
          <NuCheckbox v-model="form.terms">I confirm this person agreed to the terms</NuCheckbox>
          <div class="nu-cluster">
            <NuButton type="submit" :loading="saving" :disabled="!form.terms">Create user</NuButton>
            <NuButton variant="ghost" color="secondary" to="/">Cancel</NuButton>
          </div>
        </form>
      </NuCard>
    </div>

    <div class="nu-col-lg-5 nu-stack">
      <NuCard title="Sizes &amp; states">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuInput size="sm" placeholder="Small input" aria-label="Small input" />
          <NuInput placeholder="Medium input" aria-label="Medium input" />
          <NuInput size="lg" placeholder="Large input" aria-label="Large input" />
          <NuInput placeholder="Search products" aria-label="Search products">
            <template #prefix><Search /></template>
            <template #suffix><kbd>⌘K</kbd></template>
          </NuInput>
          <NuInput label="Disabled" model-value="Can't touch this" disabled />
          <NuInput label="With error" model-value="not-an-email" error="Enter a valid email address." />
        </div>
      </NuCard>
      <NuCard title="Toggles">
        <div class="nu-stack" style="--nu-gap: 8px">
          <NuCheckbox :model-value="true" label="Checked" />
          <NuCheckbox label="Unchecked" />
          <NuCheckbox label="Disabled" disabled />
          <NuSwitch :model-value="true" label="Switch on" />
          <NuSwitch label="Switch off" />
        </div>
      </NuCard>
    </div>
  </div>
</template>
