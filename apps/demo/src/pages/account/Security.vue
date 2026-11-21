<script setup lang="ts">
import { computed, ref } from 'vue'
import { KeyRound, Laptop, LogOut, ShieldCheck, Smartphone } from 'lucide-vue-next'
import {
  NuAlert, NuBadge, NuButton, NuCard, NuInput, NuList, NuListItem, NuModal, NuPageHeader, NuPinInput, NuProgress, NuSecretField, NuSteps, NuSwitch,
  rules, useConfirm, useForm, useToast,
} from 'nusa-admin'

const toast = useToast()
const { confirm } = useConfirm()

/* Password */
const pw = useForm(
  { current: '', next: '', confirm: '' },
  { current: [rules.required()], next: [rules.required(), rules.minLength(10), rules.pattern(/[A-Z]/, 'Add an uppercase letter.'), rules.pattern(/\d/, 'Add a number.')], confirm: [rules.required(), rules.sameAs('next', 'Passwords do not match.')] },
)
const strength = computed(() => {
  const v = pw.values.next
  return [v.length >= 10, /[A-Z]/.test(v), /[a-z]/.test(v), /\d/.test(v), /[^\w]/.test(v)].filter(Boolean).length * 20
})
const strengthLabel = computed(() => (strength.value >= 80 ? 'Strong' : strength.value >= 60 ? 'Good' : strength.value >= 40 ? 'Fair' : 'Weak'))
const savePw = pw.handleSubmit(async () => {
  await new Promise((r) => setTimeout(r, 400))
  toast.success('Password updated. Other sessions were signed out.')
  pw.reset()
})

/* Two-factor */
const twoFactor = ref(false)
const setup = ref(false)
const step = ref(0)
const code = ref('')
const codeError = ref('')
const SECRET = 'JBSWY3DPEHPK3PXP'
const backup = ['7F3K-9QWX', 'M2PL-4TZA', 'XC8N-1RJD', 'H6VB-0YEU', 'Q9TS-5LKM', 'B4WG-2NHF']
/** Placeholder QR made of blocks (no network): replace with a real QR from your backend. */
const qr = Array.from({ length: 21 * 21 }, (_, i) => {
  const x = i % 21, y = Math.floor(i / 21)
  const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5))
  if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true
  if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false
  return ((x * 7 + y * 13 + x * y) % 5) < 2
})
function verify() {
  if (code.value.length < 6) return (codeError.value = 'Enter the 6-digit code.')
  if (code.value === '000000') return (codeError.value = 'That code didn’t match. Try the newest one.')
  step.value = 2
}
function finish() {
  twoFactor.value = true
  setup.value = false
  step.value = 0
  code.value = ''
  toast.success('Two-step verification is on.')
}
async function disable2fa() {
  if (await confirm({ title: 'Turn off two-step verification?', message: 'Your account will be protected by your password only.', danger: true, confirmLabel: 'Turn off' })) twoFactor.value = false
}

/* Sessions */
const sessions = ref([
  { id: 1, device: 'Chrome on macOS', icon: Laptop, place: 'Bandung, ID', ip: '103.12.4.18', last: 'Active now', current: true },
  { id: 2, device: 'Safari on iPhone', icon: Smartphone, place: 'Bandung, ID', ip: '114.79.2.201', last: '2 hours ago', current: false },
  { id: 3, device: 'Firefox on Windows', icon: Laptop, place: 'Jakarta, ID', ip: '36.68.140.7', last: '3 days ago', current: false },
])
async function endSession(id: number) {
  sessions.value = sessions.value.filter((s) => s.id !== id)
  toast.info('Session signed out.')
}
async function endOthers() {
  if (await confirm({ title: 'Sign out all other sessions?', confirmLabel: 'Sign out others' })) sessions.value = sessions.value.filter((s) => s.current)
}
const alerts = ref({ login: true, password: true, token: false })
const score = computed(() => 40 + (twoFactor.value ? 40 : 0) + (sessions.value.length <= 2 ? 20 : 10))
</script>

