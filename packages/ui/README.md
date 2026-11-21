<p align="center"><img src="https://unpkg.com/nusa-admin/brand/logo-lockup-light.svg" alt="Nusa Admin" width="260"></p>

# nusa-admin

A Vue 3 admin template kit: one layout shell (sidebar, top nav, boxed, fixed/scrolling parts, RTL), 83 `Nu*` components, dependency-free SVG charts, light/dark themes, design tokens, i18n (English, Indonesian) and form validation. No CSS framework, no jQuery.

## Start a new app

```bash
bun create nusa-admin my-admin      # or: npm create nusa-admin@latest my-admin
```

## Add to an existing app

```bash
npm install nusa-admin vue-router
```

```ts
import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'

createApp(App).use(router).use(createNusaAdmin({ primary: '#0d9488' })).mount('#app')
```

```vue
<NuLayout :menu="menu" brand="My App" sidebar-search>
  <RouterView />
</NuLayout>
```

## What's inside

- **Layout:** NuLayout, NuSidebar, NuTopNav, NuNavbar, NuPageHeader, NuBreadcrumb, NuCustomizer, NuCommandPalette (Ctrl/⌘+K), NuAuthLayout, NuErrorPage, NuRouteProgress
- **Content:** NuCard (collapse/maximize/refresh/remove), NuStatCard, NuSmallBox, NuInfoBox, NuUserCard, NuTable (search, sort, paging, selection, CSV, server mode), NuCalendar, NuTimeline, NuTabs, NuSteps, NuAccordion, …
- **Forms:** NuInput (masks), NuSelect, NuCombobox, NuDatePicker (range), NuEditor, NuCodeEditor, NuTransfer, NuTagInput, NuFileUpload, … plus `useForm()` + `rules`
- **Charts:** NuChart (line/area/bar), NuDonut, NuSparkline, NuGeoMap
- **Composables:** `useTheme`, `useLayout`, `useToast`, `useForm`, `useLocale`, `useOverlay`; helpers `filterMenu`, `toCsv`, `applyMask`

## AI assistants

Projects created with `create-nusa-admin` include a Claude Code skill and an MCP config. The MCP server is published as [`nusa-admin-mcp`](https://www.npmjs.com/package/nusa-admin-mcp).

## License

MIT © 2026 Roynaldi (Antidonasi Creative) — https://roynaldi.website
