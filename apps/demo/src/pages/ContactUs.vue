<script setup lang="ts">
import { Clock, Mail, MapPin, Phone } from 'lucide-vue-next'
import { NuButton, NuCard, NuInput, NuLogo, NuPageHeader, NuSelect, NuTextarea, rules, useForm, useToast } from 'nusa-admin'

const toast = useToast()
const form = useForm(
  { name: '', email: '', topic: 'sales', message: '' },
  { name: [rules.required()], email: [rules.required(), rules.email()], message: [rules.required(), rules.minLength(10)] },
)
const send = form.handleSubmit(async () => {
  await new Promise((r) => setTimeout(r, 500))
  toast.success({ title: 'Thanks!', message: 'We will get back to you within one business day.' })
  form.reset()
})
</script>

<template>
  <NuPageHeader title="Contact us" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Contact us' }]" />

  <NuCard>
    <div class="nu-row">
      <div class="nu-col-md-5">
        <div class="nu-brand" style="margin-bottom: 12px"><NuLogo :size="32" /><span class="nu-brand__name">Nusa Admin</span></div>
        <ul class="contact-info">
          <li><MapPin /><span>Jl. Asia Afrika No. 8<br />Bandung 40111, Indonesia</span></li>
          <li><Phone /><span>+62 22 1234 5678</span></li>
          <li><Mail /><span>hello@example.com</span></li>
          <li><Clock /><span>Mon–Fri, 09:00–17:00 WIB</span></li>
        </ul>
      </div>
      <div class="nu-col-md-7">
        <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="send">
          <div class="nu-row" style="--nu-gap: 12px">
            <div class="nu-col-md-6"><NuInput v-bind="form.field('name')" label="Name" required autocomplete="name" /></div>
            <div class="nu-col-md-6"><NuInput v-bind="form.field('email')" label="Email" type="email" required autocomplete="email" /></div>
          </div>
          <NuSelect v-bind="form.field('topic')" label="Topic" :options="[{ label: 'Sales', value: 'sales' }, { label: 'Support', value: 'support' }, { label: 'Partnerships', value: 'partners' }]" />
          <NuTextarea v-bind="form.field('message')" label="Message" :rows="5" required />
          <div><NuButton type="submit" :loading="form.submitting.value">Send message</NuButton></div>
        </form>
      </div>
    </div>
  </NuCard>
</template>

<style>
.contact-info { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.contact-info li { display: flex; gap: 10px; }
.contact-info svg { flex: none; width: 18px; height: 18px; margin-top: 2px; color: var(--nu-primary); }
</style>
