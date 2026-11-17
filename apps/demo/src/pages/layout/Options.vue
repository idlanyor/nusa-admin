<script setup lang="ts">
import { NuAlert, NuCard, NuPageHeader, NuSegmented, NuSwitch, useLayout, type NuLayoutOption } from 'nusa-admin'

const { layout, setOption, setSidebarVariant } = useLayout()
const options: { key: NuLayoutOption; label: string; help: string }[] = [
  { key: 'topNav', label: 'Top navigation', help: 'Menu in the navbar on desktop; drawer on mobile.' },
  { key: 'collapsed', label: 'Collapsed sidebar', help: 'Icon rail that expands on hover.' },
  { key: 'boxed', label: 'Boxed', help: 'Centered page with a max width.' },
  { key: 'fixedNavbar', label: 'Fixed navbar', help: 'Navbar stays at the top while scrolling.' },
  { key: 'fixedSidebar', label: 'Fixed sidebar', help: 'Sidebar stays in place while scrolling.' },
  { key: 'fixedFooter', label: 'Fixed footer', help: 'Footer stays at the bottom of the window.' },
  { key: 'rtl', label: 'Right-to-left', help: 'Mirror the whole interface for RTL languages.' },
]
</script>

<template>
  <NuPageHeader title="Layout options" subtitle="Saved per browser. The same switches live in the control panel (navbar, right)." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Layout options' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-7">
      <NuCard title="Options" flush>
        <ul class="layout-opts">
          <li v-for="o in options" :key="o.key">
            <div class="nu-grow">
              <div class="nu-fw-600">{{ o.label }}</div>
              <div class="nu-text-sm nu-text-muted">{{ o.help }}</div>
            </div>
            <NuSwitch :model-value="layout[o.key]" :aria-label="o.label" @update:model-value="setOption(o.key, $event)" />
          </li>
          <li>
            <div class="nu-grow">
              <div class="nu-fw-600">Sidebar style</div>
              <div class="nu-text-sm nu-text-muted">Dark or light sidebar.</div>
            </div>
            <NuSegmented :model-value="layout.sidebarVariant" size="sm" label="Sidebar style" :options="[{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }]" @update:model-value="setSidebarVariant($event as 'dark' | 'light')" />
          </li>
        </ul>
      </NuCard>
    </div>
    <div class="nu-col-lg-5 nu-stack">
      <NuAlert color="info" title="Per page or per app">
        These switches change the saved default. A page can force its own layout by passing props to <code>NuLayout</code> — the example pages in the menu do that through route meta.
      </NuAlert>
      <NuCard title="In code">
        <pre class="code">&lt;NuLayout :menu="menu" layout="top-nav" boxed fixed-footer /&gt;

app.use(createNusaAdmin({
  layout: { boxed: true, fixedFooter: true },
}))</pre>
      </NuCard>
    </div>
  </div>
</template>

<style>
.layout-opts { margin: 0; padding: 0; list-style: none; }
.layout-opts li { display: flex; align-items: center; gap: 12px; padding: 10px 14px; }
.layout-opts li + li { border-top: 1px solid var(--nu-border); }
</style>
