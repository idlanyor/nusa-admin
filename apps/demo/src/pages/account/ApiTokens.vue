<script setup lang="ts">
import { ref } from 'vue'
import { KeyRound, Plus, Trash2 } from 'lucide-vue-next'
import {
  NuAlert, NuBadge, NuButton, NuCard, NuCheckbox, NuEmpty, NuInput, NuModal, NuPageHeader, NuSecretField, NuSelect, NuTable, rules, useConfirm, useForm, useToast,
  type NuTableColumn,
} from 'nusa-admin'

interface Token { id: number; name: string; prefix: string; scopes: string[]; created: string; lastUsed: string | null; expires: string | null }
const toast = useToast()
const { confirm } = useConfirm()
const SCOPES = [
  { key: 'read', label: 'Read', help: 'List and view resources' },
  { key: 'write', label: 'Write', help: 'Create and update resources' },
  { key: 'delete', label: 'Delete', help: 'Remove resources' },
  { key: 'billing', label: 'Billing', help: 'Invoices and payment methods' },
]
const tokens = ref<Token[]>([
  { id: 3, name: 'CI deploy', prefix: 'nu_live_8f2a', scopes: ['read', 'write'], created: '2026-10-02', lastUsed: '2026-11-21 08:55', expires: '2027-01-02' },
  { id: 2, name: 'Zapier integration', prefix: 'nu_live_c41d', scopes: ['read'], created: '2026-07-18', lastUsed: '2026-11-19 22:10', expires: null },
  { id: 1, name: 'Old script', prefix: 'nu_live_09b3', scopes: ['read', 'write', 'delete'], created: '2025-12-01', lastUsed: null, expires: '2026-12-01' },
])
const columns: NuTableColumn<Token>[] = [
  { key: 'name', label: 'Name' },
  { key: 'scopes', label: 'Scopes' },
  { key: 'lastUsed', label: 'Last used', format: (v) => v ?? 'Never' },
  { key: 'expires', label: 'Expires', format: (v) => v ?? 'Never' },
  { key: 'actions', label: '', align: 'right', width: '60px' },
]

const creating = ref(false)
const created = ref<string | null>(null)
const form = useForm({ name: '', expiry: '90', scopes: ['read'] as string[] }, { name: [rules.required(), rules.maxLength(40)], scopes: [rules.required('Pick at least one scope.')] })
function toggleScope(key: string, on: boolean) {
  form.values.scopes = on ? [...form.values.scopes, key] : form.values.scopes.filter((s) => s !== key)
}
const randomHex = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('')
const submit = form.handleSubmit((v) => {
  const secret = `nu_live_${randomHex(20)}`
  const exp = v.expiry === 'never' ? null : new Date(Date.now() + Number(v.expiry) * 864e5).toISOString().slice(0, 10)
  tokens.value.unshift({ id: Date.now(), name: v.name.trim(), prefix: secret.slice(0, 12), scopes: v.scopes, created: new Date().toISOString().slice(0, 10), lastUsed: null, expires: exp })
  created.value = secret
  creating.value = false
  form.reset()
})
async function revoke(t: Token) {
  if (await confirm({ title: `Revoke “${t.name}”?`, message: 'Apps using this token stop working immediately. This can’t be undone.', danger: true, confirmLabel: 'Revoke token', typeToConfirm: t.name })) {
    tokens.value = tokens.value.filter((x) => x.id !== t.id)
    toast.info(`${t.name} revoked.`)
  }
}
</script>

<template>
  <NuPageHeader title="API tokens" subtitle="Personal tokens for scripts and integrations." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Account' }, { label: 'API tokens' }]">
    <NuButton :icon="Plus" @click="creating = true">Create token</NuButton>
  </NuPageHeader>

  <div class="nu-row">
    <div class="nu-col-lg-8">
      <NuCard flush>
        <NuTable v-if="tokens.length" :columns="columns" :rows="tokens" row-key="id" :page-size="0">
          <template #cell-name="{ row }">
            <div class="nu-fw-600">{{ row.name }}</div>
            <code class="nu-text-sm">{{ row.prefix }}…</code>
          </template>
          <template #cell-scopes="{ row }"><div class="nu-cluster" style="--nu-gap: 4px"><NuBadge v-for="s in row.scopes" :key="s" :color="s === 'delete' ? 'danger' : s === 'billing' ? 'warning' : 'secondary'">{{ s }}</NuBadge></div></template>
          <template #cell-actions="{ row }"><NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="`Revoke ${row.name}`" @click="revoke(row as Token)" /></template>
        </NuTable>
        <NuEmpty v-else title="No tokens yet" description="Create one to call the API from scripts." :icon="KeyRound" />
      </NuCard>
    </div>
    <div class="nu-col-lg-4">
      <NuCard title="Good practice">
        <ul class="tips">
          <li>Give each integration its own token so you can revoke one without breaking others.</li>
          <li>Grant only the scopes it needs, and set an expiry.</li>
          <li>Send it as <code>Authorization: Bearer &lt;token&gt;</code>. Never put it in front-end code.</li>
        </ul>
      </NuCard>
    </div>
  </div>

  <NuModal v-model="creating" title="Create API token">
    <form id="token-form" class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="submit">
      <NuInput v-bind="form.field('name')" label="Name" placeholder="e.g. CI deploy" required />
      <NuSelect v-bind="form.field('expiry')" label="Expires" :options="[{ label: '30 days', value: '30' }, { label: '90 days', value: '90' }, { label: '1 year', value: '365' }, { label: 'Never', value: 'never' }]" />
      <fieldset class="scopes">
        <legend class="nu-field__label">Scopes</legend>
        <NuCheckbox v-for="s in SCOPES" :key="s.key" :model-value="form.values.scopes.includes(s.key)" @update:model-value="toggleScope(s.key, $event)">
          <strong>{{ s.label }}</strong> <span class="nu-text-muted">— {{ s.help }}</span>
        </NuCheckbox>
        <span v-if="form.errors.scopes" class="nu-field__error">{{ form.errors.scopes }}</span>
      </fieldset>
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="token-form">Create token</NuButton>
    </template>
  </NuModal>

  <NuModal :model-value="!!created" title="Token created" persistent @update:model-value="!$event && (created = null)">
    <div class="nu-stack" style="--nu-gap: 12px">
      <NuAlert color="warning" title="Copy it now">You won’t be able to see this token again.</NuAlert>
      <NuSecretField v-if="created" :value="created" label="Your new token" :masked="false" @copy="toast.success('Token copied.')" />
    </div>
    <template #footer>
      <NuButton @click="created = null">I’ve copied it</NuButton>
    </template>
  </NuModal>
</template>

<style>
.scopes { display: grid; gap: 6px; margin: 0; padding: 0; border: 0; }
.scopes legend { padding: 0; margin-bottom: 4px; }
</style>
