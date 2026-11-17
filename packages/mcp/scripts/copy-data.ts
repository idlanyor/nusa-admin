/** Bundle the component metadata and guides into ./data so the published server is self-contained. */
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'

const here = resolve(import.meta.dirname, '..')
const repo = resolve(here, '../..')
rmSync(join(here, 'data'), { recursive: true, force: true })
mkdirSync(join(here, 'data'), { recursive: true })
cpSync(join(repo, 'packages/ui/meta/components.json'), join(here, 'data/components.json'))
cpSync(join(repo, 'docs/guide'), join(here, 'data/guide'), { recursive: true })
console.log('mcp data → packages/mcp/data')
