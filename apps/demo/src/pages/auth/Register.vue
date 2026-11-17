<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NuAuthLayout, NuButton, NuCheckbox, NuInput } from 'nusa-admin'
import { useAuth } from '../../auth'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '', terms: false })
const errors = reactive<{ name?: string; email?: string; password?: string }>({})
const loading = ref(false)

function submit() {
  errors.name = form.name.trim() ? undefined : 'Enter your name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.'
  errors.password = form.password.length >= 8 ? undefined : 'Use at least 8 characters.'
  if (errors.name || errors.email || errors.password) return
  loading.value = true
  setTimeout(() => {
    useAuth().login(form.email, 'admin')
    router.push('/')
  }, 400)
}

defineProps<{ split?: boolean }>()
</script>

<template>
  <NuAuthLayout :variant="split ? 'split' : 'card'" aside-title="Start free. Bring your team when you are ready." aside-text="Dashboards, tables, forms and apps built on Vue 3 and Vite — compact, themeable and accessible." title="Create account" subtitle="Start your 14-day free trial.">
    <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="submit">
      <NuInput v-model="form.name" label="Full name" autocomplete="name" required :error="errors.name" />
      <NuInput v-model="form.email" label="Email" type="email" autocomplete="email" required :error="errors.email" />
      <NuInput v-model="form.password" label="Password" type="password" autocomplete="new-password" required :error="errors.password" hint="At least 8 characters." />
      <NuCheckbox v-model="form.terms">I agree to the terms and privacy policy</NuCheckbox>
      <NuButton type="submit" size="lg" block :loading="loading" :disabled="!form.terms">Create account</NuButton>
    </form>
    <template #footer>Already have an account? <RouterLink to="/auth/login">Sign in</RouterLink></template>
  </NuAuthLayout>
</template>
