<script setup lang="ts">
import { NuCard, NuPageHeader } from 'nusa-admin'
</script>

<template>
  <NuPageHeader title="Blank page" subtitle="Copy this file to start a new page." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Blank' }]" />

  <NuCard title="Card title">
    Start building here. Add a route in <code>router.ts</code> and an entry in <code>menu.ts</code>.
  </NuCard>
</template>
