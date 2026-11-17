<script setup lang="ts">
import { ShieldAlert } from 'lucide-vue-next'
import { NuButton, NuErrorPage } from 'nusa-admin'
import { roleLabel, useAuth } from '../../auth'

const { user } = useAuth()
</script>

<template>
  <NuErrorPage code="403" title="You don't have access to this page" :description="`Signed in as ${user?.name ?? 'guest'} (${user ? roleLabel[user.role] : 'no role'}). Ask an administrator for access, or sign in with another account.`">
    <template #icon><ShieldAlert /></template>
    <NuButton to="/">Back to dashboard</NuButton>
    <NuButton variant="outline" color="secondary" to="/auth/login">Switch account</NuButton>
  </NuErrorPage>
</template>
