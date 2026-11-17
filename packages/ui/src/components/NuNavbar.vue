<script setup lang="ts">
import { t } from '../composables/useLocale'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayout } from '../composables/useLayout'
import { useTheme } from '../composables/useTheme'
import NuIcon from './NuIcon.vue'
import NuIconButton from './NuIconButton.vue'

withDefaults(defineProps<{ themeToggle?: boolean; fullscreenToggle?: boolean }>(), { themeToggle: true })

const { toggleSidebar } = useLayout()
const { theme, toggleDark } = useTheme()

const fullscreen = ref(false)
const syncFullscreen = () => (fullscreen.value = !!document.fullscreenElement)
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch {
    /* refused by the browser (e.g. inside an iframe) */
  }
}
onMounted(() => document.addEventListener('fullscreenchange', syncFullscreen))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', syncFullscreen))
</script>

<template>
  <header class="nu-navbar">
    <div class="nu-navbar__inner">
      <NuIconButton class="nu-navbar__toggle" :label="t('toggleSidebar')" @click="toggleSidebar"><NuIcon name="menu" :size="20" /></NuIconButton>
      <div v-if="$slots.brand" class="nu-navbar__brand"><slot name="brand" /></div>
      <div class="nu-navbar__start"><slot name="start" /></div>
      <div class="nu-navbar__end">
        <slot name="end" />
        <NuIconButton v-if="fullscreenToggle" :label="fullscreen ? t('exitFullscreen') : t('fullscreen')" @click="toggleFullscreen">
          <NuIcon :name="fullscreen ? 'minimize' : 'maximize'" :size="18" />
        </NuIconButton>
        <NuIconButton
          v-if="themeToggle"
          :label="theme.resolved === 'dark' ? t('lightMode') : t('darkMode')"
          @click="toggleDark"
        >
          <NuIcon :name="theme.resolved === 'dark' ? 'sun' : 'moon'" :size="19" />
        </NuIconButton>
        <slot name="user" />
      </div>
    </div>
  </header>
</template>

<style>
.nu-navbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: var(--nu-navbar-height);
  border-bottom: 1px solid var(--nu-border);
  background: color-mix(in srgb, var(--nu-surface) 88%, transparent);
  backdrop-filter: saturate(1.4) blur(10px);
}
.nu-navbar__inner { display: flex; align-items: center; gap: 6px; height: 100%; padding: 0 12px; }
.nu-navbar__brand { flex: none; display: flex; align-items: center; margin-inline-end: 8px; }
.nu-navbar__start { flex: 1 1 auto; display: flex; align-items: center; gap: 8px; min-width: 0; }
.nu-navbar__end { flex: none; display: flex; align-items: center; gap: 2px; }
</style>
