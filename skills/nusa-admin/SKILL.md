---
name: nusa-admin
description: Build and edit admin/dashboard UIs with the Nusa Admin Vue 3 kit (`nusa-admin`, Nu* components such as NuLayout, NuCard, NuTable, NuInput, NuChart). Use this skill whenever the project depends on nusa-admin or the user asks for an admin page, dashboard, CRUD list, form, settings screen, sidebar/menu change, layout option, theme or dark-mode tweak in a Vue app that uses it — even if they don't name the kit, and even for small changes like "add a column" or "add a menu item".
---

# Nusa Admin

Nusa Admin is a Vue 3 + Vite admin template kit: an app shell (`NuLayout`), 70 `Nu*` components, SVG charts, light/dark themes and CSS design tokens. No CSS framework and no jQuery — styling comes from the kit's tokens and a few utility classes.

Building with the kit's own pieces keeps pages consistent with the rest of the app (density, dark mode, RTL, accessibility, translations), so reach for a `Nu*` component before writing custom markup or CSS.

## Find the right API first

- **MCP available?** If the `nusa-admin` MCP server is connected, use it: `list_components`, `get_component("NuTable")` (props, events, slots, real examples), `search("date range")`, `get_guide("forms")`, `scaffold_page({ kind, entity, fields })`.
- **Otherwise** read the references in this skill:
  - `references/components.md` — every component: description, props (type/default), events, slots and a real example. Has a table of contents; jump to the component you need.
  - `references/api.md` — composables (`useForm`, `useTheme`, `useLayout`, `useToast`, `useLocale`), helpers (`filterMenu`, `toCsv`, masks), shared types and design tokens.

Don't guess prop names — check them. Several props are easy to get wrong (`NuTable` uses `rows` + `columns`; `NuStatCard` takes `delta` as a number; `NuButton` uses `variant` + `color`, not `type="primary"`).

## Adding a page (the usual task)

1. **Page file** in `src/pages/` using this skeleton:

```vue
<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { NuButton, NuCard, NuPageHeader } from 'nusa-admin'
</script>

<template>
  <NuPageHeader title="Customers" subtitle="Everyone who bought something." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Customers' }]">
    <NuButton :icon="Plus" to="/customers/new">New customer</NuButton>
  </NuPageHeader>

  <div class="nu-row">
    <div class="nu-col-lg-8"><NuCard title="…">…</NuCard></div>
    <div class="nu-col-lg-4"><NuCard title="…">…</NuCard></div>
  </div>
</template>
```

2. **Route** — add it as a child of the shell route in `router.ts` (lazy `component: () => import('./pages/Customers.vue')`). Restricted pages get `meta: { roles: [...] }` if the app uses roles.
3. **Menu** — add a `NuMenuItem` to the menu array (`menu.ts`). The same array drives the sidebar, the top-nav layout and the command palette, so one entry is enough. Use `{ label, header: true }` for section titles and `children` for groups.

Common page shapes:

- **List / CRUD** → `NuCard flush` + `NuTable` (`searchable`, `selectable` with a `#bulk` slot, `exportable`, `#cell-<key>` slots for badges/actions) + `NuModal` to confirm deletes + `useToast()` for feedback. For API data use `manual` with `v-model:page/search/sort`, `total` and `loading`.
- **Form** → `useForm(initial, rules)` and `v-bind="form.field('name')"` on each input; submit with `form.handleSubmit(fn)`; put fields in `nu-row`/`nu-col-md-6`; actions in the card `#footer`.
- **Detail** → `NuPageHeader` with an Edit button, `NuDescriptions` for fields, `NuTimeline` for activity, `NuList` for related items.
- **Dashboard** → a `nu-row` of `NuStatCard`/`NuSmallBox`/`NuInfoBox`, then `NuChart`/`NuDonut`/`NuGeoMap` in cards, then a `NuTable` of recent items.

## Conventions and why they matter

- **Compact density.** The kit is deliberately tight (6px/4px radii, 14px card padding, 16px grid gaps, 32–34px controls). Don't add large paddings, margins or big rounded corners; use `nu-stack` / `nu-cluster` / `nu-row` and their `--nu-gap` for spacing.
- **Colors come from tokens.** Use `var(--nu-primary)`, `var(--nu-text-muted)`, `var(--nu-border)`, `var(--nu-surface)` etc. in custom CSS, never raw hex. That keeps dark mode and brand color changes working. Dark mode is neutral black (`#0a0a0a`/`#171717`); never introduce navy/slate-tinted darks.
- **`color` props take the six names**: `primary`, `secondary`, `success`, `warning`, `danger`, `info`. Status meaning: success = done/paid, warning = pending, danger = failed/destructive, secondary = neutral/inactive.
- **Logical CSS properties** in custom styles (`margin-inline-start`, `padding-inline`, `inset-inline-end`, `text-align: start`) so RTL keeps working.
- **Icons** are any Vue component passed as a prop (`:icon="Plus"` from `lucide-vue-next`). Icon-only buttons need an accessible name: `<NuButton :icon="Trash2" square aria-label="Delete" />` or `<NuIconButton :icon="Bell" label="Notifications" />`.
- **Feedback:** `useToast().success('Saved.')` after actions; `NuModal` (with `size="sm"`) to confirm destructive ones; `NuEmpty` for empty states; `NuCard :loading` or `NuSkeleton` while loading.
- **Charts:** `NuChart` (line/area/bar) and `NuDonut` pick theme series colors automatically — don't pass colors unless a series must be a specific meaning. Keep one y-axis per chart.
- **Text:** sentence case for titles and buttons ("New customer", not "New Customer"). The kit's built-in strings are translated via `useLocale()`; don't hard-code replacements for them.
- **Styles in pages:** a page's `<style>` block only loads with that route. Put classes shared by several pages in a global stylesheet instead of relying on another page's CSS.

## Layout and theme changes

- Layout options are `NuLayout` props: `layout="top-nav"`, `boxed`, `fixed-footer`, `:fixed-navbar="false"`, `:fixed-sidebar="false"`, `rtl`, `sidebar-search`, `fullscreen-toggle`, `sidebar-variant="light"`. Unset props follow the saved `useLayout()` state.
- App defaults go in `createNusaAdmin({ primary, theme, layout: {...}, locale, sidebarVariant })`.
- Re-skin by overriding tokens on `:root` (and `:root[data-theme='dark']`), e.g. `--nu-primary`, `--nu-radius`, `--nu-font`, `--nu-sidebar-width`. See `references/api.md` for the full token list.

## Before you finish

- Run the project's type check (`bun run typecheck` or `vue-tsc --noEmit`). Nu* components are fully typed, so prop mistakes show up there.
- New routes are reachable from the menu, and restricted ones carry `meta.roles`.
- Icon-only controls have labels; forms show errors through the `error` prop (useForm does this) rather than custom text.
- Custom CSS uses tokens and logical properties.
