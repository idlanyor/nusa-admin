import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const repo = (p: string) => fileURLToPath(new URL(`../../${p}`, import.meta.url))

/** /llms.txt (index) and /llms-full.txt (everything) built from the same metadata and guides. */
function llmsTxt(): Plugin {
  let base = '/'
  const build = () => {
    const meta = JSON.parse(readFileSync(repo('packages/ui/meta/components.json'), 'utf8'))
    const guides = readdirSync(repo('docs/guide')).sort()
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ slug: f.replace(/\.md$/, ''), body: readFileSync(repo(`docs/guide/${f}`), 'utf8') }))
    const title = (b: string) => b.match(/^# (.+)$/m)?.[1] ?? ''
    const index = [
      '# Nusa Admin',
      '',
      '> Vue 3 + Vite admin template kit: app shell, 71 Nu* components, SVG charts, light/dark themes, design tokens, i18n and RTL. Package: `nusa-admin`.',
      '',
      '## Guides',
      ...guides.map((g) => `- [${title(g.body)}](${base}guide/${g.slug}): ${g.body.split('\n').find((l) => l && !l.startsWith('#')) ?? ''}`),
      '',
      '## Components',
      ...meta.components.map((c: any) => `- [${c.name}](${base}components/${c.name}): ${c.description}`),
      '',
      '## Optional',
      '- [Everything in one file](${base}llms-full.txt)',
      '- [API: composables, helpers, tokens](${base}api)',
    ].join('\n')
    const comp = (c: any) =>
      [
        `## ${c.name}`,
        '',
        c.description,
        '',
        ...c.props.map((p: any) => `- prop \`${p.name}\`${p.required ? ' (required)' : ''}: \`${p.type}\`${p.default ? ` = ${p.default}` : ''}${p.description ? ` — ${p.description}` : ''}`),
        ...c.events.map((e: any) => `- event \`${e.name}\``),
        ...c.slots.map((s: any) => `- slot \`${s.name}\``),
        ...(c.examples[0] ? ['', '```vue', c.examples[0].code, '```'] : []),
      ].join('\n')
    const full = [
      index.split('\n## Guides')[0],
      ...guides.map((g) => g.body),
      '# Components',
      ...meta.components.map(comp),
      '# API',
      ...meta.composables.map((c: any) => `## ${c.name}\n\n${c.description}\n\n\`\`\`ts\n${c.signature}\n\`\`\``),
    ].join('\n\n')
    return { index, full }
  }
  return {
    name: 'llms-txt',
    configResolved(config) {
      base = config.base
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').replace(base, '/')
        if (url !== '/llms.txt' && url !== '/llms-full.txt') return next()
        const { index, full } = build()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(url === '/llms.txt' ? index : full)
      })
    },
    generateBundle() {
      const { index, full } = build()
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: index })
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: full })
    },
  }
}

export default defineConfig({
  // Sub-path deploys (GitHub Pages: /<repo>/ and /<repo>/demo/)
  base: process.env.BASE_PATH ?? '/',
  plugins: [vue(), llmsTxt()],
  resolve: {
    alias: [
      { find: /^nusa-admin\/style\.css$/, replacement: repo('packages/ui/src/styles/index.css') },
      { find: /^nusa-admin$/, replacement: repo('packages/ui/src/index.ts') },
      { find: /^@meta$/, replacement: repo('packages/ui/meta/components.json') },
      { find: /^@guides\//, replacement: repo('docs/guide/') },
    ],
  },
  server: { fs: { allow: [repo('')] } },
})
