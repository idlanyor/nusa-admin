/**
 * Builds packages/ui/meta/components.json — the single source the docs site, the MCP server and the
 * AI skill read from. Props/events/slots come from the component sources (vue-component-meta);
 * examples are real snippets cut from the demo app. Run: `bun run meta`.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { createChecker } from 'vue-component-meta'

const root = resolve(import.meta.dirname, '..')
const ui = join(root, 'packages/ui')
const demo = join(root, 'apps/demo/src')

const GROUPS: Record<string, string[]> = {
  Layout: ['NuLayout', 'NuSidebar', 'NuSidebarMenuItem', 'NuTopNav', 'NuNavbar', 'NuPageHeader', 'NuBreadcrumb', 'NuCustomizer', 'NuCommandPalette', 'NuAuthLayout', 'NuErrorPage', 'NuRouteProgress'],
  Content: ['NuCard', 'NuStatCard', 'NuSmallBox', 'NuInfoBox', 'NuUserCard', 'NuTimeline', 'NuTable', 'NuPagination', 'NuList', 'NuListItem', 'NuDescriptions', 'NuCalendar', 'NuAccordion', 'NuTabs', 'NuSteps', 'NuDivider', 'NuCallout', 'NuRibbon'],
  Apps: ['NuDirectChat', 'NuTodoList'],
  Feedback: ['NuAlert', 'NuBadge', 'NuProgress', 'NuProgressRing', 'NuSpinner', 'NuSkeleton', 'NuEmpty', 'NuTooltip', 'NuModal', 'NuDrawer', 'NuToastHost'],
  Actions: ['NuButton', 'NuIconButton', 'NuDropdown', 'NuDropdownItem', 'NuSegmented'],
  Forms: ['NuInput', 'NuTextarea', 'NuSelect', 'NuCombobox', 'NuDatePicker', 'NuEditor', 'NuCodeEditor', 'NuCheckbox', 'NuSwitch', 'NuRadioGroup', 'NuSlider', 'NuTagInput', 'NuTransfer', 'NuFileUpload', 'NuRating'],
  Charts: ['NuChart', 'NuDonut', 'NuSparkline', 'NuGeoMap'],
  Misc: ['NuAvatar', 'NuAvatarGroup', 'NuIcon'],
}

const DESCRIPTIONS: Record<string, string> = {
  NuLayout: 'App shell: sidebar (or top nav), navbar, content and footer, with every AdminLTE layout option as a prop.',
  NuSidebar: 'Sidebar with brand, optional menu search, nested menu and footer. Used by NuLayout.',
  NuSidebarMenuItem: 'One recursive sidebar menu entry. Rarely used directly; NuSidebar renders the menu array.',
  NuTopNav: 'Horizontal menu for the top-nav layout; section headers become dropdowns, overflow goes into "More".',
  NuNavbar: 'Top bar with sidebar toggle, slots for search/notifications/user, theme and fullscreen toggles.',
  NuPageHeader: 'Page title with optional subtitle, breadcrumb and action buttons (default slot).',
  NuBreadcrumb: 'Breadcrumb trail from an array of { label, to }.',
  NuCustomizer: 'Control panel drawer for theme, brand color, sidebar style and layout options (saved per browser).',
  NuCommandPalette: 'Ctrl/Cmd+K palette listing every menu page plus custom commands, with an optional fallback command.',
  NuAuthLayout: 'Centered card (or split screen) for sign-in, register and similar pages.',
  NuErrorPage: 'Full-page error/empty state with a big code, title, description and actions.',
  NuRouteProgress: 'Thin progress bar at the top during route changes. Mount once in App.vue.',
  NuCard: 'Card with title, tools (collapse, maximize, refresh, remove), accent or solid header, footer and loading overlay.',
  NuStatCard: 'KPI tile: label, value, icon, delta vs a period, optional sparkline in the default slot.',
  NuSmallBox: 'AdminLTE "small box": solid tile with a big number, faded icon and a "More info" footer link.',
  NuInfoBox: 'AdminLTE "info box": colored icon block beside a label, value and optional progress.',
  NuUserCard: 'Profile widget with colored cover, avatar, name, role and a row of stats.',
  NuTimeline: 'Vertical timeline of events with icons/colors; items with `label` render as date separators.',
  NuTable: 'Data table: search, sort, pagination, cell slots, row selection with bulk actions, CSV export, server mode.',
  NuPagination: 'Page buttons with ellipses; v-model is the page number.',
  NuList: 'Bordered list container for NuListItem rows.',
  NuListItem: 'List row with icon/start slot, title, subtitle and end slot; renders as link or button when needed.',
  NuDescriptions: 'Label/value pairs (definition list) in 1–3 columns, with per-item slots.',
  NuCalendar: 'Month calendar with events, selection and range highlighting; `compact` for a small picker grid.',
  NuAccordion: 'Collapsible sections; one open at a time unless `multiple`.',
  NuTabs: 'Tabs (line or pills); each tab is a named slot matching its key.',
  NuSteps: 'Step indicator for wizards; v-model is the current step index.',
  NuDivider: 'Horizontal rule with an optional centered label.',
  NuCallout: 'Bordered note with a colored left edge and optional title.',
  NuRibbon: 'Corner ribbon for a card or any positioned box.',
  NuDirectChat: 'Chat message list with avatars and a send box; emits `send`.',
  NuTodoList: 'Checklist with drag (and keyboard) reordering, due badges, delete and an add box.',
  NuAlert: 'Inline alert with icon, title and optional dismiss.',
  NuBadge: 'Small label in soft, solid or outline style, optional dot or pill shape.',
  NuProgress: 'Horizontal progress bar with optional label and value.',
  NuProgressRing: 'Circular progress with the percentage (or slot) in the middle.',
  NuSpinner: 'Loading spinner.',
  NuSkeleton: 'Shimmering placeholder lines or circle while content loads.',
  NuEmpty: 'Empty state with icon, title, description and actions.',
  NuTooltip: 'CSS tooltip on hover/focus of the wrapped element.',
  NuModal: 'Dialog with focus trap, scroll lock, Escape/backdrop close and a footer slot.',
  NuDrawer: 'Side panel dialog (left or right) with the same behavior as NuModal.',
  NuToastHost: 'Renders toasts from useToast(). NuLayout already includes one.',
  NuButton: 'Button or link (to/href) in solid, soft, outline or ghost style, with icon and loading state.',
  NuIconButton: 'Square icon-only button with an accessible label and optional badge/dot.',
  NuDropdown: 'Popover menu anchored to a trigger slot, with keyboard navigation.',
  NuDropdownItem: 'Menu row inside NuDropdown; renders as link or button.',
  NuSegmented: 'Segmented control (radio group styled as buttons).',
  NuInput: 'Text input with label, hint, error, prefix/suffix slots and an optional `mask`.',
  NuTextarea: 'Multi-line text input with label, hint and error.',
  NuSelect: 'Native select with label, placeholder, hint and error.',
  NuCombobox: 'Searchable select, single or multiple, keyboard friendly, clearable.',
  NuDatePicker: 'Date input with a calendar popover; single date or `range`.',
  NuEditor: 'Lightweight rich-text editor (contenteditable) with a formatting toolbar; v-model is HTML.',
  NuCodeEditor: 'Plain-text code editor with line numbers, Tab indentation and auto-indent.',
  NuCheckbox: 'Checkbox with label and error.',
  NuSwitch: 'Toggle switch.',
  NuRadioGroup: 'Radio buttons from an options array, stacked or inline.',
  NuSlider: 'Range slider with label and formatted value.',
  NuTagInput: 'Free-text tags: Enter or comma adds, Backspace removes.',
  NuTransfer: 'Dual list box: move options between available and selected lists.',
  NuFileUpload: 'Drag-and-drop file picker with a file list; v-model is File[].',
  NuRating: 'Star rating input or read-only display.',
  NuChart: 'Dependency-free SVG line, area or bar chart with legend and hover tooltip.',
  NuDonut: 'Donut chart with center total and a legend with shares.',
  NuSparkline: 'Tiny trend line for tiles and table cells.',
  NuGeoMap: 'Choropleth map from GeoJSON features with a sequential color legend and tooltips.',
  NuAvatar: 'Avatar image or initials with optional status dot.',
  NuAvatarGroup: 'Overlapping avatars with a "+N" counter.',
  NuIcon: 'The small built-in icon set the kit uses internally.',
}

// ---- components exported by the kit ----
const index = readFileSync(join(ui, 'src/index.ts'), 'utf8')
const files = new Map<string, string>()
for (const m of index.matchAll(/import (Nu\w+) from '\.\/components\/(\w+)\.vue'/g)) files.set(m[1]!, `src/components/${m[2]}.vue`)

const checker = createChecker(join(ui, 'tsconfig.json'), { forceUseTs: true, printer: { newLine: 1 } })

// ---- demo routes and examples ----
const router = readFileSync(join(demo, 'router.ts'), 'utf8')
const routeOf = new Map<string, string>()
for (const m of router.matchAll(/path: '([^']+)',[^\n]*?import\('\.\/(pages\/[^']+)'\)/g)) {
  const file = m[2]!
  if (!routeOf.has(file)) routeOf.set(file, '/' + m[1]!.replace(/^\//, ''))
}
routeOf.set('pages/Dashboard.vue', '/')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.vue') ? [p] : []
  })
}
const demoFiles = walk(demo).map((p) => ({ path: p, rel: relative(demo, p), text: readFileSync(p, 'utf8') }))

function dedent(lines: string[]) {
  const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length))
  return lines.map((l) => l.slice(pad)).join('\n')
}
/** Cut `<Tag ...>...</Tag>` (or self-closing) starting at `offset` of `text`, honoring nesting and quotes. */
function cutElement(text: string, offset: number, tag: string): string | null {
  let depth = 0
  let i = offset
  while (i < text.length) {
    if (text.startsWith(`</${tag}>`, i)) {
      depth--
      i += tag.length + 3
      if (depth === 0) return text.slice(offset, i)
      continue
    }
    if (text.startsWith(`<${tag}`, i) && /[\s>/]/.test(text[i + tag.length + 1] ?? '')) {
      // find the end of this opening tag, skipping quoted attribute values
      let j = i + tag.length + 1
      let quote: string | null = null
      for (; j < text.length; j++) {
        const ch = text[j]!
        if (quote) {
          if (ch === quote) quote = null
        } else if (ch === '"' || ch === "'") quote = ch
        else if (ch === '>') break
      }
      if (text[j - 1] === '/') {
        if (depth === 0) return text.slice(offset, j + 1)
      } else depth++
      i = j + 1
      continue
    }
    i++
    if (i - offset > 4000) return null
  }
  return null
}
function reindent(code: string, firstLineIndent: number) {
  const lines = code.split('\n')
  return dedent([' '.repeat(firstLineIndent) + lines[0], ...lines.slice(1)])
}
function examplesFor(name: string) {
  const out: { file: string; route?: string; code: string }[] = []
  const tag = name === 'NuSidebarMenuItem' ? null : name
  if (!tag) return out
  for (const f of demoFiles) {
    if (out.length >= 2) break
    const tpl = f.text.indexOf('\n<template>')
    const m = new RegExp(`<${tag}(?=[\\s>/])`, 'g')
    m.lastIndex = Math.max(0, tpl)
    const hit = m.exec(f.text)
    if (!hit) continue
    const lineStart = f.text.lastIndexOf('\n', hit.index) + 1
    const raw = cutElement(f.text, hit.index, tag)
    const code = raw && reindent(raw, hit.index - lineStart)
    if (!code || code.split('\n').length > 30 || code.length > 1800) continue
    if (out.some((e) => e.code === code)) continue
    out.push({ file: `apps/demo/src/${f.rel}`, route: routeOf.get(f.rel), code })
  }
  return out
}

