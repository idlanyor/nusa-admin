/**
 * Nusa Admin MCP server (stdio). Gives AI assistants the component API, real examples,
 * guides, design tokens and page scaffolds for the `nusa-admin` Vue kit.
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { loadData } from './data'
import { componentList, componentMarkdown, search } from './format'
import { scaffoldPage } from './scaffold'

const { meta, guides } = loadData()
const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] })
const findComponent = (name: string) => {
  const n = name.trim().toLowerCase().replace(/^<|>$/g, '')
  return meta.components.find((c) => c.name.toLowerCase() === n || c.name.toLowerCase() === `nu${n}` || c.name.toLowerCase().replace(/^nu/, '') === n.replace(/-/g, ''))
}

export function createServer() {
  const server = new McpServer({ name: 'nusa-admin', version: meta.version })

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description: `List the ${meta.components.length} Nusa Admin Vue components with a one-line description each, grouped. Call this first to find the right component, then get_component for its API.`,
      inputSchema: { group: z.enum(['Layout', 'Content', 'Apps', 'Feedback', 'Actions', 'Forms', 'Charts', 'Misc']).optional().describe('Only this group') },
      annotations: { readOnlyHint: true },
    },
    async ({ group }) => text(componentList(meta, group)),
  )

  server.registerTool(
    'get_component',
    {
      title: 'Get component API',
      description: 'Props (type, default, description), events, slots and real usage examples (with the demo route) for one component, e.g. "NuTable" or "table".',
      inputSchema: { name: z.string().describe('Component name, with or without the Nu prefix') },
      annotations: { readOnlyHint: true },
    },
    async ({ name }) => {
      const c = findComponent(name)
      if (!c) return { ...text(`No component “${name}”. Available: ${meta.components.map((x) => x.name).join(', ')}`), isError: true }
      return text(componentMarkdown(c, meta.package))
    },
  )

  server.registerTool(
    'search',
    {
      title: 'Search docs',
      description: 'Search components, composables/helpers and guide sections, e.g. "date range", "server side table", "rtl", "validation".',
      inputSchema: { query: z.string().min(1) },
      annotations: { readOnlyHint: true },
    },
    async ({ query }) => text(search(meta, guides, query)),
  )

  server.registerTool(
    'get_guide',
    {
      title: 'Read a guide',
      description: `Read a guide in full. Available: ${guides.map((g) => g.slug).join(', ')}. Also "api" for composables, helpers and shared types.`,
      inputSchema: { slug: z.string().describe('Guide slug, e.g. "forms"') },
      annotations: { readOnlyHint: true },
    },
    async ({ slug }) => {
      if (slug === 'api') {
        const api = meta.composables.map((c) => `### ${c.name}\n\n${c.description}\n\n\`\`\`ts\n${c.signature}\n\`\`\``).join('\n\n')
        const types = Object.entries(meta.types).map(([k, v]) => `- \`${k}\` = \`${v}\``).join('\n')
        return text(`# API: composables and helpers\n\n${api}\n\n## Shared types\n\n${types}`)
      }
      const g = guides.find((x) => x.slug === slug.replace(/\.md$/, ''))
      return g ? text(g.body) : { ...text(`No guide “${slug}”. Available: ${guides.map((x) => x.slug).join(', ')}, api`), isError: true }
    },
  )

  server.registerTool(
    'get_tokens',
    {
      title: 'Design tokens',
      description: 'CSS custom properties (--nu-*) with their light-mode values. Override them to re-skin the kit; dark values are redefined under :root[data-theme="dark"].',
      annotations: { readOnlyHint: true },
    },
    async () => text(meta.tokens.map((t) => `${t.name}: ${t.value};`).join('\n')),
  )

  server.registerTool(
    'scaffold_page',
    {
      title: 'Scaffold a page',
      description: 'Generate a page component that follows the kit conventions: "list" (table with search, selection, CSV, delete dialog), "form" (useForm validation), "detail", or "dashboard". Returns the file path, the SFC and how to route it.',
      inputSchema: {
        kind: z.enum(['list', 'form', 'detail', 'dashboard']),
        entity: z.string().describe('Singular entity name, e.g. "Customer"'),
        fields: z.array(z.string()).optional().describe('Field names, e.g. ["name", "email", "status", "createdAt"]'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ kind, entity, fields }) => {
      const page = scaffoldPage(kind, entity, fields)
      return text(`File: \`${page.path}\`\n\n\`\`\`vue\n${page.code}\`\`\`\n\n${page.notes}`)
    },
  )

  // Guides and component docs are also readable as resources.
  for (const g of guides) {
    server.registerResource(g.slug, `nusa-admin://guide/${g.slug}`, { title: g.title, mimeType: 'text/markdown' }, async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: g.body }],
    }))
  }
  server.registerResource(
    'component',
    new ResourceTemplate('nusa-admin://component/{name}', { list: async () => ({ resources: meta.components.map((c) => ({ uri: `nusa-admin://component/${c.name}`, name: c.name, mimeType: 'text/markdown' })) }) }),
    { title: 'Component API', mimeType: 'text/markdown' },
    async (uri, { name }) => {
      const c = findComponent(String(name))
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: c ? componentMarkdown(c, meta.package) : `Unknown component ${name}` }] }
    },
  )

  return server
}
