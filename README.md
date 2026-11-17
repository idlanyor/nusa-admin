# Nusa Admin

A reusable admin template kit for **Vue 3 + Vite**, run with **Bun**. Think AdminLTE, but as typed Vue
components with no CSS framework and no jQuery: one layout shell, 70 components, dependency-free SVG
charts, light/dark themes, and a single file of design tokens to re-skin it.

```
packages/ui                 → the kit (npm `nusa-admin`): components, composables, styles, meta/components.json
packages/create-nusa-admin  → the CLI (npm `create-nusa-admin`): starter and full templates
packages/mcp                → MCP server for AI assistants (npm `nusa-admin-mcp`)
apps/demo                   → the demo app (60 routes: dashboards, apps, forms, tables, examples, auth, errors)
apps/docs                   → the documentation site (built with the kit), plus /llms.txt
docs/guide                  → guides in Markdown (shared by the docs site, the MCP server and llms.txt)
skills/nusa-admin           → Claude Code skill (SKILL.md + generated references)
scripts/gen-meta.ts         → extracts props/events/slots + demo examples → meta, skill references
```

One generator feeds everything: `bun run meta` reads the component sources (via `vue-component-meta`) and the demo
pages, and writes `packages/ui/meta/components.json` plus the skill's reference files. The docs site, the MCP server and
`llms.txt` all read that file, so they can't drift from the code (CI fails if the committed output is stale).

## Quick start

```bash
bun install
bun run dev        # demo app with HMR against the kit source → http://localhost:5173
bun run dev:docs   # documentation site → http://localhost:5174
bun run build      # build the library (packages/ui/dist) and the demo
bun run typecheck  # vue-tsc over both workspaces
bun run test       # unit tests (Vitest, run under Bun)
bun run test:e2e   # Playwright: every route on desktop + mobile, plus key interactions (needs `bun run build`)
bun run check      # all of the above
```

CI (`.github/workflows/ci.yml`) runs the same steps on every push and pull request.

## Create a new app

```bash
bun create nusa-admin my-admin            # or: npm create nusa-admin@latest my-admin
```

Choose `starter` (shell, dashboard, users CRUD, settings, auth and error pages) or `full` (the whole demo). Projects
include the Claude Code skill, `.mcp.json` and `AGENTS.md` unless you pass `--no-ai`. See `docs/guide/cli.md`.

## AI assistants

- **Skill:** `skills/nusa-admin` (also linked at `.claude/skills/nusa-admin` in this repo) teaches Claude Code the
  components, page recipes and conventions.
- **MCP server:** `packages/mcp` — tools `list_components`, `get_component`, `search`, `get_guide`, `get_tokens`,
  `scaffold_page` (list/form/detail/dashboard pages that type-check against the kit). This repo's `.mcp.json` runs it
  from source; generated apps run the published `nusa-admin-mcp`.
- **llms.txt:** the docs site serves `/llms.txt` and `/llms-full.txt`.

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
| Layout | `NuLayout`, `NuSidebar`, `NuSidebarMenuItem`, `NuTopNav`, `NuNavbar`, `NuPageHeader`, `NuBreadcrumb`, `NuCustomizer`, `NuCommandPalette`, `NuAuthLayout`, `NuErrorPage`, `NuRouteProgress` |
| Content | `NuCard`, `NuStatCard`, `NuSmallBox`, `NuInfoBox`, `NuUserCard`, `NuTimeline`, `NuTable`, `NuPagination`, `NuList`, `NuListItem`, `NuDescriptions`, `NuCalendar`, `NuAccordion`, `NuTabs`, `NuSteps`, `NuDivider`, `NuCallout`, `NuRibbon` |
| Apps | `NuDirectChat`, `NuTodoList` |
| Feedback | `NuAlert`, `NuBadge`, `NuProgress`, `NuProgressRing`, `NuSpinner`, `NuSkeleton`, `NuEmpty`, `NuTooltip`, `NuModal`, `NuDrawer`, `NuToastHost` (+ `useToast()`) |
| Actions | `NuButton`, `NuIconButton`, `NuDropdown`, `NuDropdownItem`, `NuSegmented` |
| Forms | `NuInput` (with `mask`), `NuTextarea`, `NuSelect`, `NuCombobox`, `NuDatePicker` (single or range), `NuEditor` (rich text), `NuCodeEditor`, `NuCheckbox`, `NuSwitch`, `NuRadioGroup`, `NuSlider`, `NuTagInput`, `NuTransfer` (dual list), `NuFileUpload`, `NuRating` (+ `useForm()` / `rules`) |
| Charts | `NuChart` (line / area / bar), `NuDonut`, `NuSparkline`, `NuGeoMap` (choropleth from GeoJSON) |
| Misc | `NuAvatar`, `NuAvatarGroup`, `NuIcon` |

`NuTable` does client-side search/sort/paging, or server-side with `manual` + `v-model:page/sort/search` + `total`;
add `selectable` (with a `#bulk` actions slot) and `exportable` (CSV).

`NuCard` has AdminLTE-style tools: `collapsible`, `maximizable`, `refreshable` (`@refresh`), `removable`, plus `accent` with `solid` headers.

### Layout options

Top navigation, boxed, fixed/scrolling navbar, fixed/scrolling sidebar, fixed footer, collapsed icon rail, right-to-left
(RTL), dark/light sidebar, sidebar menu search and a full-screen toggle. Each is a `NuLayout` prop; props left unset follow the saved
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
- `useLocale()` — `setLocale('id')`, `addMessages(code, messages)`, `t(key, params)`

Helpers: `filterMenu(menu, item => …)` (e.g. hide items by role via `item.meta.roles`), `toCsv()` / `downloadText()`,
`applyMask()` / `unmask()`.

### Languages

Built-in text (placeholders, labels for assistive tech, validation messages, dates) ships in English and Indonesian:

```ts
app.use(createNusaAdmin({ locale: 'id', messages: { ms: { close: 'Tutup' } } }))
```

Missing keys fall back to English. The demo's page copy is English; the language menu switches the kit's text.

### Command palette

`<NuCommandPalette v-model="open" :menu="menu" :commands="commands" />` opens with Ctrl/⌘+K, lists every page in the menu
plus your own commands, and can turn the typed text into a final command via `fallback` (the demo uses it for full-text search).

Theme, layout and language preferences persist in `localStorage` (`nu-theme`, `nu-layout`, `nu-locale`).

### Demo pages (60 routes)

The demo signs you in with a mock session (pick Admin, Editor or Viewer on the sign-in page); a router guard redirects
to sign-in and back, admin-only pages return 403 for other roles, and the menu hides what the role can't open. Replace
`apps/demo/src/auth.ts` with your API.


Dashboards v1–v3 (v2 has a world map) · Widgets · Layout options + examples (top nav, boxed, fixed footer, scrolling, RTL) · Calendar, Kanban,
Mailbox (inbox + compose), Chat, Gallery · UI: general, icons, feedback & modals, navigation & tabs, timeline,
ribbons & callouts, data display, charts · Forms: general, advanced, validation, editors, wizard · Tables: simple,
data, editable grid · Projects (list, detail, add, edit), Users (CRUD), Contacts, Profile, E-commerce, Billing,
Invoice, Pricing, Search results, FAQ, Contact us, Blank · Sign in / register (two styles each), forgot & recover
password, lock screen · 403, 404, 500, maintenance · Settings. The sidebar also shows multi-level menus and labels.

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

## License

MIT © 2026 Roynaldi (Antidonasi Creative) — https://roynaldi.website · roy@irengcloud.com. See `LICENSE`.
