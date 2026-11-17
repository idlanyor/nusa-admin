<script setup lang="ts">
import { NuButton, NuErrorPage } from 'nusa-admin'
</script>

<template>
  <NuErrorPage code="404" title="Page not found" description="The page you're looking for doesn't exist or was moved.">
    <NuButton to="/">Back to dashboard</NuButton>
  </NuErrorPage>
</template>
