<script setup lang="ts">
import { computed } from 'vue'
import {
  NuButton, NuCard, NuCheckbox, NuCombobox, NuDatePicker, NuInput, NuPageHeader, NuRadioGroup, NuSelect, NuTextarea,
  rules, useForm, useToast,
} from 'nusa-admin'

const toast = useToast()
const signup = useForm(
  { name: '', email: '', password: '', confirm: '', age: '', website: '', country: '', skills: [] as string[], start: null as string | null, plan: '', bio: '', terms: false },
  {
    name: [rules.required(), rules.minLength(3)],
    email: [rules.required(), rules.email()],
    password: [rules.required(), rules.minLength(8), rules.pattern(/\d/, 'Include at least one number.')],
    confirm: [rules.required('Repeat the password.'), rules.sameAs('password', 'Passwords do not match.')],
    age: [rules.required(), rules.min(18, 'You must be 18 or older.'), rules.max(120)],
    website: [rules.pattern(/^https?:\/\/\S+\.\S+/, 'Start with http:// or https://')],
    country: [rules.required('Choose a country.')],
    skills: [rules.required('Pick at least one skill.')],
    start: [rules.required('Choose a start date.')],
    plan: [rules.required('Choose a plan.')],
    bio: [rules.maxLength(160)],
    terms: [rules.required('You must accept the terms.')],
  },
)

const { field, values, submitting, reset } = signup
const bioHint = computed(() => `${values.bio.length}/160`)
const submit = signup.handleSubmit(async (values) => {
  await new Promise((r) => setTimeout(r, 600))
  toast.success({ title: 'Valid!', message: `Welcome, ${values.name}.` })
  signup.reset()
})
</script>

<template>
  <NuPageHeader title="Validation" subtitle="useForm() + rules: validates on blur, then live; submit focuses the first error." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Forms' }, { label: 'Validation' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-8">
      <NuCard title="Sign-up form" accent="primary">
        <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="submit">
          <div class="nu-row" style="--nu-gap: 12px">
            <div class="nu-col-md-6"><NuInput v-bind="field('name')" label="Full name" required autocomplete="name" /></div>
            <div class="nu-col-md-6"><NuInput v-bind="field('email')" label="Email" type="email" required autocomplete="email" /></div>
            <div class="nu-col-md-6"><NuInput v-bind="field('password')" label="Password" type="password" required autocomplete="new-password" hint="8+ characters with a number." /></div>
            <div class="nu-col-md-6"><NuInput v-bind="field('confirm')" label="Confirm password" type="password" required autocomplete="new-password" /></div>
            <div class="nu-col-md-4"><NuInput v-bind="field('age')" label="Age" type="number" required /></div>
            <div class="nu-col-md-8"><NuInput v-bind="field('website')" label="Website" placeholder="https://example.com" /></div>
            <div class="nu-col-md-6">
              <NuSelect v-bind="field('country')" label="Country" placeholder="Choose a country" required :options="[{ label: 'Indonesia', value: 'id' }, { label: 'Malaysia', value: 'my' }, { label: 'Singapore', value: 'sg' }]" />
            </div>
            <div class="nu-col-md-6"><NuDatePicker v-bind="field('start')" label="Start date" /></div>
            <div class="nu-col-12">
              <NuCombobox v-bind="field('skills')" multiple label="Skills" placeholder="Choose skills" :options="['Vue', 'TypeScript', 'CSS', 'Node', 'Go', 'SQL'].map((s) => ({ label: s, value: s }))" />
            </div>
          </div>
          <NuRadioGroup v-bind="field('plan')" label="Plan" inline :options="[{ label: 'Starter', value: 'starter' }, { label: 'Team', value: 'team' }, { label: 'Business', value: 'business' }]" />
          <NuTextarea v-bind="field('bio')" label="Short bio" :rows="3" :hint="bioHint" />
          <NuCheckbox v-bind="field('terms')">I accept the terms and privacy policy</NuCheckbox>
          <div class="nu-cluster">
            <NuButton type="submit" :loading="submitting">Create account</NuButton>
            <NuButton variant="ghost" color="secondary" @click="reset()">Reset</NuButton>
          </div>
        </form>
      </NuCard>
    </div>
    <div class="nu-col-lg-4">
      <NuCard title="How it works">
        <pre class="code">const form = useForm(
  { email: '' },
  { email: [rules.required(), rules.email()] },
)

&lt;NuInput v-bind="form.field('email')" /&gt;
&lt;form @submit.prevent="form.handleSubmit(save)()"&gt;</pre>
        <p class="nu-text-sm nu-text-muted" style="margin-top: 10px">
          Rules: <code>required</code>, <code>email</code>, <code>minLength</code>, <code>maxLength</code>, <code>min</code>, <code>max</code>, <code>pattern</code>, <code>sameAs</code> — or any function returning <code>true</code> or a message.
        </p>
      </NuCard>
    </div>
  </div>
</template>
