<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShieldCheck } from 'lucide-vue-next'
import { NuAuthLayout, NuButton, NuPinInput, useToast } from 'nusa-admin'

const router = useRouter()
const toast = useToast()
const code = ref('')
const error = ref('')
const loading = ref(false)
const wait = ref(30)
const timer = setInterval(() => wait.value > 0 && wait.value--, 1000)
onBeforeUnmount(() => clearInterval(timer))

function verify(value = code.value) {
  if (value.length < 6) return (error.value = 'Enter all 6 digits.')
  loading.value = true
  setTimeout(() => {
    loading.value = false
    // demo rule: any code works except 000000
    if (value === '000000') {
      error.value = 'That code is not valid. Try again.'
      code.value = ''
      return
    }
    toast.success('Verified.')
    router.push('/')
  }, 500)
}
function resend() {
  wait.value = 30
  toast.info('A new code was sent to •••• 7890.')
}
</script>

<template>
  <NuAuthLayout title="Two-step verification" subtitle="Enter the 6-digit code from your authenticator app or the SMS sent to •••• 7890.">
    <form class="nu-stack" style="--nu-gap: 14px" @submit.prevent="verify()">
      <div class="twofa-icon"><ShieldCheck /></div>
      <NuPinInput v-model="code" label="Verification code" :error="error" @complete="verify" @update:model-value="error = ''" />
      <NuButton type="submit" size="lg" block :loading="loading">Verify</NuButton>
      <p class="nu-text-sm nu-text-muted" style="text-align: center">
        Didn’t get it?
        <button type="button" class="twofa-resend" :disabled="wait > 0" @click="resend">{{ wait > 0 ? `Resend in ${wait}s` : 'Resend code' }}</button>
      </p>
      <p class="nu-text-sm nu-text-muted" style="text-align: center">Demo: any 6 digits work except 000000.</p>
    </form>
    <template #footer><RouterLink to="/auth/login">Back to sign in</RouterLink></template>
  </NuAuthLayout>
</template>

<style>
.twofa-icon { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: color-mix(in srgb, var(--nu-primary) 12%, transparent); color: var(--nu-primary); }
.twofa-icon svg { width: 24px; height: 24px; }
.twofa-resend { padding: 0; border: 0; background: none; color: var(--nu-primary); font: inherit; cursor: pointer; }
.twofa-resend:disabled { color: var(--nu-text-muted); cursor: default; }
</style>
