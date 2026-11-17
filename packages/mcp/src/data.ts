import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface PropMeta { name: string; type: string; required: boolean; default?: string; description: string }
export interface ComponentMeta {
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
export interface Meta {
  package: string
  version: string
  components: ComponentMeta[]
  composables: { name: string; signature: string; description: string }[]
  types: Record<string, string>
  tokens: { name: string; value: string }[]
}
export interface Guide { slug: string; title: string; body: string }

/** data/ sits next to src/ and dist/; inside the repo fall back to the sources. */
function dataDir() {
  const here = dirname(fileURLToPath(import.meta.url))
  for (const dir of [resolve(here, '../data'), resolve(here, '../../data')]) if (existsSync(join(dir, 'components.json'))) return dir
  return null
}

export function loadData(): { meta: Meta; guides: Guide[] } {
  const dir = dataDir()
  const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
  const metaPath = dir ? join(dir, 'components.json') : join(repo, 'packages/ui/meta/components.json')
  const guideDir = dir ? join(dir, 'guide') : join(repo, 'docs/guide')
  const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as Meta
  const guides = readdirSync(guideDir)
    .sort()
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const body = readFileSync(join(guideDir, f), 'utf8')
      return { slug: f.replace(/\.md$/, ''), title: body.match(/^# (.+)$/m)?.[1] ?? f, body }
    })
  return { meta, guides }
}
