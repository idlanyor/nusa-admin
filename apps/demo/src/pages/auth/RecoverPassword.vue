<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NuAuthLayout, NuButton, NuInput, rules, useForm, useToast } from 'nusa-admin'

const router = useRouter()
const toast = useToast()
const form = useForm(
  { password: '', confirm: '' },
  { password: [rules.required(), rules.minLength(8)], confirm: [rules.required(), rules.sameAs('password', 'Passwords do not match.')] },
)
const save = form.handleSubmit(async () => {
  await new Promise((r) => setTimeout(r, 500))
  toast.success('Password changed. Sign in with your new password.')
  router.push('/auth/login')
})
</script>

<template>
  <NuAuthLayout title="Choose a new password" subtitle="You're only one step away from your new password.">
    <form class="nu-stack" style="--nu-gap: 12px" novalidate @submit.prevent="save">
      <NuInput v-bind="form.field('password')" label="New password" type="password" autocomplete="new-password" hint="At least 8 characters." />
      <NuInput v-bind="form.field('confirm')" label="Confirm password" type="password" autocomplete="new-password" />
      <NuButton type="submit" size="lg" block :loading="form.submitting.value">Change password</NuButton>
    </form>
    <template #footer><RouterLink to="/auth/login">Back to sign in</RouterLink></template>
  </NuAuthLayout>
</template>
