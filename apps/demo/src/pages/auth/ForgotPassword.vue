<script setup lang="ts">
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import { NuAlert, NuAuthLayout, NuButton, NuInput } from 'nusa-admin'

const email = ref('')
const sent = ref(false)
</script>

<template>
  <NuAuthLayout title="Reset password" subtitle="We'll email you a link to choose a new password.">
    <NuAlert v-if="sent" color="success" title="Check your inbox">If an account exists for {{ email }}, a reset link is on its way.</NuAlert>
    <form v-else class="nu-stack" style="--nu-gap: 12px" @submit.prevent="sent = true">
      <NuInput v-model="email" label="Email" type="email" autocomplete="email" required>
        <template #prefix><Mail /></template>
      </NuInput>
      <NuButton type="submit" size="lg" block>Send reset link</NuButton>
    </form>
    <template #footer><RouterLink to="/auth/login">Back to sign in</RouterLink></template>
  </NuAuthLayout>
</template>
