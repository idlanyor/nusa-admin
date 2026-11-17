<script setup lang="ts">
import { NuButton, NuCard, NuEmpty } from 'nusa-admin'
</script>

<template>
  <NuCard flush>
    <NuEmpty title="Page not found" description="It may have moved. Try the search (Ctrl+K).">
      <NuButton size="sm" to="/">Docs home</NuButton>
    </NuEmpty>
  </NuCard>
</template>
