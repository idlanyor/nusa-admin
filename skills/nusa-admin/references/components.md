# Component reference

Generated from the kit source by `bun run meta` — do not edit by hand. `*` marks required props.

## Contents

- **Layout:** [NuLayout](#nulayout), [NuSidebar](#nusidebar), [NuSidebarMenuItem](#nusidebarmenuitem), [NuTopNav](#nutopnav), [NuNavbar](#nunavbar), [NuPageHeader](#nupageheader), [NuBreadcrumb](#nubreadcrumb), [NuCustomizer](#nucustomizer), [NuCommandPalette](#nucommandpalette), [NuAuthLayout](#nuauthlayout), [NuErrorPage](#nuerrorpage), [NuRouteProgress](#nurouteprogress)
- **Content:** [NuCard](#nucard), [NuStatCard](#nustatcard), [NuSmallBox](#nusmallbox), [NuInfoBox](#nuinfobox), [NuUserCard](#nuusercard), [NuTimeline](#nutimeline), [NuTable](#nutable), [NuPagination](#nupagination), [NuList](#nulist), [NuListItem](#nulistitem), [NuDescriptions](#nudescriptions), [NuCalendar](#nucalendar), [NuAccordion](#nuaccordion), [NuTabs](#nutabs), [NuSteps](#nusteps), [NuDivider](#nudivider), [NuCallout](#nucallout), [NuRibbon](#nuribbon)
- **Apps:** [NuDirectChat](#nudirectchat), [NuTodoList](#nutodolist)
- **Feedback:** [NuAlert](#nualert), [NuBadge](#nubadge), [NuProgress](#nuprogress), [NuProgressRing](#nuprogressring), [NuSpinner](#nuspinner), [NuSkeleton](#nuskeleton), [NuEmpty](#nuempty), [NuTooltip](#nutooltip), [NuModal](#numodal), [NuDrawer](#nudrawer), [NuToastHost](#nutoasthost)
- **Actions:** [NuButton](#nubutton), [NuIconButton](#nuiconbutton), [NuDropdown](#nudropdown), [NuDropdownItem](#nudropdownitem), [NuSegmented](#nusegmented)
- **Forms:** [NuInput](#nuinput), [NuTextarea](#nutextarea), [NuSelect](#nuselect), [NuCombobox](#nucombobox), [NuDatePicker](#nudatepicker), [NuEditor](#nueditor), [NuCodeEditor](#nucodeeditor), [NuCheckbox](#nucheckbox), [NuSwitch](#nuswitch), [NuRadioGroup](#nuradiogroup), [NuSlider](#nuslider), [NuTagInput](#nutaginput), [NuTransfer](#nutransfer), [NuFileUpload](#nufileupload), [NuRating](#nurating)
- **Charts:** [NuChart](#nuchart), [NuDonut](#nudonut), [NuSparkline](#nusparkline), [NuGeoMap](#nugeomap)
- **Misc:** [NuAvatar](#nuavatar), [NuAvatarGroup](#nuavatargroup), [NuIcon](#nuicon)

## NuLayout

App shell: sidebar (or top nav), navbar, content and footer, with every AdminLTE layout option as a prop.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `menu`* | `NuMenuItem[]` |  | Menu definition (NuMenuItem[]); the same array drives sidebar, top nav and command palette. |
| `brand` | `string \| undefined` | `"Nusa Admin"` | Product name shown next to the logo. |
| `logo` | `string \| undefined` |  | Logo image URL; defaults to the first letter of `brand`. |
| `brandTo` | `string \| J \| W \| undefined` | `"/"` |  |
| `sidebarVariant` | `NuSidebarVariant \| undefined` |  |  |
| `layout` | `"sidebar" \| "top-nav" \| undefined` | `undefined` | `top-nav` puts the menu in the navbar on desktop (the sidebar remains the mobile drawer). |
| `boxed` | `boolean \| undefined` | `undefined` |  |
| `fixedNavbar` | `boolean \| undefined` | `undefined` |  |
| `fixedSidebar` | `boolean \| undefined` | `undefined` |  |
| `fixedFooter` | `boolean \| undefined` | `undefined` |  |
| `rtl` | `boolean \| undefined` | `undefined` | Right-to-left layout (sets `dir` on <html> while this layout is mounted). |
| `sidebarSearch` | `boolean \| undefined` |  | Filter box at the top of the sidebar menu. |
| `themeToggle` | `boolean \| undefined` | `true` |  |
| `fullscreenToggle` | `boolean \| undefined` |  |  |
| `customizer` | `boolean \| undefined` |  | Show the floating theme customizer button. |

Slots: `brand`, `sidebar-top`, `sidebar-footer`, `navbar-start`, `navbar-end`, `navbar-user`, `default`, `footer`

Example:

```vue
<NuLayout :menu="menu" brand="My App" sidebar-search fullscreen-toggle>
  <template #navbar-end><!-- notifications, language… --></template>
  <template #navbar-user><!-- account dropdown --></template>
  <RouterView />
  <template #footer>© My App</template>
</NuLayout>
```

## NuSidebar

Sidebar with brand, optional menu search, nested menu and footer. Used by NuLayout.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `menu`* | `NuMenuItem[]` |  | Menu definition (NuMenuItem[]); the same array drives sidebar, top nav and command palette. |
| `variant` | `NuSidebarVariant \| undefined` | `"dark"` | Visual style. |
| `searchable` | `boolean \| undefined` |  | Show a search box. |
| `searchPlaceholder` | `string \| undefined` |  |  |

Slots: `brand`, `before`, `default`, `footer`

Example:

```vue
<!-- Usually rendered by NuLayout; standalone: -->
<NuSidebar :menu="menu" variant="light" searchable />
```

## NuSidebarMenuItem

One recursive sidebar menu entry. Rarely used directly; NuSidebar renders the menu array.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `item`* | `NuMenuItem` |  |  |
| `depth` | `number \| undefined` | `0` |  |

## NuTopNav

Horizontal menu for the top-nav layout; section headers become dropdowns, overflow goes into "More".

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `menu`* | `NuMenuItem[]` |  | Menu definition (NuMenuItem[]); the same array drives sidebar, top nav and command palette. |
| `moreLabel` | `string \| undefined` |  |  |

Example:

```vue
<!-- NuLayout renders this when layout="top-nav" -->
<NuLayout :menu="menu" layout="top-nav" />
```

## NuNavbar

Top bar with sidebar toggle, slots for search/notifications/user, theme and fullscreen toggles.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `themeToggle` | `boolean \| undefined` | `true` |  |
| `fullscreenToggle` | `boolean \| undefined` |  |  |

Slots: `brand`, `start`, `end`, `user`

Example:

```vue
<!-- Usually rendered by NuLayout; standalone: -->
<NuNavbar fullscreen-toggle>
  <template #end><NuIconButton :icon="Bell" label="Notifications" :badge="3" /></template>
</NuNavbar>
```

## NuPageHeader

Page title with optional subtitle, breadcrumb and action buttons (default slot).

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title`* | `string` |  | Title text. |
| `subtitle` | `string \| undefined` |  | Secondary text under the title. |
| `breadcrumb` | `NuBreadcrumbItem[] \| undefined` |  |  |

Slots: `default`

Example (demo `/widgets`):

```vue
<NuPageHeader title="Widgets" subtitle="Ready-made blocks for dashboards." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Widgets' }]" />
```

## NuBreadcrumb

Breadcrumb trail from an array of { label, to }.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items`* | `NuBreadcrumbItem[]` |  | Items to render. |

Example (demo `/ui/navigation`):

```vue
<NuBreadcrumb :items="[{ label: 'Home', to: '/' }, { label: 'Library', to: '/' }, { label: 'Data' }]" />
```

## NuCustomizer

Control panel drawer for theme, brand color, sidebar style and layout options (saved per browser).

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `colors` | `{ name: string; value: string \| null; }[] \| undefined` | `[
    { name: "Indigo", value: null },
    { name: "Blue", value: "#2563eb" },
    { name: "Teal", value: "#0d9488" },
    { name: "Emerald", value: "#059669" },
    { name: "Rose", value: "#e11d48" },
    { name: "Orange", value: "#ea580c" },
    { name: "Violet", value: "#7c3aed" },
]` | Brand color choices; `null` value = token default. |
| `hideTrigger` | `boolean \| undefined` |  | Hide the floating button and drive `v-model` yourself. |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `default`

Example:

```vue
<NuCustomizer v-model="controlPanel" hide-trigger>
  <section>
    <h4>Shortcuts</h4>
    <NuButton size="sm" variant="soft" to="/layout/options" @click="controlPanel = false">All layout options</NuButton>
  </section>
</NuCustomizer>
```

## NuCommandPalette

Ctrl/Cmd+K palette listing every menu page plus custom commands, with an optional fallback command.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `menu` | `NuMenuItem[] \| undefined` | `[]` | Menu definition (NuMenuItem[]); the same array drives sidebar, top nav and command palette. |
| `commands` | `NuCommand[] \| undefined` | `[]` |  |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hotkey` | `boolean \| undefined` | `true` | Listen for Ctrl/⌘+K globally. |
| `fallback` | `((query: string) => NuCommand \| null) \| undefined` |  |  |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Example:

```vue
<NuCommandPalette v-model="palette" :menu="menu" :commands="commands" :fallback="searchFallback" />
```

## NuAuthLayout

Centered card (or split screen) for sign-in, register and similar pages.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title`* | `string` |  | Title text. |
| `subtitle` | `string \| undefined` |  | Secondary text under the title. |
| `brand` | `string \| undefined` | `"Nusa Admin"` |  |
| `logo` | `string \| undefined` |  |  |
| `variant` | `"split" \| "card" \| undefined` | `"card"` | `split` adds a branded panel beside the form on wide screens. |
| `asideTitle` | `string \| undefined` |  | Headline and text for the split panel (or use the `aside` slot). |
| `asideText` | `string \| undefined` |  |  |

Slots: `aside`, `brand`, `default`, `footer`

Example (demo `/auth/lock`):

```vue
<NuAuthLayout title="Session locked" subtitle="Enter your password to pick up where you left off.">
  <div class="nu-cluster" style="margin-bottom: 12px">
    <NuAvatar :name="user?.name ?? 'Guest'" :size="40" />
    <div>
      <div class="nu-fw-600">{{ user?.name ?? 'Guest' }}</div>
      <div class="nu-text-sm nu-text-muted">{{ user?.email }}</div>
    </div>
  </div>
  <form class="nu-stack" style="--nu-gap: 12px" @submit.prevent="router.push(user ? '/' : '/auth/login')">
    <NuInput v-model="password" label="Password" type="password" autocomplete="current-password" required>
      <template #prefix><Lock /></template>
    </NuInput>
    <NuButton type="submit" size="lg" block>Unlock</NuButton>
  </form>
  <template #footer>Not you? <RouterLink to="/auth/login">Sign in as someone else</RouterLink></template>
</NuAuthLayout>
```

## NuErrorPage

Full-page error/empty state with a big code, title, description and actions.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `code` | `string \| number \| undefined` |  |  |
| `title`* | `string` |  | Title text. |
| `description` | `string \| undefined` |  | Secondary text. |

Slots: `icon`, `default`

Example (demo `/errors/403`):

```vue
<NuErrorPage code="403" title="You don't have access to this page" :description="`Signed in as ${user?.name ?? 'guest'} (${user ? roleLabel[user.role] : 'no role'}). Ask an administrator for access, or sign in with another account.`">
  <template #icon><ShieldAlert /></template>
  <NuButton to="/">Back to dashboard</NuButton>
  <NuButton variant="outline" color="secondary" to="/auth/login">Switch account</NuButton>
</NuErrorPage>
```

## NuRouteProgress

Thin progress bar at the top during route changes. Mount once in App.vue.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `delay` | `number \| undefined` | `120` |  |

Example:

```vue
<NuRouteProgress />
```

## NuCard

Card with title, tools (collapse, maximize, refresh, remove), accent or solid header, footer and loading overlay.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string \| undefined` |  | Title text. |
| `subtitle` | `string \| undefined` |  | Secondary text under the title. |
| `accent` | `NuColor \| undefined` |  | Colored top border, like AdminLTE's `card-outline`. |
| `collapsible` | `boolean \| undefined` |  |  |
| `defaultCollapsed` | `boolean \| undefined` |  |  |
| `flush` | `boolean \| undefined` |  | Remove body padding (tables, lists, charts that bleed to the edge). |
| `loading` | `boolean \| undefined` |  | Show a loading state. |
| `solid` | `boolean \| undefined` |  | Fill the header with the accent color (AdminLTE `card-primary`). |
| `refreshable` | `boolean \| undefined` |  | Show a refresh tool; handle `@refresh` (e.g. set `loading`). |
| `maximizable` | `boolean \| undefined` |  | Show a tool that expands the card to fill the screen. |
| `removable` | `boolean \| undefined` |  | Show a tool that removes the card. |

Events: `refresh`, `remove`

Slots: `header`, `tools`, `default`, `footer`

Example (demo `/widgets`):

```vue
<NuCard title="Outline card" accent="primary" collapsible removable>Colored top border. Collapse or remove it with the tools.</NuCard>
```

## NuStatCard

KPI tile: label, value, icon, delta vs a period, optional sparkline in the default slot.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label`* | `string` |  | Visible label (also the accessible name). |
| `value`* | `string \| number` |  | Current value. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `variant` | `"solid" \| "soft" \| undefined` | `"soft"` | `solid` fills the tile with the color (AdminLTE "small-box" look). |
| `delta` | `number \| undefined` |  | Signed change in percent, e.g. 12.5 or -3.2. |
| `deltaLabel` | `string \| undefined` |  | What the delta compares against, e.g. "vs last month". |
| `invertDelta` | `boolean \| undefined` |  | Set when a decrease is the good direction (costs, churn, errors). |

Slots: `default`

Example (demo `/widgets`):

```vue
<NuStatCard label="Sales" value="$24,310" :icon="CircleDollarSign" color="success" :delta="3.2" delta-label="vs last month" />
```

## NuSmallBox

AdminLTE "small box": solid tile with a big number, faded icon and a "More info" footer link.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label`* | `string` |  | Visible label (also the accessible name). |
| `value`* | `string \| number` |  | Current value. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `to` | `string \| J \| W \| undefined` |  | Router location; renders a RouterLink. |
| `href` | `string \| undefined` |  | URL; renders an <a>. |
| `linkLabel` | `string \| undefined` |  |  |

Example (demo `/widgets`):

```vue
<NuSmallBox label="New orders" value="150" :icon="ShoppingBag" color="info" to="/tables/data" />
```

## NuInfoBox

AdminLTE "info box": colored icon block beside a label, value and optional progress.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label`* | `string` |  | Visible label (also the accessible name). |
| `value`* | `string \| number` |  | Current value. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `progress` | `number \| undefined` |  | 0–100; shows a thin bar under the value. |
| `description` | `string \| undefined` |  | Secondary text. |

Example (demo `/widgets`):

```vue
<NuInfoBox label="Messages" value="1,410" :icon="MessageSquare" color="info" />
```

## NuUserCard

Profile widget with colored cover, avatar, name, role and a row of stats.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name`* | `string` |  | Name (used for initials, alt text or labels). |
| `role` | `string \| undefined` |  |  |
| `avatar` | `string \| undefined` |  |  |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `stats` | `{ label: string; value: string \| number; }[] \| undefined` | `[]` |  |
| `align` | `"center" \| "left" \| undefined` | `"center"` | `left` puts the avatar beside the name in the cover. |

Slots: `default`

Example (demo `/widgets`):

```vue
<NuUserCard name="Ayu Lestari" role="Product designer" color="info" :stats="[{ label: 'Sales', value: '3,200' }, { label: 'Followers', value: '13,000' }, { label: 'Products', value: 35 }]" />
```

## NuTimeline

Vertical timeline of events with icons/colors; items with `label` render as date separators. The `item` slot adds content under each event.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items`* | `NuTimelineItem[]` |  | Items to render. |

Slots: `item`

Example (demo `/ecommerce`):

```vue
<NuTimeline
  :items="[
    { title: 'Great light, sturdy base — Ayu', time: '★★★★★', description: 'The warm setting is perfect for reading.', color: 'success' },
    { title: 'Good, but the cable is short — Budi', time: '★★★★', description: 'Bought an extension; otherwise excellent.', color: 'info' },
    { title: 'Arrived scratched — Citra', time: '★★★', description: 'Support replaced it within a week.', color: 'warning' },
  ]"
/>
```

## NuTable

Data table: search, sort, pagination, cell slots, row selection with bulk actions, CSV export, server mode. Each column can be customised with a `cell-<key>` slot receiving `{ row, value }`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns`* | `NuTableColumn<T>[]` |  | Column definitions: key, label, sortable, align, width, format. |
| `rows`* | `T[]` |  | Row objects (in server mode: just the current page). |
| `rowKey` | `string \| undefined` |  | Property used as the row key (required for `selectable`). Falls back to the row index. |
| `searchable` | `boolean \| undefined` |  | Show a search box. |
| `searchPlaceholder` | `string \| undefined` |  |  |
| `pageSize` | `number \| undefined` | `10` | Rows per page; 0 disables pagination. |
| `striped` | `boolean \| undefined` |  | Zebra-striped rows. |
| `hover` | `boolean \| undefined` | `true` | Highlight rows on hover. |
| `dense` | `boolean \| undefined` |  | Tighter rows. |
| `emptyText` | `string \| undefined` |  |  |
| `selectable` | `boolean \| undefined` |  | Checkbox column; bind the chosen row keys with `v-model:selected`. |
| `exportable` | `string \| boolean \| undefined` |  | "Export CSV" button. Pass a string to set the file name. Exports every filtered row, sorted. |
| `manual` | `boolean \| undefined` |  | Server mode: the table doesn't search, sort or paginate `rows` itself. Bind `v-model:search`, `v-model:sort` and `v-model:page`, load the page yourself and pass `total`. |
| `total` | `number \| undefined` |  | Total row count in server mode. |
| `loading` | `boolean \| undefined` |  | Show a loading state. |
| `page` | `number \| undefined` | `1` |  |
| `search` | `string \| undefined` | `""` |  |
| `sort` | `NuTableSort \| null \| undefined` | `null` |  |
| `selected` | `(string \| number)[] \| undefined` | `[]` |  |

Events: `update:page`, `update:search`, `update:sort`, `update:selected`

Slots: `bulk`, `toolbar`, `empty`

Example (demo `/dashboard-2`):

```vue
<NuTable :columns="columns" :rows="orders.slice(0, 7)" row-key="id" :page-size="0">
  <template #cell-status="{ row }"><NuBadge :color="statusColor[row.status as Order['status']]">{{ row.status }}</NuBadge></template>
</NuTable>
```

## NuPagination

Page buttons with ellipses; v-model is the page number.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `total`* | `number` |  |  |
| `pageSize` | `number \| undefined` | `10` |  |
| `siblings` | `number \| undefined` | `1` |  |
| `modelValue` | `number \| undefined` | `1` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/contacts`):

```vue
<NuPagination v-model="page" :total="filtered.length" :page-size="PAGE" />
```

## NuList

Bordered list container for NuListItem rows.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `bordered` | `boolean \| undefined` |  |  |

Slots: `default`

Example (demo `/apps/mailbox/compose`):

```vue
<NuList>
  <NuListItem :icon="Inbox" title="Inbox" to="/apps/mailbox" />
  <NuListItem :icon="Send" title="Sent" to="/apps/mailbox" />
  <NuListItem :icon="FileText" title="Drafts" to="/apps/mailbox" />
  <NuListItem :icon="Trash2" title="Trash" to="/apps/mailbox" />
</NuList>
```

## NuListItem

List row with icon/start slot, title, subtitle and end slot; renders as link or button when needed.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string \| undefined` |  | Title text. |
| `subtitle` | `string \| undefined` |  | Secondary text under the title. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `to` | `string \| J \| W \| undefined` |  | Router location; renders a RouterLink. |
| `href` | `string \| undefined` |  | URL; renders an <a>. |
| `clickable` | `boolean \| undefined` |  | Render as a button (emits native click). |
| `active` | `boolean \| undefined` |  |  |

Slots: `start`, `default`, `end`

Example (demo `/apps/mailbox/compose`):

```vue
<NuListItem :icon="Inbox" title="Inbox" to="/apps/mailbox" />
```

## NuDescriptions

Label/value pairs (definition list) in 1–3 columns, with per-item slots. Each item’s value can be replaced with a slot named after its `key`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items`* | `NuDescriptionItem[]` |  | Items to render. |
| `columns` | `1 \| 2 \| 3 \| undefined` | `1` |  |

Example (demo `/forms/wizard`):

```vue
<NuDescriptions
  :columns="2"
  :items="[
    { label: 'Name', value: form.name },
    { label: 'Email', value: form.email },
    { label: 'Company', value: form.company },
    { label: 'Team size', value: form.size },
    { label: 'Plan', value: form.plan },
    { label: 'Billing', value: form.yearly ? 'Yearly' : 'Monthly' },
  ]"
/>
```

## NuCalendar

Month calendar with events, selection and range highlighting; `compact` for a small picker grid.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `events` | `NuCalendarEvent[] \| undefined` | `[]` |  |
| `weekStart` | `0 \| 1 \| undefined` | `1` | 0 = Sunday, 1 = Monday. |
| `locale` | `string \| undefined` |  | BCP 47 locale for dates; defaults to the active useLocale() language. |
| `compact` | `boolean \| undefined` |  |  |
| `range` | `[string, string] \| null \| undefined` |  | Highlight an inclusive date range, [start, end] as YYYY-MM-DD. |
| `modelValue` | `string \| undefined` |  | Selected day, YYYY-MM-DD. |

Events: `update:modelValue`, `select`, `event-click`

Example (demo `/apps/calendar`):

```vue
<NuCalendar v-model="selected" :events="events" @event-click="toast.info(`${$event.title} · ${$event.date}`)" />
```

## NuAccordion

Collapsible sections; one open at a time unless `multiple`. An item’s body can be replaced with a slot named after its `key`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items`* | `NuAccordionItem[]` |  | Items to render. |
| `multiple` | `boolean \| undefined` |  | Allow several values. |
| `defaultOpen` | `string[] \| undefined` |  |  |

Example (demo `/faq`):

```vue
<NuAccordion :items="g.items" multiple />
```

## NuTabs

Tabs (line or pills); each tab is a named slot matching its key. Each tab’s panel is the slot named after its `key`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tabs`* | `NuTab[]` |  |  |
| `variant` | `"line" \| "pills" \| undefined` |  | Visual style. |
| `modelValue` | `string \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/ecommerce`):

```vue
<NuTabs v-model="tab" :tabs="[{ key: 'description', label: 'Description' }, { key: 'specs', label: 'Specifications' }, { key: 'reviews', label: 'Reviews (3)' }]">
  <template #description>
    <p>Designed for long evenings at the desk: flicker-free light, five brightness levels and a memory function that restores your last setting.</p>
  </template>
  <template #specs>
    <table class="st st--striped" style="max-width: 520px">
      <tbody>
        <tr><td>Power</td><td>10 W LED, USB-C 5 V / 2 A</td></tr>
        <tr><td>Color temperature</td><td>2700–6500 K</td></tr>
        <tr><td>Height</td><td>42 cm (arm extended 58 cm)</td></tr>
        <tr><td>Warranty</td><td>2 years</td></tr>
      </tbody>
    </table>
  </template>
  <template #reviews>
    <NuTimeline
      :items="[
        { title: 'Great light, sturdy base — Ayu', time: '★★★★★', description: 'The warm setting is perfect for reading.', color: 'success' },
        { title: 'Good, but the cable is short — Budi', time: '★★★★', description: 'Bought an extension; otherwise excellent.', color: 'info' },
        { title: 'Arrived scratched — Citra', time: '★★★', description: 'Support replaced it within a week.', color: 'warning' },
      ]"
    />
  </template>
</NuTabs>
```

## NuSteps

Step indicator for wizards; v-model is the current step index.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps`* | `NuStep[]` |  |  |
| `clickable` | `boolean \| undefined` |  |  |
| `vertical` | `boolean \| undefined` |  |  |
| `modelValue` | `number \| undefined` | `0` | Zero-based index of the current step. |

Events: `update:modelValue`

Example (demo `/forms/wizard`):

```vue
<NuSteps :model-value="step" :steps="steps" style="flex: 1" />
```

## NuDivider

Horizontal rule with an optional centered label.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |

Slots: `default`

Example (demo `/ui/general`):

```vue
<NuDivider label="Sizes &amp; states" />
```

## NuCallout

Bordered note with a colored left edge and optional title.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `NuColor \| undefined` | `"info"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `title` | `string \| undefined` |  | Title text. |

Slots: `default`

Example (demo `/widgets`):

```vue
<NuCallout color="danger" title="I am a danger callout!">There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul.</NuCallout>
```

## NuRibbon

Corner ribbon for a card or any positioned box.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `text`* | `string` |  |  |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `size` | `"md" \| "lg" \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |

Example (demo `/widgets`):

```vue
<NuRibbon text="New" color="danger" />
```

## NuDirectChat

Chat message list with avatars and a send box; emits `send`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `messages`* | `NuChatMessage[]` |  |  |
| `height` | `string \| undefined` | `"320px"` |  |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `avatars` | `boolean \| undefined` | `true` |  |

Events: `send`

Example (demo `/widgets`):

```vue
<NuDirectChat :messages="chat" height="260px" @send="(text) => chat.push({ from: 'Ayu Lestari', text, me: true, time: 'now' })" />
```

## NuTodoList

Checklist with drag (and keyboard) reordering, due badges, delete and an add box.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `addable` | `boolean \| undefined` |  |  |
| `addPlaceholder` | `string \| undefined` |  |  |
| `sortable` | `boolean \| undefined` | `true` |  |
| `modelValue` | `NuTodo[] \| undefined` | `[]` | Bound value (use v-model). |

Events: `add`, `update:modelValue`

Example (demo `/widgets`):

```vue
<NuTodoList v-model="todos" addable />
```

## NuAlert

Inline alert with icon, title and optional dismiss.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `NuColor \| undefined` | `"info"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `title` | `string \| undefined` |  | Title text. |
| `dismissible` | `boolean \| undefined` |  |  |

Events: `dismiss`

Slots: `icon`, `default`

Example:

```vue
<NuAlert color="info">{{ meta.note }} This page forces the option through route meta; other pages keep your saved settings.</NuAlert>
```

## NuBadge

Small label in soft, solid or outline style, optional dot or pill shape.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `variant` | `"solid" \| "soft" \| "outline" \| undefined` | `"soft"` | Visual style. |
| `pill` | `boolean \| undefined` |  | Fully rounded shape. |
| `dot` | `boolean \| undefined` |  | Show a status dot. |

Slots: `default`

Example (demo `/invoice`):

```vue
<NuBadge color="success" dot>Paid</NuBadge>
```

## NuProgress

Horizontal progress bar with optional label and value.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value`* | `number` |  | Current value. |
| `max` | `number \| undefined` | `100` | Maximum value. |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `height` | `number \| undefined` | `8` | Height (CSS length or pixels). |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `showValue` | `boolean \| undefined` |  |  |
| `labelHidden` | `boolean \| undefined` |  |  |

Example (demo `/profile`):

```vue
<NuProgress label="Interface design" :value="92" show-value />
```

## NuProgressRing

Circular progress with the percentage (or slot) in the middle.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value`* | `number` |  | Current value. |
| `max` | `number \| undefined` | `100` | Maximum value. |
| `size` | `number \| undefined` | `64` | Size: 'sm' \| 'md' \| 'lg'. |
| `thickness` | `number \| undefined` | `6` |  |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |

Slots: `default`

Example (demo `/ui/general`):

```vue
<NuProgressRing :value="72" label="Primary" />
```

## NuSpinner

Loading spinner.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | `number \| undefined` | `20` | Size: 'sm' \| 'md' \| 'lg'. |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |

Example (demo `/ui/general`):

```vue
<NuSpinner :size="14" />
```

## NuSkeleton

Shimmering placeholder lines or circle while content loads.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `width` | `string \| undefined` | `"100%"` | Width (CSS length). |
| `height` | `string \| undefined` | `"12px"` |  |
| `lines` | `number \| undefined` | `1` |  |
| `circle` | `boolean \| undefined` |  |  |

Example (demo `/ui/feedback`):

```vue
<NuSkeleton circle height="40px" />
```

## NuEmpty

Empty state with icon, title, description and actions.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title`* | `string` |  | Title text. |
| `description` | `string \| undefined` |  | Secondary text. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |

Slots: `default`

Example (demo `/forms/wizard`):

```vue
<NuEmpty v-else title="All set" :description="`${form.company} was created on the ${form.plan} plan.`" :icon="PartyPopper">
  <NuButton size="sm" variant="outline" color="secondary" @click="step = 0">Start over</NuButton>
</NuEmpty>
```

## NuTooltip

CSS tooltip on hover/focus of the wrapped element.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `text`* | `string` |  |  |
| `placement` | `"left" \| "right" \| "top" \| "bottom" \| undefined` | `"top"` |  |

Slots: `default`

Example (demo `/ui/feedback`):

```vue
<NuTooltip text="Tooltip on top"><NuButton variant="outline" color="secondary">Top</NuButton></NuTooltip>
```

## NuModal

Dialog with focus trap, scroll lock, Escape/backdrop close and a footer slot.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string \| undefined` |  | Title text. |
| `size` | `"md" \| "lg" \| "sm" \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |
| `persistent` | `boolean \| undefined` |  |  |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `header`, `default`, `footer`

Example (demo `/apps/calendar`):

```vue
<NuModal v-model="modal" title="New event" size="sm">
  <form id="event-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="save">
    <NuInput v-model="draft.title" label="Title" required />
    <NuInput v-model="draft.date" label="Date" type="date" required />
    <NuSelect
      v-model="draft.color"
      label="Color"
      :options="['primary', 'success', 'warning', 'danger', 'info', 'secondary'].map((c) => ({ label: c, value: c }))"
    />
  </form>
  <template #footer="{ close }">
    <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
    <NuButton type="submit" form="event-form">Add</NuButton>
  </template>
</NuModal>
```

## NuDrawer

Side panel dialog (left or right) with the same behavior as NuModal.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string \| undefined` |  | Title text. |
| `side` | `"left" \| "right" \| undefined` | `"right"` |  |
| `width` | `string \| undefined` | `"380px"` | Width (CSS length). |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `header`, `default`, `footer`

Example (demo `/ui/feedback`):

```vue
<NuDrawer v-model="drawer" title="Filters">
  <div class="nu-stack" style="--nu-gap: 10px">
    <NuInput label="Customer" placeholder="Any customer" />
    <NuInput label="Min amount" type="number" placeholder="0" />
  </div>
  <template #footer="{ close }">
    <NuButton variant="ghost" color="secondary" @click="close">Reset</NuButton>
    <NuButton @click="close">Apply</NuButton>
  </template>
</NuDrawer>
```

## NuToastHost

Renders toasts from useToast(). NuLayout already includes one.

Example:

```vue
<!-- NuLayout includes one. Outside a layout (e.g. auth pages): -->
<NuToastHost />
```

## NuButton

Button or link (to/href) in solid, soft, outline or ghost style, with icon and loading state.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost" \| undefined` | `"solid"` | Visual style. |
| `size` | `NuSize \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `square` | `boolean \| undefined` |  | Icon-only square button. Provide `aria-label`. |
| `block` | `boolean \| undefined` |  | Stretch to full width. |
| `loading` | `boolean \| undefined` |  | Show a loading state. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `to` | `string \| J \| W \| undefined` |  | Router location; renders a RouterLink. |
| `href` | `string \| undefined` |  | URL; renders an <a>. |
| `type` | `"button" \| "submit" \| "reset" \| undefined` | `"button"` |  |

Slots: `default`

Example (demo `/widgets`):

```vue
<NuButton size="sm" variant="soft" color="danger" @click="toast.info('Footer action')">Action</NuButton>
```

## NuIconButton

Square icon-only button with an accessible label and optional badge/dot.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `label`* | `string` |  | Accessible name — required since the button has no text. |
| `badge` | `string \| number \| boolean \| undefined` |  | Count bubble; `true` shows a plain dot. |

Slots: `default`

Example:

```vue
<NuIconButton :icon="Languages" label="Language" />
```

## NuDropdown

Popover menu anchored to a trigger slot, with keyboard navigation.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `align` | `"left" \| "right" \| undefined` | `"right"` | Alignment. |
| `width` | `string \| undefined` | `"220px"` | Width (CSS length). |

Slots: `trigger`, `default`

Example (demo `/ui/navigation`):

```vue
<NuDropdown align="left">
  <template #trigger><NuButton variant="outline" color="secondary">Actions</NuButton></template>
  <NuDropdownItem :icon="User">Profile</NuDropdownItem>
  <NuDropdownItem :icon="CreditCard">Billing</NuDropdownItem>
  <div class="nu-dropdown__divider" />
  <NuDropdownItem :icon="Trash2" danger>Delete</NuDropdownItem>
</NuDropdown>
```

## NuDropdownItem

Menu row inside NuDropdown; renders as link or button.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | `Component \| undefined` |  | Icon component (any Vue component, e.g. from lucide-vue-next). |
| `to` | `string \| J \| W \| undefined` |  | Router location; renders a RouterLink. |
| `href` | `string \| undefined` |  | URL; renders an <a>. |
| `danger` | `boolean \| undefined` |  |  |
| `disabled` | `boolean \| undefined` |  | Disable the control. |

Slots: `default`, `end`

Example (demo `/ui/navigation`):

```vue
<NuDropdownItem :icon="User">Profile</NuDropdownItem>
```

## NuSegmented

Segmented control (radio group styled as buttons).

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options`* | `NuOption[]` |  | Choices as { label, value, disabled? }[]. |
| `size` | `NuSize \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |
| `block` | `boolean \| undefined` |  | Stretch to full width. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `modelValue` | `string \| number \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuSegmented v-model="billing" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]" label="Billing period" />
```

## NuInput

Text input with label, hint, error, prefix/suffix slots and an optional `mask`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `type` | `string \| undefined` | `"text"` |  |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `size` | `NuSize \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `required` | `boolean \| undefined` |  | Mark as required (adds an asterisk to the label). |
| `mask` | `string \| undefined` |  | Input mask: `9` digit, `a` letter, `*` either; other characters are literals. |
| `modelValue` | `string \| number \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `prefix`, `suffix`

Example (demo `/forms/wizard`):

```vue
<NuInput v-model="form.name" label="Full name" required :error="errors.name" autocomplete="name" />
```

## NuTextarea

Multi-line text input with label, hint and error.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `rows` | `number \| undefined` | `4` | Visible text rows. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `required` | `boolean \| undefined` |  | Mark as required (adds an asterisk to the label). |
| `modelValue` | `string \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/validation`):

```vue
<NuTextarea v-bind="field('bio')" label="Short bio" :rows="3" :hint="bioHint" />
```

## NuSelect

Native select with label, placeholder, hint and error.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options`* | `NuOption[]` |  | Choices as { label, value, disabled? }[]. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `size` | `NuSize \| undefined` | `"md"` | Size: 'sm' \| 'md' \| 'lg'. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `required` | `boolean \| undefined` |  | Mark as required (adds an asterisk to the label). |
| `modelValue` | `string \| number \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/wizard`):

```vue
<NuSelect
  v-model="form.size"
  label="Team size"
  :options="[{ label: '1–10', value: '1-10' }, { label: '11–50', value: '11-50' }, { label: '51–200', value: '51-200' }, { label: '200+', value: '200+' }]"
/>
```

## NuCombobox

Searchable select, single or multiple, keyboard friendly, clearable.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options`* | `NuOption[]` |  | Choices as { label, value, disabled? }[]. |
| `multiple` | `boolean \| undefined` |  | Allow several values. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `searchPlaceholder` | `string \| undefined` |  |  |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `clearable` | `boolean \| undefined` |  | Show a clear button. |
| `emptyText` | `string \| undefined` |  |  |
| `modelValue` | `Value \| Value[] \| null \| undefined` | `null` | Bound value (use v-model). |

Events: `update:modelValue`, `blur`

Example (demo `/forms/validation`):

```vue
<NuCombobox v-bind="field('skills')" multiple label="Skills" placeholder="Choose skills" :options="['Vue', 'TypeScript', 'CSS', 'Node', 'Go', 'SQL'].map((s) => ({ label: s, value: s }))" />
```

## NuDatePicker

Date input with a calendar popover; single date or `range`.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `range` | `boolean \| undefined` |  |  |
| `clearable` | `boolean \| undefined` |  | Show a clear button. |
| `locale` | `string \| undefined` |  | BCP 47 locale for dates; defaults to the active useLocale() language. |
| `weekStart` | `0 \| 1 \| undefined` | `1` |  |
| `modelValue` | `Value \| undefined` | `null` | Bound value (use v-model). |

Events: `update:modelValue`, `blur`

Example (demo `/forms/validation`):

```vue
<NuDatePicker v-bind="field('start')" label="Start date" />
```

## NuEditor

Lightweight rich-text editor (contenteditable) with a formatting toolbar; v-model is HTML.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `minHeight` | `string \| undefined` | `"160px"` |  |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `modelValue` | `string \| undefined` | `""` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/editors`):

```vue
<NuEditor v-model="html" placeholder="Start writing…" min-height="220px" hint="Sanitize the HTML on the server before showing it to other users." />
```

## NuCodeEditor

Plain-text code editor with line numbers, Tab indentation and auto-indent.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `rows` | `number \| undefined` | `10` | Visible text rows. |
| `tabSize` | `number \| undefined` | `2` |  |
| `readonly` | `boolean \| undefined` |  | Read-only. |
| `language` | `string \| undefined` |  |  |
| `modelValue` | `string \| undefined` | `""` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/editors`):

```vue
<NuCodeEditor v-model="code" language="ts" :rows="8" :hint="`${lines} lines`" />
```

## NuCheckbox

Checkbox with label and error.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `default`

Example (demo `/forms/validation`):

```vue
<NuCheckbox v-bind="field('terms')">I accept the terms and privacy policy</NuCheckbox>
```

## NuSwitch

Toggle switch.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `modelValue` | `boolean \| undefined` | `false` | Bound value (use v-model). |

Events: `update:modelValue`

Slots: `default`

Example (demo `/forms/wizard`):

```vue
<NuSwitch v-model="form.yearly" label="Bill yearly (2 months free)" />
```

## NuRadioGroup

Radio buttons from an options array, stacked or inline.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options`* | `NuOption[]` |  | Choices as { label, value, disabled? }[]. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `inline` | `boolean \| undefined` |  |  |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `modelValue` | `string \| number \| undefined` |  | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/wizard`):

```vue
<NuRadioGroup
  v-model="form.plan"
  label="Plan"
  :options="[{ label: 'Starter — $19/mo', value: 'starter' }, { label: 'Team — $79/mo', value: 'team' }, { label: 'Business — $249/mo', value: 'business' }]"
/>
```

## NuSlider

Range slider with label and formatted value.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `min` | `number \| undefined` | `0` | Minimum value. |
| `max` | `number \| undefined` | `100` | Maximum value. |
| `step` | `number \| undefined` | `1` | Step between values. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `showValue` | `boolean \| undefined` |  |  |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `format` | `((v: number) => string) \| undefined` |  | Formats numbers for display. |
| `modelValue` | `number \| undefined` | `0` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuSlider v-model="volume" label="Volume" show-value />
```

## NuTagInput

Free-text tags: Enter or comma adds, Backspace removes.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `placeholder` | `string \| undefined` |  | Placeholder text. |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `error` | `string \| undefined` |  | Error message; marks the control invalid. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `modelValue` | `string[] \| undefined` | `[]` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuTagInput v-model="tags" label="Tags" placeholder="Add a tag" hint="Press Enter or comma to add; Backspace removes the last tag." />
```

## NuTransfer

Dual list box: move options between available and selected lists.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `options`* | `NuOption[]` |  | Choices as { label, value, disabled? }[]. |
| `titles` | `[string, string] \| undefined` |  |  |
| `searchable` | `boolean \| undefined` | `true` | Show a search box. |
| `height` | `string \| undefined` | `"220px"` |  |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `modelValue` | `Value[] \| undefined` | `[]` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuTransfer v-model="permissions" :options="permissionOptions" :titles="['Available permissions', 'Granted']" />
```

## NuFileUpload

Drag-and-drop file picker with a file list; v-model is File[].

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `accept` | `string \| undefined` |  |  |
| `multiple` | `boolean \| undefined` |  | Allow several values. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `hint` | `string \| undefined` |  | Help text under the control. |
| `disabled` | `boolean \| undefined` |  | Disable the control. |
| `modelValue` | `File[] \| undefined` | `[]` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuFileUpload v-model="files" multiple hint="Any file type, several at once" />
```

## NuRating

Star rating input or read-only display.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `max` | `number \| undefined` | `5` | Maximum value. |
| `readonly` | `boolean \| undefined` |  | Read-only. |
| `size` | `number \| undefined` | `18` | Size: 'sm' \| 'md' \| 'lg'. |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |
| `modelValue` | `number \| undefined` | `0` | Bound value (use v-model). |

Events: `update:modelValue`

Example (demo `/forms/advanced`):

```vue
<NuRating v-model="score" />
```

## NuChart

Dependency-free SVG line, area or bar chart with legend and hover tooltip.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `"line" \| "area" \| "bar" \| undefined` | `"line"` |  |
| `series`* | `NuChartSeries[]` |  |  |
| `labels`* | `string[]` |  | One label per data point (x axis). |
| `height` | `number \| undefined` | `280` | Height (CSS length or pixels). |
| `format` | `((value: number) => string) \| undefined` |  | Format y-axis ticks and tooltip values. |
| `label` | `string \| undefined` |  | Accessible summary of what the chart shows. |

Example (demo `/dashboard-3`):

```vue
<NuChart
  :labels="visitors[range as 'week' | 'month'].labels"
  :series="[{ name: 'This period', data: visitors[range as 'week' | 'month'].current }, { name: 'Last period', data: visitors[range as 'week' | 'month'].last }]"
  :height="230"
/>
```

## NuDonut

Donut chart with center total and a legend with shares.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `segments`* | `NuDonutSegment[]` |  |  |
| `size` | `number \| undefined` | `176` | Size: 'sm' \| 'md' \| 'lg'. |
| `thickness` | `number \| undefined` | `22` |  |
| `totalLabel` | `string \| undefined` | `"Total"` | Caption under the center total. |
| `format` | `((value: number) => string) \| undefined` |  | Formats numbers for display. |

Example (demo `/ui/charts`):

```vue
<NuDonut :segments="channels" total-label="Sessions" />
```

## NuSparkline

Tiny trend line for tiles and table cells.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `data`* | `number[]` |  |  |
| `color` | `string \| undefined` | `"var(--nu-chart-1)"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `height` | `number \| undefined` | `36` | Height (CSS length or pixels). |
| `area` | `boolean \| undefined` | `true` |  |
| `label` | `string \| undefined` |  | Visible label (also the accessible name). |

Example (demo `/dashboard-3`):

```vue
<NuSparkline :data="o.good ? [3, 4, 3, 5, 6, 7] : [6, 5, 6, 4, 3, 3]" :color="o.good ? 'var(--nu-success)' : 'var(--nu-danger)'" :height="28" :area="false" />
```

## NuGeoMap

Choropleth map from GeoJSON features with a sequential color legend and tooltips.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `features`* | `NuGeoFeature[]` |  |  |
| `values`* | `Record<string, number>` |  |  |
| `keyOf` | `((f: NuGeoFeature) => string) \| undefined` |  | How to get a feature's key into `values`. Defaults to `properties.name`. |
| `aspect` | `number \| undefined` | `2` | Width ÷ height of the drawing. |
| `format` | `((v: number) => string) \| undefined` |  | Format values in the tooltip and legend. |
| `label` | `string \| undefined` | `"Map"` | Accessible summary (also provide the numbers as text elsewhere, e.g. a list or table). |
| `exclude` | `string[] \| undefined` | `[]` | Feature keys to leave out, e.g. ['Antarctica']. |

Example (demo `/dashboard-2`):

```vue
<NuGeoMap :features="shapes" :values="visitors" :exclude="['Antarctica']" :format="(v) => `${v.toLocaleString()} sessions`" label="World map of sessions by country; top countries listed beside it" />
```

## NuAvatar

Avatar image or initials with optional status dot.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `src` | `string \| undefined` |  |  |
| `name` | `string \| undefined` |  | Used for initials and alt text. |
| `size` | `number \| undefined` | `36` | Size: 'sm' \| 'md' \| 'lg'. |
| `color` | `NuColor \| undefined` | `"primary"` | Theme color: 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'. |
| `status` | `"online" \| "away" \| "busy" \| "offline" \| undefined` |  |  |
| `square` | `boolean \| undefined` |  | Icon-only square shape (provide aria-label). |

Example (demo `/apps/chat`):

```vue
<NuAvatar :name="c.name" :status="c.status" :size="34" />
```

## NuAvatarGroup

Overlapping avatars with a "+N" counter.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `names`* | `string[]` |  |  |
| `max` | `number \| undefined` | `4` | Maximum value. |
| `size` | `number \| undefined` | `30` | Size: 'sm' \| 'md' \| 'lg'. |

Example (demo `/apps/kanban`):

```vue
<NuAvatarGroup :names="task.people" :size="22" :max="3" />
```

## NuIcon

The small built-in icon set the kit uses internally.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name`* | `"menu" \| "sort" \| "search" \| "refresh" \| "info" \| "chevron-down" \| "chevron-up" \| "chevron-right" \| "chevron-left" \| "x" \| "sun" \| "moon" \| "check" \| "minus" \| "arrow-up" \| "arrow-down" \| "alert" \| "check-circle" \| "x-circle" \| "star" \| "upload" \| "file" \| "inbox" \| "plus" \| "maximize" \| "minimize" \| "download" \| "arrow-right" \| "arrow-left" \| "grip" \| "calendar" \| "trash"` |  | Name (used for initials, alt text or labels). |
| `size` | `string \| number \| undefined` | `18` | Size: 'sm' \| 'md' \| 'lg'. |

Example:

```vue
<NuIcon name="check" :size="16" />
```
