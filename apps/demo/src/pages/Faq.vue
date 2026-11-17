<script setup lang="ts">
import { computed, ref } from 'vue'
import { LifeBuoy, Search } from 'lucide-vue-next'
import { NuAccordion, NuButton, NuCard, NuEmpty, NuInput, NuPageHeader } from 'nusa-admin'

const query = ref('')
const groups = [
  {
    title: 'Getting started',
    items: [
      { key: 'install', title: 'How do I install the kit?', content: 'Run bun add nusa-admin, import the stylesheet once, and register the plugin with app.use(createNusaAdmin()).' },
      { key: 'router', title: 'Do I need vue-router?', content: 'Yes. The sidebar, buttons and breadcrumbs render RouterLink, so vue-router is a peer dependency.' },
      { key: 'icons', title: 'Which icon set does it use?', content: 'Any. Icon props accept a Vue component, so lucide, heroicons or your own SVG components all work.' },
    ],
  },
  {
    title: 'Theming',
    items: [
      { key: 'brand', title: 'How do I change the brand color?', content: 'Set --nu-primary in CSS, or call useTheme().setPrimary() at runtime. Hover and soft tints follow automatically.' },
      { key: 'dark', title: 'How does dark mode work?', content: 'The root element gets data-theme="dark". Tokens are redefined under that selector; components never hard-code colors.' },
      { key: 'density', title: 'Can I make it more or less compact?', content: 'Radius, sidebar width, navbar height and content padding are tokens. Component paddings live in each component style block.' },
    ],
  },
]
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => !q || `${i.title} ${i.content}`.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length)
})
</script>

<template>
  <NuPageHeader title="FAQ" subtitle="Answers to common questions." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'FAQ' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-8 nu-stack">
      <NuInput v-model="query" type="search" placeholder="Search questions" aria-label="Search questions">
        <template #prefix><Search /></template>
      </NuInput>
      <section v-for="g in filtered" :key="g.title" class="nu-stack" style="--nu-gap: 6px">
        <h2 style="font-size: 14.5px">{{ g.title }}</h2>
        <NuAccordion :items="g.items" multiple />
      </section>
      <NuCard v-if="!filtered.length" flush><NuEmpty title="No matching questions" description="Try a different search term." /></NuCard>
    </div>
    <div class="nu-col-lg-4">
      <NuCard title="Still need help?">
        <p class="nu-text-muted" style="margin-bottom: 10px">Our team usually replies within one business day.</p>
        <NuButton :icon="LifeBuoy" to="/apps/mailbox">Contact support</NuButton>
      </NuCard>
    </div>
  </div>
</template>