<template>
  <NuPageHeader title="Security" subtitle="Password, two-step verification and signed-in devices." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Account' }, { label: 'Security' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-8 nu-stack">
      <NuCard title="Two-step verification" :subtitle="twoFactor ? 'On — authenticator app' : 'Off'">
        <template #tools><NuBadge :color="twoFactor ? 'success' : 'warning'" dot>{{ twoFactor ? 'Enabled' : 'Not enabled' }}</NuBadge></template>
        <p class="nu-text-muted" style="margin-bottom: 10px">Ask for a code from your authenticator app when you sign in on a new device.</p>
        <NuButton v-if="!twoFactor" :icon="ShieldCheck" @click="setup = true">Set up</NuButton>
        <NuButton v-else variant="outline" color="danger" @click="disable2fa">Turn off</NuButton>
      </NuCard>

      <NuCard title="Change password">
        <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="savePw">
          <NuInput v-bind="pw.field('current')" label="Current password" type="password" autocomplete="current-password" />
          <div class="nu-row" style="--nu-gap: 12px">
            <div class="nu-col-md-6">
              <NuInput v-bind="pw.field('next')" label="New password" type="password" autocomplete="new-password" />
              <NuProgress v-if="pw.values.next" :value="strength" :height="4" :color="strength >= 80 ? 'success' : strength >= 60 ? 'info' : strength >= 40 ? 'warning' : 'danger'" :label="`Strength: ${strengthLabel}`" show-value style="margin-top: 6px" />
            </div>
            <div class="nu-col-md-6"><NuInput v-bind="pw.field('confirm')" label="Confirm new password" type="password" autocomplete="new-password" /></div>
          </div>
          <div><NuButton type="submit" :loading="pw.submitting.value">Update password</NuButton></div>
        </form>
      </NuCard>

      <NuCard title="Signed-in devices" flush>
        <template #tools><NuButton size="sm" variant="ghost" color="danger" :disabled="sessions.length < 2" @click="endOthers">Sign out others</NuButton></template>
        <NuList>
          <NuListItem v-for="s in sessions" :key="s.id" :icon="s.icon" :title="s.device" :subtitle="`${s.place} · ${s.ip} · ${s.last}`">
            <template #end>
              <NuBadge v-if="s.current" color="success">This device</NuBadge>
              <NuButton v-else size="sm" variant="ghost" color="secondary" :icon="LogOut" square :aria-label="`Sign out ${s.device}`" @click="endSession(s.id)" />
            </template>
          </NuListItem>
        </NuList>
      </NuCard>
    </div>

    <div class="nu-col-lg-4 nu-stack">
      <NuCard title="Security score">
        <NuProgress :value="score" :color="score >= 80 ? 'success' : 'warning'" :label="score >= 80 ? 'Well protected' : 'Could be stronger'" show-value />
        <ul class="tips" style="margin-top: 10px">
          <li :class="{ 'is-done': twoFactor }">Turn on two-step verification</li>
          <li class="is-done">Use a unique password</li>
          <li :class="{ 'is-done': sessions.length <= 2 }">Review signed-in devices</li>
        </ul>
      </NuCard>
      <NuCard title="Email alerts">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuSwitch v-model="alerts.login" label="New sign-in from an unknown device" />
          <NuSwitch v-model="alerts.password" label="Password changed" />
          <NuSwitch v-model="alerts.token" label="API token created" />
        </div>
      </NuCard>
    </div>
  </div>

  <NuModal v-model="setup" title="Set up two-step verification">
    <NuSteps :model-value="step" :steps="[{ title: 'Scan' }, { title: 'Verify' }, { title: 'Backup codes' }]" style="margin-bottom: 14px" />
    <div v-if="step === 0" class="nu-stack" style="--nu-gap: 12px">
      <p>Scan this code with Google Authenticator, 1Password or any TOTP app.</p>
      <div class="qr" role="img" aria-label="QR code (demo)"><i v-for="(on, i) in qr" :key="i" :class="{ on }" /></div>
      <NuSecretField :value="SECRET" label="Or enter this key" :masked="false" />
    </div>
    <div v-else-if="step === 1" class="nu-stack" style="--nu-gap: 12px">
      <p>Enter the 6-digit code the app shows now. <span class="nu-text-muted">(Demo: anything but 000000.)</span></p>
      <NuPinInput v-model="code" label="Code" :error="codeError" @complete="verify" @update:model-value="codeError = ''" />
    </div>
    <div v-else class="nu-stack" style="--nu-gap: 12px">
      <NuAlert color="info" title="Save these backup codes">Each code works once if you lose your phone.</NuAlert>
      <div class="backup"><code v-for="c in backup" :key="c">{{ c }}</code></div>
    </div>
    <template #footer>
      <NuButton v-if="step > 0 && step < 2" variant="ghost" color="secondary" @click="step--">Back</NuButton>
      <NuButton v-if="step === 0" :icon="KeyRound" @click="step = 1">I’ve scanned it</NuButton>
      <NuButton v-else-if="step === 1" @click="verify">Verify</NuButton>
      <NuButton v-else @click="finish">Done</NuButton>
    </template>
  </NuModal>
</template>

<style>
.tips li.is-done { color: var(--nu-success); text-decoration: line-through; }
.qr { display: grid; grid-template-columns: repeat(21, 1fr); width: 168px; height: 168px; padding: 8px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: #fff; }
.qr i.on { background: #0a0a0a; }
.backup { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
.backup code { padding: 6px; text-align: center; font-size: 13px; }
</style>