// Descriptions for props that mean the same thing everywhere (used when the source has no JSDoc).
const COMMON_PROPS: Record<string, string> = {
  modelValue: 'Bound value (use v-model).',
  label: 'Visible label (also the accessible name).',
  hint: 'Help text under the control.',
  error: 'Error message; marks the control invalid.',
  placeholder: 'Placeholder text.',
  disabled: 'Disable the control.',
  required: 'Mark as required (adds an asterisk to the label).',
  readonly: 'Read-only.',
  size: "Size: 'sm' | 'md' | 'lg'.",
  color: "Theme color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'.",
  icon: 'Icon component (any Vue component, e.g. from lucide-vue-next).',
  to: 'Router location; renders a RouterLink.',
  href: 'URL; renders an <a>.',
  title: 'Title text.',
  subtitle: 'Secondary text under the title.',
  options: 'Choices as { label, value, disabled? }[].',
  items: 'Items to render.',
  menu: 'Menu definition (NuMenuItem[]); the same array drives sidebar, top nav and command palette.',
  height: 'Height (CSS length or pixels).',
  format: 'Formats numbers for display.',
  multiple: 'Allow several values.',
  clearable: 'Show a clear button.',
  searchable: 'Show a search box.',
  locale: 'BCP 47 locale for dates; defaults to the active useLocale() language.',
  variant: 'Visual style.',
  name: 'Name (used for initials, alt text or labels).',
  value: 'Current value.',
  max: 'Maximum value.',
  min: 'Minimum value.',
  step: 'Step between values.',
  rows: 'Visible text rows.',
  description: 'Secondary text.',
  loading: 'Show a loading state.',
  block: 'Stretch to full width.',
  square: 'Icon-only square shape (provide aria-label).',
  dense: 'Tighter rows.',
  striped: 'Zebra-striped rows.',
  hover: 'Highlight rows on hover.',
  pill: 'Fully rounded shape.',
  dot: 'Show a status dot.',
  align: 'Alignment.',
  width: 'Width (CSS length).',
}
/** Only use a shared description when the prop's type matches what it describes. */
function commonDoc(name: string, type: string) {
  const numeric = ['rows', 'max', 'min', 'step', 'height']
  if (numeric.includes(name) && !/number/.test(type)) return ''
  if (name === 'items' && !/\[\]/.test(type)) return ''
  return COMMON_PROPS[name] ?? ''
}
const SLOT_NOTES: Record<string, string> = {
  NuTable: 'Each column can be customised with a `cell-<key>` slot receiving `{ row, value }`.',
  NuTabs: 'Each tab’s panel is the slot named after its `key`.',
  NuAccordion: 'An item’s body can be replaced with a slot named after its `key`.',
  NuDescriptions: 'Each item’s value can be replaced with a slot named after its `key`.',
  NuTimeline: 'The `item` slot adds content under each event.',
}

