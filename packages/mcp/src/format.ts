import type { ComponentMeta, Guide, Meta } from './data'

const cell = (s?: string) => (s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')

export function componentMarkdown(c: ComponentMeta, pkg: string): string {
  const out = [`# ${c.name}`, '', c.description, '', `Group: ${c.group} · Source: \`${c.file}\` · Import: \`import { ${c.name} } from '${pkg}'\``]
  if (c.props.length) {
    out.push('', '## Props', '', '| Prop | Type | Default | Description |', '| --- | --- | --- | --- |')
    for (const p of c.props) out.push(`| \`${p.name}\`${p.required ? ' (required)' : ''} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : ''} | ${cell(p.description)} |`)
  }
  if (c.events.length) {
    out.push('', '## Events', '')
    for (const e of c.events) out.push(`- \`${e.name}\`${e.type ? ` — \`${e.type}\`` : ''}${e.description ? ` — ${e.description}` : ''}`)
  }
  if (c.slots.length) {
    out.push('', '## Slots', '')
    for (const s of c.slots) out.push(`- \`${s.name}\`${s.type && s.type !== '{}' && s.type !== 'any' ? ` — props \`${s.type}\`` : ''}${s.description ? ` — ${s.description}` : ''}`)
  }
  if (c.exposed.length) {
    out.push('', '## Exposed', '')
    for (const x of c.exposed) out.push(`- \`${x.name}\` — \`${x.type}\``)
  }
  if (c.examples.length) {
    out.push('', '## Examples')
    for (const e of c.examples) out.push('', e.route ? `From the demo page \`${e.route}\` (\`${e.file}\`):` : 'Example:', '', '```vue', e.code, '```')
  }
  return out.join('\n')
}

export function componentList(meta: Meta, group?: string): string {
  const list = meta.components.filter((c) => !group || c.group.toLowerCase() === group.toLowerCase())
  const groups = [...new Set(list.map((c) => c.group))]
  return groups
    .map((g) => [`## ${g}`, ...list.filter((c) => c.group === g).map((c) => `- **${c.name}** — ${c.description}`)].join('\n'))
    .join('\n\n')
}

/** Split guides into "## " sections for search. */
export function guideSections(guides: Guide[]) {
  return guides.flatMap((g) => {
    const parts = g.body.split(/^## /m)
    return parts.map((part, i) => {
      const heading = i === 0 ? g.title : part.split('\n')[0]!.trim()
      return { slug: g.slug, title: g.title, heading, text: i === 0 ? part : `## ${part}` }
    })
  })
}

export function search(meta: Meta, guides: Guide[], query: string, limit = 12): string {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return 'Empty query.'
  const score = (hay: string, title: string) => {
    const h = hay.toLowerCase()
    const t = title.toLowerCase()
    if (!words.every((w) => h.includes(w))) return 0
    return words.reduce((s, w) => s + (t.includes(w) ? 5 : 0) + (h.split(w).length - 1), 0)
  }
  const hits: { score: number; line: string }[] = []
  for (const c of meta.components) {
    const hay = [c.name, c.description, c.group, ...c.props.map((p) => `${p.name} ${p.description}`), ...c.slots.map((s) => s.name), ...c.events.map((e) => e.name)].join(' ')
    const s = score(hay, c.name)
    if (s) hits.push({ score: s + 3, line: `- component **${c.name}** (${c.group}) — ${c.description} → get_component("${c.name}")` })
  }
  for (const c of meta.composables) {
    const s = score(`${c.name} ${c.signature} ${c.description}`, c.name)
    if (s) hits.push({ score: s + 2, line: `- api **${c.name}** — ${c.description}\n  \`${c.signature}\`` })
  }
  for (const sec of guideSections(guides)) {
    const s = score(sec.text, sec.heading)
    if (s) hits.push({ score: s, line: `- guide **${sec.title} › ${sec.heading}** → get_guide("${sec.slug}")` })
  }
  hits.sort((a, b) => b.score - a.score)
  return hits.length ? hits.slice(0, limit).map((h) => h.line).join('\n') : `No matches for “${query}”. Try list_components or get_guide("getting-started").`
}
