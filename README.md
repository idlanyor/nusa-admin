# Nusa Admin

A reusable admin template kit for **Vue 3 + Vite**, run with **Bun**. Think AdminLTE, but as typed Vue
components with no CSS framework and no jQuery: one layout shell, 66 components, dependency-free SVG
charts, light/dark themes, and a single file of design tokens to re-skin it.

```
packages/ui   → the kit (npm package `nusa-admin`): components, composables, styles
apps/demo     → a demo/starter app that uses the kit (58 routes: dashboards, apps, forms, tables, examples, auth, errors)
```

## Quick start

```bash
bun install
bun run dev        # demo app with HMR against the kit source → http://localhost:5173
bun run build      # build the library (packages/ui/dist) and the demo
bun run typecheck  # vue-tsc over both workspaces
bun run test       # unit tests (Vitest, run under Bun)
bun run test:e2e   # Playwright: every route on desktop + mobile, plus key interactions (needs `bun run build`)
bun run check      # all of the above
```

CI (`.github/workflows/ci.yml`) runs the same steps on every push and pull request.

## Using the kit in an app

```ts
// main.ts
import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'

createApp(App)
  .use(router) // vue-router is a peer dependency
  .use(createNusaAdmin({ primary: '#0d9488', theme: 'auto', sidebarVariant: 'dark' }))
  .mount('#app')
```

The plugin registers every `Nu*` component globally. Pass `registerComponents: false` and import
components per file instead if you want tree-shaking (the demo does this).

```vue
<script setup lang="ts">
import { LayoutDashboard, Users } from 'lucide-vue-next' // any icon component works
import type { NuMenuItem } from 'nusa-admin'

const menu: NuMenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Management', header: true },
  { label: 'Users', icon: Users, badge: 12, children: [
    { label: 'All users', to: '/users' },
    { label: 'Roles', to: '/users/roles' },
  ] },
]
</script>

<template>
  <NuLayout :menu="menu" brand="My App">
    <template #navbar-end><!-- notifications, etc. --></template>
    <template #navbar-user><!-- account menu --></template>
    <RouterView />
    <template #footer>© My App</template>
  </NuLayout>
</template>
```

`NuLayout` slots: `brand`, `sidebar-footer`, `navbar-start`, `navbar-end`, `navbar-user`, `footer`, default.

## What's inside

| Group | Components |
| --- | --- |
| Layout | `NuLayout`, `NuSidebar`, `NuSidebarMenuItem`, `NuTopNav`, `NuNavbar`, `NuPageHeader`, `NuBreadcrumb`, `NuCustomizer`, `NuAuthLayout`, `NuErrorPage`, `NuRouteProgress` |
| Content | `NuCard`, `NuStatCard`, `NuSmallBox`, `NuInfoBox`, `NuUserCard`, `NuTimeline`, `NuTable`, `NuPagination`, `NuList`, `NuListItem`, `NuDescriptions`, `NuCalendar`, `NuAccordion`, `NuTabs`, `NuSteps`, `NuDivider`, `NuCallout`, `NuRibbon` |
| Apps | `NuDirectChat`, `NuTodoList` |
| Feedback | `NuAlert`, `NuBadge`, `NuProgress`, `NuProgressRing`, `NuSpinner`, `NuSkeleton`, `NuEmpty`, `NuTooltip`, `NuModal`, `NuDrawer`, `NuToastHost` (+ `useToast()`) |
| Actions | `NuButton`, `NuIconButton`, `NuDropdown`, `NuDropdownItem`, `NuSegmented` |
| Forms | `NuInput`, `NuTextarea`, `NuSelect`, `NuCombobox`, `NuDatePicker` (single or range), `NuEditor` (rich text), `NuCheckbox`, `NuSwitch`, `NuRadioGroup`, `NuSlider`, `NuTagInput`, `NuFileUpload`, `NuRating` (+ `useForm()` / `rules`) |
| Charts | `NuChart` (line / area / bar), `NuDonut`, `NuSparkline` |
| Misc | `NuAvatar`, `NuAvatarGroup`, `NuIcon` |

`NuCard` has AdminLTE-style tools: `collapsible`, `maximizable`, `refreshable` (`@refresh`), `removable`, plus `accent` with `solid` headers.

