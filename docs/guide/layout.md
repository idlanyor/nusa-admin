# Layout options

Every AdminLTE layout option is a `NuLayout` prop. Props you leave unset follow the visitor's saved preference (`useLayout()`, edited by `NuCustomizer`).

| Option | Prop | Notes |
| --- | --- | --- |
| Top navigation | `layout="top-nav"` | Menu moves into the navbar on desktop; section headers become dropdowns; overflow goes into "More". Mobile keeps the drawer. |
| Boxed | `boxed` | Centered page (max 1280px); the sidebar scrolls with the content. |
| Fixed navbar | `:fixed-navbar="false"` to let it scroll away | Default: fixed. |
| Fixed sidebar | `:fixed-sidebar="false"` | Default: fixed. |
| Fixed footer | `fixed-footer` | Footer sticks to the bottom of the window. |
| Collapsed sidebar | `useLayout().setOption('collapsed', true)` | Icon rail that expands on hover. |
| Right-to-left | `rtl` | Sets `<html dir="rtl">`; spacing uses logical CSS properties so everything mirrors. |
| Sidebar style | `sidebar-variant="light"` | `dark` (default) or `light`. |
| Menu search | `sidebar-search` | Filters the menu as you type. |
| Full screen | `fullscreen-toggle` | Navbar button. |

```vue
<NuLayout :menu="menu" layout="top-nav" boxed fixed-footer />
```

Defaults for first-time visitors:

```ts
app.use(createNusaAdmin({ layout: { boxed: true, fixedFooter: true }, sidebarVariant: 'light' }))
```

At runtime:

```ts
const { layout, setOption, setSidebarVariant } = useLayout()
setOption('topNav', true)
```

`<NuCustomizer v-model="open" />` is a ready-made control panel with all of these switches (`<NuLayout customizer>` adds a floating button for it).

## The menu

One `NuMenuItem[]` array drives the sidebar, the top nav and the command palette.

```ts
{ label: 'Apps', header: true }                           // section header
{ label: 'Calendar', icon: CalendarDays, to: '/calendar' } // link
{ label: 'Mailbox', icon: Mail, badge: 2, children: [...] } // group (any depth)
{ label: 'Important', color: 'danger', href: '#' }        // colored "label" bullet
{ label: 'Users', to: '/users', meta: { roles: ['admin'] } } // app data for filterMenu()
```
