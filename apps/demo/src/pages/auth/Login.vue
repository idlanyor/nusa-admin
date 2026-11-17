<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, Mail } from 'lucide-vue-next'
import { NuAuthLayout, NuButton, NuCheckbox, NuDivider, NuInput } from 'nusa-admin'

const router = useRouter()
const email = ref('ayu@example.com')
const password = ref('password')
const remember = ref(true)
const loading = ref(false)

function signIn() {
  loading.value = true
  setTimeout(() => router.push('/'), 600)
}

defineProps<{ split?: boolean }>()
</script>

<template>
  <NuAuthLayout :variant="split ? 'split' : 'card'" aside-title="Manage your whole operation from one place." aside-text="Dashboards, tables, forms and apps built on Vue 3 and Vite — compact, themeable and accessible." title="Sign in" subtitle="Welcome back. Enter your details to continue.">
    <form class="nu-stack" style="--nu-gap: 12px" @submit.prevent="signIn">
      <NuInput v-model="email" label="Email" type="email" autocomplete="email" required>
        <template #prefix><Mail /></template>
      </NuInput>
      <NuInput v-model="password" label="Password" type="password" autocomplete="current-password" required>
        <template #prefix><Lock /></template>
      </NuInput>
      <div class="nu-between">
        <NuCheckbox v-model="remember" label="Remember me" />
        <RouterLink to="/auth/forgot-password">Forgot password?</RouterLink>
      </div>
      <NuButton type="submit" size="lg" block :loading="loading">Sign in</NuButton>
      <NuDivider label="or" />
      <NuButton variant="outline" color="secondary" block @click="signIn">Continue with SSO</NuButton>
    </form>
    <template #footer>No account yet? <RouterLink to="/auth/register">Create one</RouterLink></template>
  </NuAuthLayout>
</template>
