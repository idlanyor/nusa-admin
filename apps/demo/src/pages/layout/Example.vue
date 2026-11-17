<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NuAlert, NuButton, NuCard, NuPageHeader } from 'nusa-admin'

const route = useRoute()
const meta = computed(() => route.meta as { title?: string; note?: string })
</script>

<template>
  <NuPageHeader :title="meta.title ?? 'Layout'" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Layout options', to: '/layout/options' }, { label: meta.title ?? '' }]">
    <NuButton variant="outline" color="secondary" to="/layout/options">All options</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <NuAlert color="info">{{ meta.note }} This page forces the option through route meta; other pages keep your saved settings.</NuAlert>
    <NuCard v-for="n in 6" :key="n" :title="`Section ${n}`">
      Filler content so the page scrolls and you can see how the navbar, sidebar and footer behave. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
    </NuCard>
  </div>
</template>
