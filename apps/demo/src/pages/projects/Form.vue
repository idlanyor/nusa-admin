<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NuButton, NuCard, NuCombobox, NuDatePicker, NuInput, NuPageHeader, NuSelect, NuSlider, NuTextarea, rules, useForm, useToast } from 'nusa-admin'
import { contacts, projects, type ProjectStatus } from '../../data'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const existing = computed(() => projects.find((p) => String(p.id) === route.params.id))
const isEdit = computed(() => !!route.params.id)

const p = existing.value
const form = useForm(
  {
    name: p?.name ?? '',
    client: p?.client ?? '',
    description: p?.description ?? '',
    status: (p?.status ?? 'In progress') as ProjectStatus,
    dates: (p ? [p.start, p.end] : null) as [string, string] | null,
    budget: p?.budget ?? '',
    spent: p?.spent ?? 0,
    progress: p?.progress ?? 0,
    lead: p?.lead ?? '',
    team: p?.team ?? ([] as string[]),
  },
  {
    name: [rules.required(), rules.minLength(3)],
    client: [rules.required()],
    dates: [rules.required('Choose the start and due dates.')],
    budget: [rules.required(), rules.min(0)],
    lead: [rules.required('Choose a project lead.')],
  },
)
const people = contacts.map((c) => ({ label: c.name, value: c.name }))

const save = form.handleSubmit(async (values) => {
  await new Promise((r) => setTimeout(r, 500))
  toast.success(isEdit.value ? `${values.name} updated.` : `${values.name} created.`)
  router.push(existing.value ? `/projects/${existing.value.id}` : '/projects')
})
</script>

<template>
  <NuPageHeader
    :title="isEdit ? `Edit ${existing?.name ?? 'project'}` : 'New project'"
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: isEdit ? 'Edit' : 'New' }]"
  />

  <form novalidate @submit.prevent="save">
    <div class="nu-row">
      <div class="nu-col-lg-6">
        <NuCard title="General" accent="primary">
          <div class="nu-stack" style="--nu-gap: 12px">
            <NuInput v-bind="form.field('name')" label="Project name" required />
            <NuTextarea v-bind="form.field('description')" label="Description" :rows="4" />
            <NuSelect v-bind="form.field('status')" label="Status" :options="['In progress', 'Done', 'On hold', 'Cancelled'].map((s) => ({ label: s, value: s }))" />
            <NuInput v-bind="form.field('client')" label="Client company" required />
            <NuCombobox v-bind="form.field('lead')" label="Project lead" :options="people" placeholder="Choose a lead" />
          </div>
        </NuCard>
      </div>
      <div class="nu-col-lg-6">
        <NuCard title="Budget & schedule" accent="secondary">
          <div class="nu-stack" style="--nu-gap: 12px">
            <NuDatePicker v-bind="form.field('dates')" range label="Start and due date" />
            <div class="nu-row" style="--nu-gap: 12px">
              <div class="nu-col-6"><NuInput v-bind="form.field('budget')" label="Estimated budget" type="number" min="0" required><template #prefix>$</template></NuInput></div>
              <div class="nu-col-6"><NuInput v-bind="form.field('spent')" label="Amount spent" type="number" min="0"><template #prefix>$</template></NuInput></div>
            </div>
            <NuSlider v-bind="form.field('progress')" label="Progress" show-value :format="(v) => `${v}%`" />
            <NuCombobox v-bind="form.field('team')" label="Team" :options="people" multiple placeholder="Add members" />
          </div>
        </NuCard>
      </div>
    </div>
    <div class="nu-cluster" style="margin-top: 16px">
      <NuButton type="submit" :loading="form.submitting.value">{{ isEdit ? 'Save changes' : 'Create project' }}</NuButton>
      <NuButton variant="ghost" color="secondary" :to="existing ? `/projects/${existing.id}` : '/projects'">Cancel</NuButton>
    </div>
  </form>
</template>
