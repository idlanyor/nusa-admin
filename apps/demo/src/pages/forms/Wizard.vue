<script setup lang="ts">
import { reactive, ref } from 'vue'
import { PartyPopper } from 'lucide-vue-next'
import {
  NuButton, NuCard, NuDescriptions, NuEmpty, NuInput, NuPageHeader, NuRadioGroup, NuSelect, NuSteps, NuSwitch, useToast,
} from 'nusa-admin'

const toast = useToast()
const step = ref(0)
const form = reactive({ name: '', email: '', company: '', size: '1-10', plan: 'team', yearly: true })
const errors = reactive<{ name?: string; email?: string; company?: string }>({})

const steps = [
  { title: 'Account', description: 'Who are you' },
  { title: 'Workspace', description: 'Your company' },
  { title: 'Plan', description: 'Pick a plan' },
  { title: 'Review', description: 'Confirm' },
]

function validate() {
  if (step.value === 0) {
    errors.name = form.name.trim() ? undefined : 'Enter your name.'
    errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.'
    return !errors.name && !errors.email
  }
  if (step.value === 1) {
    errors.company = form.company.trim() ? undefined : 'Enter a company name.'
    return !errors.company
  }
  return true
}
function next() {
  if (validate()) step.value++
}
function finish() {
  step.value = steps.length
  toast.success({ title: 'Workspace created', message: `${form.company} is ready.` })
}
</script>

<template>
  <NuPageHeader
    title="Form wizard"
    subtitle="A multi-step form with per-step validation."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Forms' }, { label: 'Wizard' }]"
  />

  <NuCard style="max-width: 760px">
    <template #header><NuSteps :model-value="step" :steps="steps" style="flex: 1" /></template>

    <form v-if="step < steps.length" class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="step === steps.length - 1 ? finish() : next()">
      <template v-if="step === 0">
        <NuInput v-model="form.name" label="Full name" required :error="errors.name" autocomplete="name" />
        <NuInput v-model="form.email" label="Work email" type="email" required :error="errors.email" autocomplete="email" />
      </template>

      <template v-else-if="step === 1">
        <NuInput v-model="form.company" label="Company" required :error="errors.company" autocomplete="organization" />
        <NuSelect
          v-model="form.size"
          label="Team size"
          :options="[{ label: '1–10', value: '1-10' }, { label: '11–50', value: '11-50' }, { label: '51–200', value: '51-200' }, { label: '200+', value: '200+' }]"
        />
      </template>

      <template v-else-if="step === 2">
        <NuRadioGroup
          v-model="form.plan"
          label="Plan"
          :options="[{ label: 'Starter — $19/mo', value: 'starter' }, { label: 'Team — $79/mo', value: 'team' }, { label: 'Business — $249/mo', value: 'business' }]"
        />
        <NuSwitch v-model="form.yearly" label="Bill yearly (2 months free)" />
      </template>

      <template v-else>
        <NuDescriptions
          :columns="2"
          :items="[
            { label: 'Name', value: form.name },
            { label: 'Email', value: form.email },
            { label: 'Company', value: form.company },
            { label: 'Team size', value: form.size },
            { label: 'Plan', value: form.plan },
            { label: 'Billing', value: form.yearly ? 'Yearly' : 'Monthly' },
          ]"
        />
      </template>

      <div class="nu-between">
        <NuButton variant="outline" color="secondary" :disabled="step === 0" @click="step--">Back</NuButton>
        <NuButton type="submit">{{ step === steps.length - 1 ? 'Create workspace' : 'Continue' }}</NuButton>
      </div>
    </form>

    <NuEmpty v-else title="All set" :description="`${form.company} was created on the ${form.plan} plan.`" :icon="PartyPopper">
      <NuButton size="sm" variant="outline" color="secondary" @click="step = 0">Start over</NuButton>
    </NuEmpty>
  </NuCard>
</template>
