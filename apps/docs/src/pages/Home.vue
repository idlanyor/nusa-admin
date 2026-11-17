<script setup lang="ts">
import { ArrowRight, Bot, Boxes, Palette, SquareTerminal } from 'lucide-vue-next'
import { NuButton, NuCard, NuLogo, NuSmallBox } from 'nusa-admin'
import CodeBlock from '../CodeBlock.vue'
import { components, demoUrl, groups, guides } from '../data'
</script>

<template>
  <section class="home-hero">
    <div class="home-hero__brand"><NuLogo :size="56" /><h1>Nusa <span>Admin</span></h1></div>
    <p>A Vue 3 + Vite admin template kit: one layout shell, {{ components.length }} components, SVG charts, light and dark themes, i18n and RTL — compact, accessible, no CSS framework.</p>
    <div class="nu-cluster">
      <NuButton size="lg" :icon="ArrowRight" to="/guide/getting-started">Get started</NuButton>
      <NuButton size="lg" variant="outline" color="secondary" :href="demoUrl">Live demo</NuButton>
    </div>
  </section>

  <CodeBlock lang="bash" code="bun create nusa-admin my-admin" caption="Create a project" />

  <div class="nu-row" style="margin-top: 16px">
    <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="Components" :value="components.length" :icon="Boxes" color="primary" to="/components" link-label="Browse" /></div>
    <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="Guides" :value="guides.length" :icon="Palette" color="info" to="/guide/layout" link-label="Read" /></div>
    <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="CLI templates" value="2" :icon="SquareTerminal" color="success" to="/guide/cli" link-label="CLI" /></div>
    <div class="nu-col-sm-6 nu-col-lg-3"><NuSmallBox label="MCP tools" value="6" :icon="Bot" color="warning" to="/guide/ai" link-label="AI setup" /></div>
  </div>

  <div class="nu-row" style="margin-top: 16px">
    <div v-for="g in groups" :key="g" class="nu-col-md-6 nu-col-lg-3">
      <NuCard :title="g" :subtitle="`${components.filter((c) => c.group === g).length} components`">
        <ul class="home-list">
          <li v-for="c in components.filter((x) => x.group === g).slice(0, 6)" :key="c.name"><RouterLink :to="`/components/${c.name}`">{{ c.name }}</RouterLink></li>
        </ul>
      </NuCard>
    </div>
  </div>
</template>

<style>
.home-hero { padding: 18px 0 16px; }
.home-hero__brand { display: flex; align-items: center; gap: 14px; }
.home-hero h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; }
.home-hero h1 span { font-weight: 500; color: var(--nu-text-muted); }
.home-hero p { max-width: 680px; margin: 6px 0 14px; color: var(--nu-text-muted); font-size: 15px; }
.home-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 13.5px; }
</style>
