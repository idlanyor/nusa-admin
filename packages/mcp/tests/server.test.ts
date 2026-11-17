import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolve } from 'node:path'

let client: Client
const call = async (name: string, args: Record<string, unknown> = {}) => {
  const res = (await client.callTool({ name, arguments: args })) as { content: { type: string; text: string }[]; isError?: boolean }
  return { text: res.content.map((c) => c.text).join('\n'), isError: !!res.isError }
}

beforeAll(async () => {
  client = new Client({ name: 'test', version: '0.0.0' })
  await client.connect(new StdioClientTransport({ command: 'bun', args: [resolve(import.meta.dirname, '../src/bin.ts')] }))
}, 30_000)
afterAll(async () => client?.close())

describe('nusa-admin MCP server', () => {
  it('lists the six tools', async () => {
    const { tools } = await client.listTools()
    expect(tools.map((t) => t.name).sort()).toEqual(['get_component', 'get_guide', 'get_tokens', 'list_components', 'scaffold_page', 'search'])
  })

  it('lists components, optionally by group', async () => {
    const all = await call('list_components')
    expect(all.text).toContain('**NuTable**')
    expect(all.text).toContain('## Forms')
    const charts = await call('list_components', { group: 'Charts' })
    expect(charts.text).toContain('NuGeoMap')
    expect(charts.text).not.toContain('NuTable')
  })

  it('returns a component API with props, events, slots and a real example', async () => {
    const { text } = await call('get_component', { name: 'table' })
    expect(text).toMatch(/^# NuTable/)
    expect(text).toContain('| `pageSize` | `number \\| undefined` | `10` |')
    expect(text).toContain('`update:selected`')
    expect(text).toContain('`bulk`')
    expect(text).toContain('cell-<key>')
    expect(text).toMatch(/From the demo page `\/[^`]*`/)
    expect(text).toContain('```vue\n<NuTable')
  })

  it('reports unknown components as errors with suggestions', async () => {
    const res = await call('get_component', { name: 'NuSpaceship' })
    expect(res.isError).toBe(true)
    expect(res.text).toContain('NuButton')
  })

  it('searches components, APIs and guides', async () => {
    const { text } = await call('search', { query: 'date range' })
    expect(text).toContain('NuDatePicker')
    const server = await call('search', { query: 'server side' })
    expect(server.text).toMatch(/Tables › Server-side data/)
    const api = await call('search', { query: 'validation rules' })
    expect(api.text).toContain('rules')
  })

  it('serves guides, the API page and tokens', async () => {
    expect((await call('get_guide', { slug: 'forms' })).text).toContain('useForm')
    expect((await call('get_guide', { slug: 'api' })).text).toContain('filterMenu(menu')
    expect((await call('get_guide', { slug: 'nope' })).isError).toBe(true)
    expect((await call('get_tokens')).text).toContain('--nu-primary:')
  })

  it('scaffolds pages', async () => {
    const { text } = await call('scaffold_page', { kind: 'list', entity: 'customer', fields: ['name', 'email', 'status'] })
    expect(text).toContain('File: `src/pages/Customers.vue`')
    expect(text).toContain('<NuTable v-model:selected="selected"')
    expect(text).toContain("path: 'customers'")
  })

  it('exposes guides and components as resources', async () => {
    const { resources } = await client.listResources()
    expect(resources.map((r) => r.uri)).toContain('nusa-admin://guide/theming')
    const res = await client.readResource({ uri: 'nusa-admin://component/NuButton' })
    expect((res.contents[0] as { text: string }).text).toMatch(/^# NuButton/)
  })
})