/** Hand-written examples for shell components whose demo usage is too long to excerpt. */
const EXTRA_EXAMPLES: Record<string, string> = {
  NuLayout: `<NuLayout :menu="menu" brand="My App" sidebar-search fullscreen-toggle>
  <template #navbar-end><!-- notifications, language… --></template>
  <template #navbar-user><!-- account dropdown --></template>
  <RouterView />
  <template #footer>© My App</template>
</NuLayout>`,
  NuSidebar: `<!-- Usually rendered by NuLayout; standalone: -->
<NuSidebar :menu="menu" variant="light" searchable />`,
  NuNavbar: `<!-- Usually rendered by NuLayout; standalone: -->
<NuNavbar fullscreen-toggle>
  <template #end><NuIconButton :icon="Bell" label="Notifications" :badge="3" /></template>
</NuNavbar>`,
  NuTopNav: `<!-- NuLayout renders this when layout="top-nav" -->
<NuLayout :menu="menu" layout="top-nav" />`,
  NuToastHost: `<!-- NuLayout includes one. Outside a layout (e.g. auth pages): -->
<NuToastHost />`,
  NuIcon: '<NuIcon name="check" :size="16" />',
}

// ---- build ----
const groupOf = (n: string) => Object.entries(GROUPS).find(([, list]) => list.includes(n))?.[0] ?? 'Misc'
const clean = (s?: string) => (s ?? '').replace(/\s+/g, ' ').trim()

