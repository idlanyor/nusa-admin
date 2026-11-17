<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { NuMenuItem as MenuItem } from '../types'
import type { NuSidebarVariant } from '../composables/useLayout'
import NuIcon from './NuIcon.vue'
import NuMenuItem from './NuMenuItem.vue'

const props = withDefaults(
  defineProps<{ menu: MenuItem[]; variant?: NuSidebarVariant; searchable?: boolean; searchPlaceholder?: string }>(),
  { variant: 'dark', searchPlaceholder: 'Search menu' },
)

const query = ref('')

/** Every navigable item, with the labels of the groups above it. */
function leaves(items: MenuItem[], trail: string[] = []): { item: MenuItem; trail: string[] }[] {
  return items.flatMap((item) => {
    if (item.header) return []
    if (item.children?.length) return leaves(item.children, [...trail, item.label])
    return [{ item, trail }]
  })
}
const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return leaves(props.menu).filter(({ item, trail }) => [item.label, ...trail].join(' ').toLowerCase().includes(q))
})
</script>

<template>
  <aside class="nu-sidebar" :class="`nu-sidebar--${variant}`">
    <div v-if="$slots.brand" class="nu-sidebar__brand"><slot name="brand" /></div>
    <nav class="nu-sidebar__nav" aria-label="Main">
      <slot name="before" />
      <label v-if="searchable" class="nu-sidebar__search">
        <NuIcon name="search" :size="15" />
        <input v-model="query" type="search" :placeholder="searchPlaceholder" :aria-label="searchPlaceholder" @keydown.esc="query = ''" />
      </label>
      <ul v-if="query.trim()" class="nu-menu" aria-live="polite">
        <li v-for="(r, i) in results" :key="i" class="nu-menu__item">
          <component
            :is="r.item.to ? RouterLink : 'a'"
            v-bind="r.item.to ? { to: r.item.to } : { href: r.item.href ?? '#', target: r.item.target }"
            class="nu-menu__link nu-menu__link--result"
            @click="query = ''"
          >
            <span class="nu-menu__icon"><component :is="r.item.icon" v-if="r.item.icon" /><span v-else class="nu-menu__bullet" /></span>
            <span class="nu-menu__label">
              {{ r.item.label }}
              <small v-if="r.trail.length">{{ r.trail.join(' › ') }}</small>
            </span>
          </component>
        </li>
        <li v-if="!results.length" class="nu-menu__empty">No menu items match “{{ query.trim() }}”</li>
      </ul>
      <ul v-else class="nu-menu">
        <NuMenuItem v-for="(item, i) in menu" :key="i" :item="item" />
      </ul>
      <slot />
    </nav>
    <div v-if="$slots.footer" class="nu-sidebar__footer"><slot name="footer" /></div>
  </aside>
</template>

<style>
.nu-sidebar {
  display: flex;
  flex-direction: column;
  width: var(--nu-sidebar-width);
  height: 100%;
  overflow: hidden;
  border-right: 1px solid var(--nu-sidebar-border);
  background: var(--nu-sidebar-bg);
  color: var(--nu-sidebar-text);
}
.nu-sidebar__brand {
  flex: none;
  display: flex;
  align-items: center;
  height: var(--nu-navbar-height);
  padding: 0 14px;
  border-bottom: 1px solid var(--nu-sidebar-border);
  color: var(--nu-sidebar-text-strong);
  white-space: nowrap;
}
.nu-sidebar__nav {
  flex: 1 1 auto;
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--nu-sidebar-text) 30%, transparent) transparent;
}
.nu-sidebar__footer { flex: none; padding: 8px; border-top: 1px solid var(--nu-sidebar-border); white-space: nowrap; }

/* Brand block (used by NuLayout's default brand; reusable in custom ones) */
.nu-brand { display: flex; align-items: center; gap: 10px; min-width: 0; color: inherit; text-decoration: none !important; }
.nu-brand__logo {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--nu-radius);
  background: var(--nu-primary);
  color: var(--nu-on-color);
  font-weight: 800;
  font-size: 16px;
}
.nu-brand__logo img { width: 100%; height: 100%; object-fit: contain; border-radius: inherit; }
.nu-brand__name { font-size: 15.5px; font-weight: 700; letter-spacing: -0.01em; }

/* Menu */
.nu-menu, .nu-menu ul { margin: 0; padding: 0; list-style: none; }
.nu-menu { display: flex; flex-direction: column; gap: 1px; }
.nu-menu ul { display: flex; flex-direction: column; gap: 1px; padding-top: 1px; }
.nu-menu__header {
  display: flex;
  align-items: center;
  height: 26px;
  margin-top: 6px;
  padding: 0 12px;
  color: var(--nu-sidebar-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.nu-menu__header:first-child { margin-top: 0; }
.nu-menu__link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 34px;
  padding: 0 12px;
  padding-left: calc(12px + var(--nu-depth, 0) * 14px);
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-sidebar-text);
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  text-decoration: none !important;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--nu-transition), color var(--nu-transition);
}
.nu-menu__link:hover { background: var(--nu-sidebar-hover); color: var(--nu-sidebar-text-strong); }
.nu-menu__link.has-active-child { color: var(--nu-sidebar-text-strong); }
.nu-menu__link.is-active { background: var(--nu-sidebar-active-bg); color: var(--nu-sidebar-active-text); }
.nu-menu__icon { flex: none; display: grid; place-items: center; width: 20px; height: 20px; }
.nu-menu__icon svg { width: 18px; height: 18px; }
.nu-menu__bullet { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.6; }
.nu-menu__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.nu-menu__badge {
  flex: none;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--nu-c);
  color: var(--nu-on-color);
  font-size: 11px;
  font-weight: 700;
}
.nu-menu__link.is-active .nu-menu__badge { background: color-mix(in srgb, currentColor 22%, transparent); color: inherit; }
.nu-menu__bullet.is-colored { width: 8px; height: 8px; background: var(--nu-c); opacity: 1; }
.nu-sidebar__search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  margin: 0 0 8px;
  padding: 0 10px;
  border-radius: var(--nu-radius-sm);
  background: var(--nu-sidebar-hover);
  color: var(--nu-sidebar-muted);
}
.nu-sidebar__search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--nu-sidebar-text-strong); font-size: 13px; }
.nu-sidebar__search input::placeholder { color: var(--nu-sidebar-muted); }
.nu-sidebar__search:focus-within { box-shadow: 0 0 0 2px color-mix(in srgb, var(--nu-primary) 45%, transparent); }
.nu-menu__link--result { height: auto; min-height: 34px; padding-top: 5px; padding-bottom: 5px; }
.nu-menu__link--result small { display: block; font-size: 11.5px; color: var(--nu-sidebar-muted); }
.nu-menu__empty { padding: 8px 12px; font-size: 13px; color: var(--nu-sidebar-muted); }
.nu-menu__caret { transition: transform var(--nu-transition); opacity: 0.7; }
.nu-menu__item.is-open > .nu-menu__link .nu-menu__caret { transform: rotate(90deg); }

/* Animated open/close without measuring heights */
.nu-menu__sub { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--nu-transition); }
.nu-menu__sub > ul { min-height: 0; overflow: hidden; padding-top: 0; }
.nu-menu__item.is-open > .nu-menu__sub { grid-template-rows: 1fr; }
.nu-menu__item.is-open > .nu-menu__sub > ul { padding-top: 1px; }
</style>
