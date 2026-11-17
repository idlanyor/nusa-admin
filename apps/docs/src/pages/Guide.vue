<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NuButton, NuCard, NuEmpty } from 'nusa-admin'
import { guides } from '../data'
import { renderMarkdown, slugify } from '../markdown'

const route = useRoute()
const index = computed(() => guides.findIndex((g) => g.slug === route.params.slug))
const guide = computed(() => guides[index.value])
const html = computed(() => (guide.value ? renderMarkdown(guide.value.body) : ''))
const toc = computed(() => (guide.value?.body.match(/^## .+$/gm) ?? []).map((h) => h.slice(3)))
const prev = computed(() => guides[index.value - 1])
const next = computed(() => guides[index.value + 1])
</script>

<template>
  <div v-if="guide" class="guide">
    <article class="prose" v-html="html" />
    <aside v-if="toc.length" class="guide__toc" aria-label="On this page">
      <strong>On this page</strong>
      <a v-for="h in toc" :key="h" :href="`#${slugify(h)}`">{{ h }}</a>
    </aside>
    <nav class="guide__pager">
      <RouterLink v-if="prev" :to="`/guide/${prev.slug}`">← {{ prev.title }}</RouterLink><span v-else />
      <RouterLink v-if="next" :to="`/guide/${next.slug}`">{{ next.title }} →</RouterLink>
    </nav>
  </div>
  <NuCard v-else flush>
    <NuEmpty title="Guide not found"><NuButton size="sm" to="/guide/getting-started">Getting started</NuButton></NuEmpty>
  </NuCard>
</template>

<style>
.guide { display: grid; grid-template-columns: minmax(0, 1fr) 200px; gap: 24px; align-items: start; }
.guide__toc { position: sticky; top: calc(var(--nu-navbar-height) + 16px); display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.guide__toc strong { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--nu-text-muted); }
.guide__toc a { color: var(--nu-text-muted); }
.guide__toc a:hover { color: var(--nu-primary); }
.guide__pager { grid-column: 1; display: flex; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--nu-border); font-weight: 600; }
@media (max-width: 1100px) { .guide { grid-template-columns: minmax(0, 1fr); } .guide__toc { display: none; } }
</style>
