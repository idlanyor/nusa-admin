<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FileText, Inbox, Paperclip, Send, Trash2 } from 'lucide-vue-next'
import { NuButton, NuCard, NuCombobox, NuEditor, NuFileUpload, NuInput, NuList, NuListItem, NuPageHeader, rules, useForm, useToast } from 'nusa-admin'
import { contacts } from '../../data'

const router = useRouter()
const toast = useToast()
const form = useForm(
  { to: [] as string[], subject: '', body: '', files: [] as File[] },
  { to: [rules.required('Add at least one recipient.')], subject: [rules.required('Add a subject.')], body: [rules.required('Write a message.')] },
)
const people = contacts.map((c) => ({ label: `${c.name} <${c.email}>`, value: c.email }))

const send = form.handleSubmit(async () => {
  await new Promise((r) => setTimeout(r, 500))
  toast.success({ title: 'Message sent', message: `To ${form.values.to.length} recipient(s).` })
  router.push('/apps/mailbox')
})
</script>

<template>
  <NuPageHeader title="Compose" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Mailbox', to: '/apps/mailbox' }, { label: 'Compose' }]" />

  <div class="compose">
    <div class="nu-stack" style="--nu-gap: 12px">
      <NuButton block to="/apps/mailbox" :icon="Inbox">Back to inbox</NuButton>
      <NuCard title="Folders" flush>
        <NuList>
          <NuListItem :icon="Inbox" title="Inbox" to="/apps/mailbox" />
          <NuListItem :icon="Send" title="Sent" to="/apps/mailbox" />
          <NuListItem :icon="FileText" title="Drafts" to="/apps/mailbox" />
          <NuListItem :icon="Trash2" title="Trash" to="/apps/mailbox" />
        </NuList>
      </NuCard>
    </div>

    <NuCard title="Compose new message" accent="primary">
      <form id="compose" class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="send">
        <NuCombobox v-bind="form.field('to')" :options="people" multiple label="To" placeholder="Choose recipients" search-placeholder="Search contacts" />
        <NuInput v-bind="form.field('subject')" label="Subject" />
        <NuEditor v-bind="form.field('body')" label="Message" placeholder="Write your message…" min-height="220px" />
        <NuFileUpload v-model="form.values.files" multiple label="Attach files" hint="Max 25 MB in total" />
      </form>
      <template #footer>
        <div class="nu-between">
          <NuButton variant="ghost" color="danger" :icon="Trash2" to="/apps/mailbox">Discard</NuButton>
          <div class="nu-cluster">
            <NuButton variant="outline" color="secondary" :icon="Paperclip" @click="toast.info('Draft saved.')">Save draft</NuButton>
            <NuButton type="submit" form="compose" :icon="Send" :loading="form.submitting.value">Send</NuButton>
          </div>
        </div>
      </template>
    </NuCard>
  </div>
</template>

<style>
.compose { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 12px; align-items: start; }
@media (max-width: 800px) { .compose { grid-template-columns: 1fr; } }
</style>