const order = Object.values(GROUPS).flat()
const components = [...files.entries()].sort(([a], [b]) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999)).map(([name, file]) => {
  const meta = checker.getComponentMeta(join(ui, file))
  const props = meta.props
    .filter((p) => !p.global && !p.name.startsWith('onUpdate:'))
    .map((p) => ({ name: p.name, type: clean(p.type), required: p.required, default: p.default, description: clean(p.description) || commonDoc(p.name, clean(p.type)) }))
  const events = meta.events.map((e) => ({ name: e.name, type: clean(e.type), description: clean(e.description) }))
  const slots = meta.slots.map((s) => ({ name: s.name, type: clean(s.type), description: clean(s.description) }))
  const exposed = meta.exposed.filter((x) => !x.name.startsWith('$')).map((x) => ({ name: x.name, type: clean(x.type), description: clean(x.description) }))
  const examples = examplesFor(name)
  if (!examples.length && EXTRA_EXAMPLES[name]) examples.push({ file: '', route: undefined, code: EXTRA_EXAMPLES[name]! })
  if (!DESCRIPTIONS[name]) console.warn(`! no description for ${name}`)
  const description = [DESCRIPTIONS[name] ?? '', SLOT_NOTES[name] ?? ''].filter(Boolean).join(' ')
  return { name, group: groupOf(name), file: `packages/ui/${file}`, description, props, events, slots, exposed, examples }
})

