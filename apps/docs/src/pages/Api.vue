<script setup lang="ts">
import { NuCard, NuPageHeader } from 'nusa-admin'
import CodeBlock from '../CodeBlock.vue'
import { composables, tokens, types } from '../data'
</script>

<template>
  <NuPageHeader title="API" subtitle="Composables, helpers, shared types and design tokens." />
  <div class="nu-stack">
    <NuCard v-for="c in composables" :key="c.name" :title="c.name" :subtitle="c.description">
      <CodeBlock :code="c.signature" lang="ts" caption="Signature" />
    </NuCard>
    <NuCard title="Shared types" flush>
      <table class="api-table">
        <tbody><tr v-for="(v, k) in types" :key="k"><td><code>{{ k }}</code></td><td><code class="api-type">{{ v }}</code></td></tr></tbody>
      </table>
    </NuCard>
    <NuCard title="Design tokens" subtitle="Light values; dark values live under :root[data-theme='dark']" flush>
      <table class="api-table">
        <tbody>
          <tr v-for="t in tokens" :key="t.name">
            <td><code>{{ t.name }}</code></td>
            <td><span v-if="t.value.startsWith('#') || t.value.startsWith('rgb')" class="swatch-dot" :style="{ background: t.value }" /><code class="api-type">{{ t.value }}</code></td>
          </tr>
        </tbody>
      </table>
    </NuCard>
  </div>
</template>

<style>
.swatch-dot { display: inline-block; width: 12px; height: 12px; margin-inline-end: 6px; border-radius: 3px; border: 1px solid var(--nu-border); vertical-align: -1px; }
</style>
