<script setup lang="ts">
import { computed } from 'vue'
import { useLayout, type NuLayoutOption } from '../composables/useLayout'
import { t } from '../composables/useLocale'
import type { NuMessageKey } from '../locales'
import { useTheme, type NuThemeMode } from '../composables/useTheme'
import NuDrawer from './NuDrawer.vue'
import NuSegmented from './NuSegmented.vue'
import NuSwitch from './NuSwitch.vue'

/** Floating settings button + drawer for theme, brand color and sidebar options. */
withDefaults(
  defineProps<{
    /** Brand color choices; `null` value = token default. */
    colors?: { name: string; value: string | null }[]
    /** Hide the floating button and drive `v-model` yourself. */
    hideTrigger?: boolean
  }>(),
  {
    colors: () => [
      { name: 'Indigo', value: null },
      { name: 'Blue', value: '#2563eb' },
      { name: 'Teal', value: '#0d9488' },
      { name: 'Emerald', value: '#059669' },
      { name: 'Rose', value: '#e11d48' },
      { name: 'Orange', value: '#ea580c' },
      { name: 'Violet', value: '#7c3aed' },
    ],
  },
)

const open = defineModel<boolean>({ default: false })
const { theme, setMode, setPrimary } = useTheme()
const { layout, setSidebarVariant, setOption } = useLayout()
const options: { key: NuLayoutOption; label: NuMessageKey }[] = [
  { key: 'topNav', label: 'optTopNav' },
  { key: 'collapsed', label: 'optCollapsed' },
  { key: 'boxed', label: 'optBoxed' },
  { key: 'fixedNavbar', label: 'optFixedNavbar' },
  { key: 'fixedSidebar', label: 'optFixedSidebar' },
  { key: 'fixedFooter', label: 'optFixedFooter' },
  { key: 'rtl', label: 'optRtl' },
]

const modes = computed(() => [
  { label: t('light'), value: 'light' },
  { label: t('dark'), value: 'dark' },
  { label: t('system'), value: 'auto' },
])
const variants = computed(() => [
  { label: t('dark'), value: 'dark' },
  { label: t('light'), value: 'light' },
])
</script>

<template>
  <button v-if="!hideTrigger" class="nu-customizer__fab" type="button" :aria-label="t('customizeTheme')" :title="t('customizeTheme')" @click="open = true">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>

  <NuDrawer v-model="open" :title="t('customize')" width="300px">
    <div class="nu-customizer">
      <section>
        <h4>{{ t('theme') }}</h4>
        <NuSegmented :model-value="theme.mode" :options="modes" block :label="t('theme')" @update:model-value="setMode($event as NuThemeMode)" />
      </section>
      <section>
        <h4>{{ t('brandColor') }}</h4>
        <div class="nu-customizer__swatches">
          <button
            v-for="c in colors"
            :key="c.name"
            type="button"
            class="nu-customizer__swatch"
            :class="{ 'is-active': theme.primary === c.value }"
            :style="{ background: c.value ?? '#4f46e5' }"
            :title="c.name"
            :aria-label="c.name"
            :aria-pressed="theme.primary === c.value"
            @click="setPrimary(c.value)"
          />
        </div>
      </section>
      <section>
        <h4>{{ t('sidebar') }}</h4>
        <NuSegmented :model-value="layout.sidebarVariant" :options="variants" block :label="t('sidebarStyle')" @update:model-value="setSidebarVariant($event as 'dark' | 'light')" />
      </section>
      <section>
        <h4>{{ t('layout') }}</h4>
        <NuSwitch v-for="o in options" :key="o.key" :model-value="layout[o.key]" :label="t(o.label)" @update:model-value="setOption(o.key, $event)" />
      </section>
      <slot />
    </div>
  </NuDrawer>
</template>

<style>
.nu-customizer__fab {
  position: fixed;
  inset-inline-end: 14px;
  bottom: 52px;
  z-index: 40;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--nu-border);
  border-radius: 50%;
  background: var(--nu-surface);
  color: var(--nu-text);
  box-shadow: var(--nu-shadow);
  cursor: pointer;
}
.nu-customizer__fab:hover { color: var(--nu-primary); }
.nu-customizer { display: flex; flex-direction: column; gap: 16px; }
.nu-customizer section { display: flex; flex-direction: column; gap: 8px; }
.nu-customizer h4 { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--nu-text-muted); }
.nu-customizer__swatches { display: flex; flex-wrap: wrap; gap: 8px; }
.nu-customizer__swatch { width: 26px; height: 26px; border: 2px solid var(--nu-surface); border-radius: 50%; box-shadow: 0 0 0 1px var(--nu-border); cursor: pointer; }
.nu-customizer__swatch.is-active { box-shadow: 0 0 0 2px var(--nu-text); }
</style>
