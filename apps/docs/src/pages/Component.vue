<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ExternalLink } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuEmpty, NuPageHeader } from 'nusa-admin'
import CodeBlock from '../CodeBlock.vue'
import { components, demoUrl } from '../data'

const route = useRoute()
const doc = computed(() => components.find((c) => c.name === route.params.name))
const importLine = computed(() => `import { ${doc.value?.name} } from 'nusa-admin'`)
const plainDescription = computed(() => doc.value?.description.replace(/`([^`]+)`/g, '$1') ?? '')
const siblings = computed(() => components.filter((c) => c.group === doc.value?.group && c.name !== doc.value?.name))
</script>

<template>
  <template v-if="doc">
    <NuPageHeader :title="doc.name" :subtitle="plainDescription" :breadcrumb="[{ label: 'Components', to: '/components' }, { label: doc.group }, { label: doc.name }]">
      <NuBadge color="secondary">{{ doc.group }}</NuBadge>
      <NuButton v-if="doc.examples[0]?.route" variant="outline" color="secondary" size="sm" :icon="ExternalLink" :href="demoUrl + doc.examples[0].route">See it in the demo</NuButton>
    </NuPageHeader>

    <div class="nu-stack">
      <CodeBlock :code="importLine" lang="ts" caption="Import" />

      <NuCard v-if="doc.examples.length" title="Examples" subtitle="Real snippets from the demo app">
        <CodeBlock v-for="(ex, i) in doc.examples" :key="i" :code="ex.code">
          <template #caption>
            <template v-if="ex.route"><a :href="demoUrl + ex.route" target="_blank" rel="noopener">{{ ex.route }}</a> · {{ ex.file }}</template>
            <template v-else>Example</template>
          </template>
        </CodeBlock>
      </NuCard>

      <NuCard v-if="doc.props.length" title="Props" flush>
        <div style="overflow-x: auto">
          <table class="api-table">
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr v-for="p in doc.props" :key="p.name">
                <td><code>{{ p.name }}</code><NuBadge v-if="p.required" color="danger" style="margin-inline-start: 6px">required</NuBadge></td>
                <td><code class="api-type">{{ p.type }}</code></td>
                <td><code v-if="p.default">{{ p.default }}</code></td>
                <td class="nu-text-muted">{{ p.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </NuCard>

      <div class="nu-row">
        <div v-if="doc.events.length" class="nu-col-md-6">
          <NuCard title="Events" flush>
            <table class="api-table">
              <tbody><tr v-for="e in doc.events" :key="e.name"><td><code>{{ e.name }}</code></td><td><code class="api-type">{{ e.type }}</code></td></tr></tbody>
            </table>
          </NuCard>
        </div>
        <div v-if="doc.slots.length" class="nu-col-md-6">
          <NuCard title="Slots" flush>
            <table class="api-table">
              <tbody><tr v-for="s in doc.slots" :key="s.name"><td><code>{{ s.name }}</code></td><td><code class="api-type">{{ s.type }}</code></td></tr></tbody>
            </table>
          </NuCard>
        </div>
      </div>

      <NuCard v-if="siblings.length" :title="`More in ${doc.group}`">
        <div class="nu-cluster"><RouterLink v-for="c in siblings" :key="c.name" :to="`/components/${c.name}`">{{ c.name }}</RouterLink></div>
      </NuCard>
      <p class="nu-text-sm nu-text-muted">Source: <code>{{ doc.file }}</code></p>
    </div>
  </template>
  <NuCard v-else flush>
    <NuEmpty :title="`No component “${route.params.name}”`"><NuButton size="sm" to="/components">All components</NuButton></NuEmpty>
  </NuCard>
</template>

<style>
.api-type { white-space: pre-wrap; word-break: break-word; }
.api-table code { font-size: 12.5px; }
</style>
