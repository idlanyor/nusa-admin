<script setup lang="ts">
import { computed, onBeforeUnmount, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router'
import { useLayout, type NuSidebarVariant } from '../composables/useLayout'
import type { NuMenuItem } from '../types'
import NuCustomizer from './NuCustomizer.vue'
import NuLogo from './NuLogo.vue'
import NuNavbar from './NuNavbar.vue'
import NuSidebar from './NuSidebar.vue'
import NuToastHost from './NuToastHost.vue'
import NuConfirmHost from './NuConfirmHost.vue'
import NuBottomNav from './NuBottomNav.vue'
import NuTopNav from './NuTopNav.vue'

/**
 * Layout options left `undefined` follow useLayout() (saved, toggled by NuCustomizer);
 * set them to force a value for this layout instance.
 */
const props = withDefaults(
  defineProps<{
    menu: NuMenuItem[]
    /** Product name shown next to the logo. */
    brand?: string
    /** Logo image URL. Without one: the Nusa Admin mark for the default brand, otherwise the first letter of `brand`. */
    logo?: string
    brandTo?: RouteLocationRaw
    sidebarVariant?: NuSidebarVariant
    /** `top-nav` puts the menu in the navbar on desktop (the sidebar remains the mobile drawer). */
    layout?: 'sidebar' | 'top-nav'
    boxed?: boolean
    fixedNavbar?: boolean
    fixedSidebar?: boolean
    fixedFooter?: boolean
    /** Right-to-left layout (sets `dir` on <html> while this layout is mounted). */
    rtl?: boolean
    /** Filter box at the top of the sidebar menu. */
    sidebarSearch?: boolean
    themeToggle?: boolean
    fullscreenToggle?: boolean
    /** Show the floating theme customizer button. */
    customizer?: boolean
    /** Mobile bottom navigation built from `menu`; pass `true` or the paths to show as tabs. */
    bottomNav?: boolean | string[]
  }>(),
  {
    brand: 'Nusa Admin',
    brandTo: '/',
    themeToggle: true,
    layout: undefined,
    boxed: undefined,
    fixedNavbar: undefined,
    fixedSidebar: undefined,
    fixedFooter: undefined,
    rtl: undefined,
  },
)

const { layout: state, closeMobile, applyDirection } = useLayout()
const route = useRoute()

const variant = computed(() => props.sidebarVariant ?? state.sidebarVariant)
const topNav = computed(() => (props.layout ? props.layout === 'top-nav' : state.topNav))
const boxed = computed(() => props.boxed ?? state.boxed)
const fixedNavbar = computed(() => props.fixedNavbar ?? state.fixedNavbar)
const fixedSidebar = computed(() => (props.fixedSidebar ?? state.fixedSidebar) && !boxed.value)
const fixedFooter = computed(() => props.fixedFooter ?? state.fixedFooter)

const rtl = computed(() => props.rtl ?? state.rtl)
watchEffect(() => applyDirection(rtl.value))
// Hand <html dir> back to the saved preference when a page that forced it goes away.
onBeforeUnmount(() => applyDirection(state.rtl))

watch(() => route.fullPath, closeMobile)
</script>

<template>
  <div
    class="nu-layout"
    :class="{
      'is-collapsed': state.collapsed && !topNav,
      'is-mobile-open': state.mobileOpen,
      'is-top-nav': topNav,
      'is-boxed': boxed,
      'is-static-navbar': !fixedNavbar,
      'is-static-sidebar': !fixedSidebar,
      'is-fixed-footer': fixedFooter,
      'has-bottom-nav': !!bottomNav,
    }"
  >
    <NuSidebar class="nu-layout__sidebar" :menu="menu" :variant="variant" :searchable="sidebarSearch">
      <template #brand>
        <slot name="brand">
          <RouterLink class="nu-brand" :to="brandTo">
            <NuLogo v-if="!logo && brand === 'Nusa Admin'" class="nu-brand__mark" :size="32" />
            <span v-else class="nu-brand__logo">
              <img v-if="logo" :src="logo" alt="" />
              <template v-else>{{ brand.charAt(0) }}</template>
            </span>
            <span class="nu-brand__name">{{ brand }}</span>
          </RouterLink>
        </slot>
      </template>
      <template v-if="$slots['sidebar-top']" #before><slot name="sidebar-top" /></template>
      <template v-if="$slots['sidebar-footer']" #footer><slot name="sidebar-footer" /></template>
    </NuSidebar>

    <div class="nu-layout__backdrop" @click="closeMobile" />

    <div class="nu-layout__main">
      <NuNavbar :theme-toggle="themeToggle" :fullscreen-toggle="fullscreenToggle">
        <template v-if="topNav" #brand>
          <slot name="brand">
            <RouterLink class="nu-brand nu-brand--navbar" :to="brandTo">
              <NuLogo v-if="!logo && brand === 'Nusa Admin'" class="nu-brand__mark" :size="28" />
              <span v-else class="nu-brand__logo">
                <img v-if="logo" :src="logo" alt="" />
                <template v-else>{{ brand.charAt(0) }}</template>
              </span>
              <span class="nu-brand__name">{{ brand }}</span>
            </RouterLink>
          </slot>
        </template>
        <template #start>
          <NuTopNav v-if="topNav" class="nu-layout__topnav" :menu="menu" />
          <slot name="navbar-start" />
        </template>
        <template #end><slot name="navbar-end" /></template>
        <template #user><slot name="navbar-user" /></template>
      </NuNavbar>
      <main class="nu-layout__content"><slot /></main>
      <footer v-if="$slots.footer" class="nu-layout__footer"><slot name="footer" /></footer>
    </div>

    <NuBottomNav v-if="bottomNav" :menu="menu" :primary="Array.isArray(bottomNav) ? bottomNav : undefined" />
    <NuCustomizer v-if="customizer" />
    <NuToastHost />
    <NuConfirmHost />
  </div>