// Design tokens (light defaults) from tokens.css
const tokensCss = readFileSync(join(ui, 'src/styles/tokens.css'), 'utf8')
const light = tokensCss.slice(0, tokensCss.indexOf(":root[data-theme='dark']"))
const tokens = [...light.matchAll(/(--nu-[\w-]+):\s*([^;]+);/g)].map((m) => ({ name: m[1]!, value: m[2]!.trim() }))

const composables = [
  { name: 'useTheme', signature: 'useTheme(): { theme: { mode, resolved, primary }, setMode(mode), toggleDark(), setPrimary(color | null), setDefaults({ mode, primary }) }', description: 'Light/dark/system mode and brand color, saved in localStorage (nu-theme).' },
  { name: 'useLayout', signature: "useLayout(): { layout, toggleSidebar(), setOption(key, value), setSidebarVariant('dark' | 'light'), setDefaults(), applyDirection(rtl), isMobile() }", description: 'Layout options (topNav, boxed, fixedNavbar, fixedSidebar, fixedFooter, collapsed, rtl), saved in localStorage (nu-layout).' },
  { name: 'useToast', signature: 'useToast(): { toasts, show(input, color?), success(input), error(input), warning(input), info(input), dismiss(id) }', description: 'Fire toasts from anywhere; input is a message string or { title?, message, duration? }.' },
  { name: 'useForm', signature: 'useForm(initial, schema): { values, errors, touched, submitting, isValid, validate(), validateField(name), reset(next?), field(name), handleSubmit(fn) }', description: 'Form state and validation. `v-bind="form.field(\'email\')"` wires value, update, blur validation and error into any Nu* input.' },
  { name: 'rules', signature: 'rules.required(msg?) | email(msg?) | minLength(n, msg?) | maxLength(n, msg?) | min(n, msg?) | max(n, msg?) | pattern(re, msg?) | sameAs(field, msg?)', description: 'Built-in validation rules; any (value, values) => true | message also works.' },
  { name: 'useLocale', signature: "useLocale(): { locale, setLocale(code), setDefaultLocale(code), addMessages(code, messages), t(key, params?) }", description: "Language of built-in text (en, id, or added), saved in localStorage (nu-locale)." },
  { name: 'useOverlay', signature: 'useOverlay(open: Ref<boolean>, panel: Ref<HTMLElement | null>, { onEscape? })', description: 'Focus trap, scroll lock, Escape handling and focus restore for custom dialogs.' },
  { name: 'filterMenu', signature: 'filterMenu(menu, (item) => boolean): NuMenuItem[]', description: 'Hide menu items (e.g. by item.meta.roles), dropping emptied groups and headers.' },
  { name: 'toCsv / downloadText', signature: 'toCsv(rows, columns): string; downloadText(filename, text, type?)', description: 'CSV from table columns (labels + format) and a browser download helper.' },
  { name: 'applyMask / unmask', signature: 'applyMask(value, mask): string; unmask(value, mask): string', description: 'Input masks: 9 digit, a letter, * either; other characters are literals.' },
  { name: 'createNusaAdmin', signature: 'createNusaAdmin({ theme?, primary?, sidebarVariant?, layout?, locale?, messages?, registerComponents? }): Plugin', description: 'Vue plugin: applies defaults for first-time visitors and registers Nu* components globally (unless registerComponents: false).' },
]

