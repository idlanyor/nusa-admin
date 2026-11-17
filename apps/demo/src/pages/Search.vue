<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuCheckbox, NuEmpty, NuInput, NuPageHeader, NuSelect } from 'nusa-admin'
import { contacts, orders, projects } from '../data'
import { menu } from '../menu'
import type { NuMenuItem } from 'nusa-admin'

interface Result { type: 'Page' | 'Project' | 'Contact' | 'Order'; title: string; text: string; to: string }

const route = useRoute()
const router = useRouter()
const query = ref(String(route.query.q ?? ''))
watch(() => route.query.q, (q) => (query.value = String(q ?? '')))

const types = ref<Record<Result['type'], boolean>>({ Page: true, Project: true, Contact: true, Order: true })
const sort = ref('relevance')

const pages = (items: NuMenuItem[]): Result[] =>
  items.flatMap((m) => (m.children ? pages(m.children) : m.to && typeof m.to === 'string' ? [{ type: 'Page' as const, title: m.label, text: m.to, to: m.to }] : []))
const index: Result[] = [
  ...pages(menu),
  ...projects.map((p) => ({ type: 'Project' as const, title: p.name, text: `${p.client} — ${p.description}`, to: `/projects/${p.id}` })),
  ...contacts.map((c) => ({ type: 'Contact' as const, title: c.name, text: `${c.role} at ${c.company}, ${c.city}`, to: '/contacts' })),
  ...orders.slice(0, 20).map((o) => ({ type: 'Order' as const, title: `Order ${o.id}`, text: `${o.customer} · ${o.product} · ${o.status}`, to: '/tables/data' })),
]

const term = computed(() => String(route.query.q ?? '').trim().toLowerCase())
const results = computed(() => {
  if (!term.value) return []
  const hits = index.filter((r) => types.value[r.type] && `${r.title} ${r.text}`.toLowerCase().includes(term.value))
  return sort.value === 'az' ? [...hits].sort((a, b) => a.title.localeCompare(b.title)) : hits
})
const typeColor = { Page: 'secondary', Project: 'primary', Contact: 'info', Order: 'success' } as const

function submit() {
  router.replace({ query: { q: query.value.trim() || undefined } })
}
function highlight(text: string) {
  const escaped = text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
  if (!term.value) return escaped
  const safe = term.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[&<>"']/g, '')
  return safe ? escaped.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>') : escaped
}
</script>

<template>
  <NuPageHeader title="Search" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Search' }]" />

  <form class="search-bar" role="search" @submit.prevent="submit">
    <NuInput v-model="query" size="lg" type="search" placeholder="Search pages, projects, contacts, orders" aria-label="Search" style="flex: 1">
      <template #prefix><Search /></template>
    </NuInput>
    <NuButton type="submit" size="lg">Search</NuButton>
  </form>

  <div class="search-layout">
    <NuCard title="Filters">
      <div class="nu-stack" style="--nu-gap: 8px">
        <NuCheckbox v-for="(_, t) in types" :key="t" v-model="types[t]" :label="`${t}s`" />
        <NuSelect v-model="sort" label="Sort by" :options="[{ label: 'Relevance', value: 'relevance' }, { label: 'Title A–Z', value: 'az' }]" />
      </div>
    </NuCard>

    <NuCard flush>
      <template #header>
        <span class="nu-text-muted">{{ term ? `${results.length} results for “${route.query.q}”` : 'Type something to search' }}</span>
      </template>
      <ul v-if="results.length" class="search-results">
        <li v-for="(r, i) in results" :key="i">
          <RouterLink :to="r.to" class="search-results__title" v-html="highlight(r.title)" />
          <NuBadge :color="typeColor[r.type]">{{ r.type }}</NuBadge>
          <p class="nu-text-sm nu-text-muted" v-html="highlight(r.text)" />
        </li>
      </ul>
      <NuEmpty v-else-if="term" title="No results" description="Try a different word or turn on more filters." />
    </NuCard>
  </div>
</template>

<style>
.search-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.search-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 16px; align-items: start; }
@media (max-width: 800px) { .search-layout { grid-template-columns: 1fr; } }
.search-results { margin: 0; padding: 0; list-style: none; }
.search-results li { padding: 10px 14px; }
.search-results li + li { border-top: 1px solid var(--nu-border); }
.search-results__title { margin-right: 8px; font-weight: 600; }
.search-results mark { padding: 0 1px; border-radius: 2px; background: color-mix(in srgb, var(--nu-warning) 30%, transparent); color: inherit; }
</style>
