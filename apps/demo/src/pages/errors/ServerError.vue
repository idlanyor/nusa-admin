<script setup lang="ts">
import { NuButton, NuErrorPage } from 'nusa-admin'

const reload = () => window.location.reload()
</script>

<template>
  <NuErrorPage code="500" title="Something went wrong" description="The server couldn't complete the request. Try again in a moment.">
    <NuButton @click="reload">Try again</NuButton>
    <NuButton variant="outline" color="secondary" to="/">Back to dashboard</NuButton>
  </NuErrorPage>
</template>