</template>

<style>
.nu-layout { position: relative; min-height: 100vh; }
.nu-layout__sidebar {
  position: fixed;
  inset-block: 0; inset-inline: 0 auto;
  z-index: 50;
  transition: width var(--nu-transition), transform var(--nu-transition), box-shadow var(--nu-transition);
}
.nu-layout__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
  margin-inline-start: var(--nu-sidebar-width);
  transition: margin-inline-start var(--nu-transition);
}
.nu-layout__content { flex: 1 1 auto; min-width: 0; padding: var(--nu-content-padding); }
.nu-layout__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding: 10px var(--nu-content-padding);
  border-top: 1px solid var(--nu-border);
  background: var(--nu-surface);
  color: var(--nu-text-muted);
  font-size: 13px;
}
.nu-layout__backdrop { display: none; }
.nu-brand--navbar { color: var(--nu-text); }
.nu-brand--navbar .nu-brand__logo { width: 28px; height: 28px; font-size: 14px; }

/* Layout options */
.nu-layout.is-static-navbar .nu-navbar { position: relative; }
.nu-layout.is-fixed-footer .nu-layout__footer { position: sticky; bottom: 0; z-index: 20; }
.nu-layout.is-static-sidebar .nu-layout__sidebar { position: absolute; height: auto; min-height: 100%; }
.nu-layout.is-static-sidebar .nu-sidebar__nav { overflow: visible; }
.nu-layout.is-boxed {
  max-width: 1280px;
  margin: 0 auto;
  border-inline: 1px solid var(--nu-border);
  background: var(--nu-bg);
  box-shadow: var(--nu-shadow-lg);
}
body:has(.nu-layout.is-boxed) { background: color-mix(in srgb, var(--nu-bg) 82%, var(--nu-text)); }

/* Desktop */
@media (min-width: 992px) {
  .nu-layout.is-collapsed .nu-layout__main { margin-inline-start: var(--nu-sidebar-mini-width); }
  .nu-layout.is-collapsed .nu-layout__sidebar { width: var(--nu-sidebar-mini-width); }
  .nu-layout.is-collapsed .nu-layout__sidebar:is(:hover, :focus-within) {
    width: var(--nu-sidebar-width);
    box-shadow: var(--nu-shadow-lg);
  }
  .nu-layout.is-collapsed .nu-layout__sidebar:not(:hover, :focus-within) :is(.nu-menu__sub, .nu-sidebar__footer, .nu-sidebar__search) { display: none; }
  .nu-layout.is-collapsed .nu-layout__sidebar:not(:hover, :focus-within) .nu-menu__header span { display: none; }
  .nu-layout.is-collapsed .nu-layout__sidebar:not(:hover, :focus-within) .nu-menu__header {
    height: 1px;
    margin: 6px 8px;
    padding: 0;
    background: var(--nu-sidebar-border);
  }
  .nu-layout.is-collapsed .nu-layout__sidebar:not(:hover, :focus-within) :is(.nu-menu__label, .nu-menu__badge, .nu-menu__caret, .nu-brand__name) {
    opacity: 0;
  }

  /* Top navigation: no sidebar, menu in the navbar, centered content */
  .nu-layout.is-top-nav .nu-layout__sidebar { display: none; }
  .nu-layout.is-top-nav .nu-layout__main { margin-inline-start: 0; }
  .nu-layout.is-top-nav .nu-navbar__toggle { display: none; }
  .nu-layout.is-top-nav :is(.nu-navbar__inner, .nu-layout__content) { width: 100%; max-width: 1320px; margin-inline: auto; }
}

/* Mobile: off-canvas drawer; the top nav collapses into it */
@media (max-width: 991.98px) {
  .nu-layout__main { margin-inline-start: 0; }
  .nu-layout__sidebar { position: fixed !important; height: 100% !important; transform: translateX(-100%); }
  .nu-layout__sidebar .nu-sidebar__nav { overflow-y: auto !important; }
  .nu-layout.is-mobile-open .nu-layout__sidebar { transform: none; box-shadow: var(--nu-shadow-lg); }
  .nu-layout.is-mobile-open .nu-layout__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 45;
    background: var(--nu-backdrop);
  }
  .nu-layout__content { padding: 12px; }
  .nu-layout__topnav { display: none; }
  .nu-layout.has-bottom-nav .nu-layout__main { padding-bottom: calc(56px + env(safe-area-inset-bottom)); }
  .nu-layout.has-bottom-nav .nu-customizer__fab { bottom: calc(68px + env(safe-area-inset-bottom)); }
}
</style>
