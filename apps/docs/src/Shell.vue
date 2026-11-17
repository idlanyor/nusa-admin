<script setup lang="ts">
import { computed, ref } from 'vue'
import { BookOpen, Bot, Boxes, Braces, Search, Sparkles, SquareTerminal } from 'lucide-vue-next'
import { NuCommandPalette, NuLayout, type NuCommand, type NuMenuItem } from 'nusa-admin'
import { components, demoUrl, groups, guides, version } from './data'

const guideIcons: Record<string, unknown> = { 'getting-started': Sparkles, cli: SquareTerminal, ai: Bot }
const menu = computed<NuMenuItem[]>(() => [
  { label: 'Guide', header: true },
  ...guides.map((g) => ({ label: g.title, to: `/guide/${g.slug}`, icon: (guideIcons[g.slug] ?? BookOpen) as NuMenuItem['icon'] })),
  { label: 'API', icon: Braces, to: '/api' },
  { label: 'Components', header: true },
  { label: 'All components', icon: Boxes, to: '/components', badge: components.length },
  ...groups.map((g) => ({ label: g, children: components.filter((c) => c.group === g).map((c) => ({ label: c.name, to: `/components/${c.name}` })) })),
])

const palette = ref(false)
const commands: NuCommand[] = [
  { label: 'Open the live demo', group: 'Links', icon: Sparkles, href: demoUrl },
  { label: 'llms.txt', group: 'Links', icon: Bot, href: '/llms.txt' },
]
</script>

<template>
  <NuLayout :menu="menu" brand="Nusa Admin" brand-to="/" sidebar-search>
    <template #navbar-start>
      <button class="docs-search" type="button" aria-label="Search the docs (Ctrl+K)" @click="palette = true">
        <Search /><span class="nu-grow">Search docs…</span><kbd>Ctrl K</kbd>
      </button>
      <span class="docs-version">v{{ version }}</span>
    </template>
    <template #navbar-end>
      <a class="docs-demo" :href="demoUrl" target="_blank" rel="noopener">Live demo</a>
    </template>
    <RouterView :key="$route.path" />
    <template #footer>
      <span>Nusa Admin docs · generated from the kit source</span>
      <span><a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a></span>
    </template>
  </NuLayout>
  <NuCommandPalette v-model="palette" :menu="menu" :commands="commands" placeholder="Search components and guides…" />
</template>
