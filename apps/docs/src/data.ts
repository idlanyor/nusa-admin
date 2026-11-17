import meta from '@meta'

export interface PropMeta { name: string; type: string; required: boolean; default?: string; description: string }
export interface ComponentDoc {
  name: string
  group: string
  file: string
  description: string
  props: PropMeta[]
  events: { name: string; type: string; description: string }[]
  slots: { name: string; type: string; description: string }[]
  exposed: { name: string; type: string; description: string }[]
  examples: { file: string; route?: string; code: string }[]
}

export const components = meta.components as ComponentDoc[]
export const composables = meta.composables as { name: string; signature: string; description: string }[]
export const types = meta.types as Record<string, string>
export const tokens = meta.tokens as { name: string; value: string }[]
export const version = meta.version as string
export const groups = [...new Set(components.map((c) => c.group))]

const raw = import.meta.glob('../../../docs/guide/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const ORDER = ['getting-started', 'layout', 'theming', 'forms', 'tables', 'i18n', 'auth-and-menu', 'cli', 'ai']
export const guides = Object.entries(raw)
  .map(([path, body]) => ({ slug: path.split('/').pop()!.replace(/\.md$/, ''), body, title: body.match(/^# (.+)$/m)?.[1] ?? '' }))
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))

export const demoUrl = (import.meta.env.VITE_DEMO_URL ?? 'http://localhost:5173').replace(/\/$/, '')
