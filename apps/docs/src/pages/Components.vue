<script setup lang="ts">
import { computed, ref } from 'vue'
import { NuBadge, NuCard, NuEmpty, NuInput, NuPageHeader, NuSegmented } from 'nusa-admin'
import { components, groups } from '../data'

const query = ref('')
const group = ref('All')
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return components.filter((c) => (group.value === 'All' || c.group === group.value) && (!q || `${c.name} ${c.description}`.toLowerCase().includes(q)))
})
</script>

<template>
  <NuPageHeader title="Components" :subtitle="`${components.length} components, generated from the kit source.`">
    <NuInput v-model="query" size="sm" type="search" placeholder="Filter components" aria-label="Filter components" />
  </NuPageHeader>
  <div style="margin-bottom: 12px; overflow-x: auto">
    <NuSegmented v-model="group" size="sm" label="Group" :options="['All', ...groups].map((g) => ({ label: g, value: g }))" />
  </div>
  <div class="comp-grid">
    <RouterLink v-for="c in shown" :key="c.name" :to="`/components/${c.name}`" class="comp-card">
      <div class="nu-between"><strong>{{ c.name }}</strong><NuBadge color="secondary">{{ c.group }}</NuBadge></div>
      <p>{{ c.description }}</p>
      <small>{{ c.props.length }} props · {{ c.events.length }} events · {{ c.slots.length }} slots</small>
    </RouterLink>
  </div>
  <NuCard v-if="!shown.length" flush><NuEmpty title="No components match" /></NuCard>
</template>

<style>
.comp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px; }
.comp-card { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); color: var(--nu-text) !important; text-decoration: none !important; }
.comp-card:hover { border-color: var(--nu-primary); }
.comp-card p { flex: 1; color: var(--nu-text-muted); font-size: 13px; }
.comp-card small { color: var(--nu-text-muted); font-size: 12px; }
</style>
