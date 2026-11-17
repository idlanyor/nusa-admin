<script setup lang="ts">
import { computed, ref } from 'vue'
import { icons } from 'lucide-vue-next'
import { NuBadge, NuCard, NuInput, NuPageHeader, useToast } from 'nusa-admin'

const toast = useToast()
const all = Object.entries(icons).map(([name, component]) => ({ name, component }))
const query = ref('')
const LIMIT = 300
const matches = computed(() => {
  const q = query.value.trim().toLowerCase().replace(/[\s-]/g, '')
  return q ? all.filter((i) => i.name.toLowerCase().includes(q)) : all
})

async function copy(name: string) {
  const snippet = `import { ${name} } from 'lucide-vue-next'`
  try {
    await navigator.clipboard.writeText(snippet)
    toast.success({ title: 'Copied', message: snippet })
  } catch {
    toast.info(snippet)
  }
}
</script>

<template>
  <NuPageHeader title="Icons" subtitle="Any Vue icon component works; the demo uses Lucide." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Icons' }]">
    <NuBadge color="secondary">{{ all.length.toLocaleString() }} icons</NuBadge>
  </NuPageHeader>

  <NuCard>
    <template #header>
      <NuInput v-model="query" type="search" size="sm" placeholder="Search icons, e.g. user, chart, arrow" aria-label="Search icons" style="flex: 1; max-width: 360px" />
    </template>
    <p class="nu-text-sm nu-text-muted" style="margin-bottom: 10px">
      {{ matches.length.toLocaleString() }} matching<template v-if="matches.length > LIMIT">, showing the first {{ LIMIT }}</template>. Click an icon to copy its import.
    </p>
    <div class="icon-grid">
      <button v-for="i in matches.slice(0, LIMIT)" :key="i.name" type="button" class="icon-grid__item" :title="i.name" @click="copy(i.name)">
        <component :is="i.component" />
        <span>{{ i.name }}</span>
      </button>
    </div>
  </NuCard>
</template>

<style>
.icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 6px; }
.icon-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px 8px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  cursor: pointer;
}
.icon-grid__item:hover { border-color: var(--nu-primary); color: var(--nu-primary); }
.icon-grid__item svg { width: 22px; height: 22px; }
.icon-grid__item span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; color: var(--nu-text-muted); }
</style>