const types = {
  NuMenuItem: '{ label: string; icon?: Component; to?: RouteLocationRaw; href?: string; target?: string; badge?: string | number; badgeColor?: NuColor; children?: NuMenuItem[]; header?: boolean; color?: NuColor; meta?: Record<string, unknown> }',
  NuTableColumn: "{ key: string; label: string; sortable?: boolean; align?: 'left' | 'center' | 'right'; width?: string; format?: (value, row) => string }",
  NuColor: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'",
  NuOption: '{ label: string; value: string | number; disabled?: boolean }',
  NuChartSeries: '{ name: string; data: number[]; color?: string }',
  NuTimelineItem: '{ label?: string; title?: string; time?: string; description?: string; color?: NuColor; icon?: Component }',
}

const pkg = JSON.parse(readFileSync(join(ui, 'package.json'), 'utf8'))
const out = { package: pkg.name, version: pkg.version, components, composables, types, tokens }
mkdirSync(join(ui, 'meta'), { recursive: true })
writeFileSync(join(ui, 'meta/components.json'), JSON.stringify(out, null, 2) + '\n')
const withExamples = components.filter((c) => c.examples.length).length
console.log(`meta: ${components.length} components (${withExamples} with demo examples), ${tokens.length} tokens → packages/ui/meta/components.json`)

// ---- AI skill references (skills/nusa-admin/references) ----
const skillDir = join(root, 'skills/nusa-admin/references')
mkdirSync(skillDir, { recursive: true })
const esc = (t: string) => t.replace(/\|/g, '\\|')
const anchor = (n: string) => n.toLowerCase()
const groupsInOrder = Object.keys(GROUPS)
const toc = groupsInOrder
  .map((g) => `- **${g}:** ` + components.filter((c) => c.group === g).map((c) => `[${c.name}](#${anchor(c.name)})`).join(', '))
  .join('\n')
const sections = groupsInOrder.flatMap((g) =>
  components
    .filter((c) => c.group === g)
    .map((c) => {
      const lines = [`## ${c.name}`, '', c.description]
      if (c.props.length) {
        lines.push('', '| Prop | Type | Default | Notes |', '| --- | --- | --- | --- |')
        for (const p of c.props) lines.push(`| \`${p.name}\`${p.required ? '*' : ''} | \`${esc(p.type)}\` | ${p.default ? `\`${esc(p.default)}\`` : ''} | ${esc(p.description)} |`)
      }
      if (c.events.length) lines.push('', 'Events: ' + c.events.map((e) => `\`${e.name}\``).join(', '))
      if (c.slots.length) lines.push('', 'Slots: ' + c.slots.map((s) => `\`${s.name}\``).join(', '))
      const ex = c.examples[0]
      if (ex) lines.push('', ex.route ? `Example (demo \`${ex.route}\`):` : 'Example:', '', '```vue', ex.code, '```')
      return lines.join('\n')
    }),
)
writeFileSync(
  join(skillDir, 'components.md'),
  `# Component reference\n\nGenerated from the kit source by \`bun run meta\` — do not edit by hand. \`*\` marks required props.\n\n## Contents\n\n${toc}\n\n${sections.join('\n\n')}\n`,
)
const apiMd = [
  '# API reference',
  '',
  'Generated by `bun run meta` — do not edit by hand.',
  '',
  '## Composables and helpers',
  '',
  ...composables.flatMap((c) => [`### ${c.name}`, '', c.description, '', '```ts', c.signature, '```', '']),
  '## Shared types',
  '',
  ...Object.entries(types).map(([k, v]) => `- \`${k}\` = \`${v}\``),
  '',
  '## Design tokens (light values)',
  '',
  'Dark values are redefined under `:root[data-theme="dark"]`. Override on `:root` to re-skin.',
  '',
  '```css',
  ...tokens.map((t) => `${t.name}: ${t.value};`),
  '```',
  '',
].join('\n')
writeFileSync(join(skillDir, 'api.md'), apiMd)
console.log('skill references → skills/nusa-admin/references/{components,api}.md')

