import { Marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import ts from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('ts', ts)
hljs.registerLanguage('typescript', ts)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('html', xml)

export function highlight(code: string, lang = 'vue') {
  return hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value
}

export const slugify = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')

/** Renders our own guide files (trusted content from the repo). */
const md = new Marked({
  renderer: {
    code({ text, lang }) {
      return `<pre class="code-block"><code class="hljs">${highlight(text, lang || 'vue')}</code></pre>`
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      return `<h${depth} id="${slugify(text)}">${text}</h${depth}>`
    },
  },
})

export function renderMarkdown(src: string) {
  return (md.parse(src) as string).replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>')
}