### Layout options

Top navigation, boxed, fixed/scrolling navbar, fixed/scrolling sidebar, fixed footer, collapsed icon rail, dark/light
sidebar, sidebar menu search and a full-screen toggle. Each is a `NuLayout` prop; props left unset follow the saved
`useLayout()` state, which `NuCustomizer` (the control panel) edits at runtime.

```vue
<NuLayout :menu="menu" layout="top-nav" boxed fixed-footer sidebar-search fullscreen-toggle />
```

In top-nav mode, section headers in the menu become dropdowns and entries that don't fit move into "More".

### Forms

```ts
const form = useForm({ email: '' }, { email: [rules.required(), rules.email()] })
```
```vue
<form @submit.prevent="form.handleSubmit(save)()">
  <NuInput v-bind="form.field('email')" label="Email" />
```

Fields validate on blur, then live; submitting validates everything and focuses the first invalid control. Rules:
`required`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `sameAs`, or any `(value, values) => true | message`.

Composables:

- `useTheme()` — `theme.mode / resolved / primary`, `setMode('light' | 'dark' | 'auto')`, `toggleDark()`, `setPrimary(color)`
- `useLayout()` — `layout.*`, `toggleSidebar()`, `setOption(key, value)`, `setSidebarVariant()`, `setDefaults()`
- `useToast()` — `success()`, `error()`, `warning()`, `info()`, `show()`, `dismiss()`
- `useForm()` — see above
- `useOverlay()` — focus trap, scroll lock and Escape handling for custom dialogs

Theme and layout preferences persist in `localStorage` (`nu-theme`, `nu-layout`).

### Demo pages (58 routes)

Dashboards v1–v3 · Widgets · Layout options + examples (top nav, boxed, fixed footer, scrolling) · Calendar, Kanban,
Mailbox (inbox + compose), Chat, Gallery · UI: general, icons, feedback & modals, navigation & tabs, timeline,
ribbons & callouts, data display, charts · Forms: general, advanced, validation, editors, wizard · Tables: simple,
data, editable grid · Projects (list, detail, add, edit), Users (CRUD), Contacts, Profile, E-commerce, Billing,
Invoice, Pricing, Search results, FAQ, Contact us, Blank · Sign in / register (two styles each), forgot & recover
password, lock screen · 404, 500, maintenance · Settings. The sidebar also shows multi-level menus and labels.

## Theming

Dark mode uses neutral blacks (no blue tint). Everything reads CSS custom properties from `packages/ui/src/styles/tokens.css`. Override them after
importing the stylesheet:

```css
:root {
  --nu-primary: #0d9488;
  --nu-radius: 6px;
  --nu-sidebar-width: 240px;
  --nu-font: 'Plus Jakarta Sans', system-ui, sans-serif;
}
:root[data-theme='dark'] {
  --nu-primary: #2dd4bf;
}
```

Hover states and soft tints are derived from the base colors with `color-mix()`, so one variable per
color is enough. Component classes are unscoped and prefixed `nu-` (BEM-ish), so they are easy to
override. Chart series use their own categorical tokens (`--nu-chart-1` … `--nu-chart-8`), kept
separate from the status colors.

A small utility set ships too: a 12-column grid (`nu-row`, `nu-col-6`, `nu-col-md-4`, `nu-col-lg-3`),
`nu-stack`, `nu-cluster`, `nu-between`, `nu-text-muted`.

## Adding a page to the demo

1. Create `apps/demo/src/pages/MyPage.vue`.
2. Add a child route in `apps/demo/src/router.ts` (copy `pages/Blank.vue` as a starting point).
3. Add an entry in `apps/demo/src/menu.ts`.

## Publishing the kit

`bun run build:lib` writes `packages/ui/dist` (ES module, one CSS file, `.d.ts` types). The package
`exports` already point there, so `cd packages/ui && bun publish` is all that's left. The demo
aliases `nusa-admin` to the kit's source (see `apps/demo/vite.config.ts`) so development needs no rebuild.

## Requirements

Bun ≥ 1.2, Vue ≥ 3.5, vue-router ≥ 4.4. Browsers need `color-mix()` (all evergreen browsers since 2023).
