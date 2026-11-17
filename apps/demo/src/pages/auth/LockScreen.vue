<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from 'lucide-vue-next'
import { NuAuthLayout, NuAvatar, NuButton, NuInput } from 'nusa-admin'
import { useAuth } from '../../auth'

const router = useRouter()
const password = ref('')
const { user } = useAuth()
</script>

<template>
  <NuAuthLayout title="Session locked" subtitle="Enter your password to pick up where you left off.">
    <div class="nu-cluster" style="margin-bottom: 12px">
      <NuAvatar :name="user?.name ?? 'Guest'" :size="40" />
      <div>
        <div class="nu-fw-600">{{ user?.name ?? 'Guest' }}</div>
        <div class="nu-text-sm nu-text-muted">{{ user?.email }}</div>
      </div>
    </div>
    <form class="nu-stack" style="--nu-gap: 12px" @submit.prevent="router.push(user ? '/' : '/auth/login')">
      <NuInput v-model="password" label="Password" type="password" autocomplete="current-password" required>
        <template #prefix><Lock /></template>
      </NuInput>
      <NuButton type="submit" size="lg" block>Unlock</NuButton>
    </form>
    <template #footer>Not you? <RouterLink to="/auth/login">Sign in as someone else</RouterLink></template>
  </NuAuthLayout>
</template>
