<script setup lang="ts">
import { Wrench } from 'lucide-vue-next'
import { NuButton, NuErrorPage } from 'nusa-admin'
</script>

<template>
  <NuErrorPage title="We'll be right back" description="Scheduled maintenance is in progress. It should take about 30 minutes.">
    <template #icon><Wrench /></template>
    <NuButton variant="outline" color="secondary" to="/">Back to dashboard</NuButton>
  </NuErrorPage>
</template>
