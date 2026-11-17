<script setup lang="ts">
import { NuButton, NuCard, NuPageHeader, NuSwitch, useLayout, useTheme, type NuThemeMode } from 'nusa-admin'

const { theme, setMode, setPrimary } = useTheme()
const { layout, setSidebarVariant, setCollapsed } = useLayout()

const modes: { value: NuThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'System' },
]
const brandColors = [
  { name: 'Indigo (default)', value: null },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Violet', value: '#7c3aed' },
]
</script>

<template>
  <NuPageHeader
    title="Settings"
    subtitle="Everything here is driven by useTheme() and useLayout(), and saved in localStorage."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Settings' }]"
  />

  <div class="nu-row">
    <div class="nu-col-lg-6">
      <NuCard title="Appearance">
        <div class="nu-stack">
          <div>
            <div class="setting-label">Theme</div>
            <div class="nu-cluster">
              <NuButton
                v-for="m in modes"
                :key="m.value"
                :variant="theme.mode === m.value ? 'solid' : 'outline'"
                :color="theme.mode === m.value ? 'primary' : 'secondary'"
                :aria-pressed="theme.mode === m.value"
                @click="setMode(m.value)"
              >
                {{ m.label }}
              </NuButton>
            </div>
          </div>
          <div>
            <div class="setting-label">Brand color</div>
            <div class="nu-cluster">
              <button
                v-for="c in brandColors"
                :key="c.name"
                class="swatch"
                :class="{ 'is-active': theme.primary === c.value }"
                :style="{ background: c.value ?? '#4f46e5' }"
                type="button"
                :title="c.name"
                :aria-label="c.name"
                :aria-pressed="theme.primary === c.value"
                @click="setPrimary(c.value)"
              />
            </div>
            <p class="nu-text-sm nu-text-muted" style="margin-top: 8px">
              Sets <code>--nu-primary</code>; hover and soft tints are derived with <code>color-mix()</code>.
            </p>
          </div>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6">
      <NuCard title="Layout">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuSwitch
            :model-value="layout.sidebarVariant === 'light'"
            label="Light sidebar"
            @update:model-value="setSidebarVariant($event ? 'light' : 'dark')"
          />
          <NuSwitch
            :model-value="layout.collapsed"
            label="Collapse sidebar to an icon rail (desktop)"
            @update:model-value="setCollapsed($event)"
          />
        </div>
      </NuCard>
    </div>
  </div>
</template>

<style>
.setting-label { margin-bottom: 6px; font-size: 13px; font-weight: 600; }
.swatch {
  width: 26px;
  height: 26px;
  border: 2px solid var(--nu-surface);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--nu-border);
  cursor: pointer;
}
.swatch.is-active { box-shadow: 0 0 0 2px var(--nu-text); }
</style>
