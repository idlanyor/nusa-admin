<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import './form.css'

/**
 * Plain-text code editor: line numbers, Tab / Shift+Tab indentation and auto-indent on Enter.
 * No syntax highlighting — swap in CodeMirror or Monaco if you need it.
 */
const props = withDefaults(
  defineProps<{ label?: string; hint?: string; error?: string; rows?: number; tabSize?: number; readonly?: boolean; language?: string }>(),
  { rows: 10, tabSize: 2 },
)
const model = defineModel<string>({ default: '' })

const id = useId()
const area = ref<HTMLTextAreaElement | null>(null)
const gutter = ref<HTMLElement | null>(null)
const lineCount = computed(() => Math.max(1, model.value.split('\n').length))
const indent = computed(() => ' '.repeat(props.tabSize))

/** Replace the selection with `text`, keeping it undoable where the browser allows. */
function insert(el: HTMLTextAreaElement, text: string, selectStart?: number, selectEnd?: number) {
  el.focus()
  if (!document.execCommand('insertText', false, text)) el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end')
  if (selectStart !== undefined) el.setSelectionRange(selectStart, selectEnd ?? selectStart)
  model.value = el.value
}

function onKeydown(e: KeyboardEvent) {
  const el = area.value
  if (!el || props.readonly) return
  const { selectionStart: start, selectionEnd: end, value } = el
  if (e.key === 'Tab') {
    e.preventDefault()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    if (start === end && !e.shiftKey) return insert(el, indent.value)
    // Indent or outdent every selected line.
    el.setSelectionRange(lineStart, end)
    const block = value.slice(lineStart, end)
    const lines = block.split('\n')
    const next = e.shiftKey
      ? lines.map((l) => l.replace(new RegExp(`^ {1,${props.tabSize}}`), '')).join('\n')
      : lines.map((l) => indent.value + l).join('\n')
    insert(el, next, lineStart, lineStart + next.length)
  } else if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault()
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const current = value.slice(lineStart, start)
    let pad = current.match(/^\s*/)![0]
    if (/[{[(:]\s*$/.test(current)) pad += indent.value
    insert(el, '\n' + pad)
  }
}
function syncScroll() {
  if (gutter.value && area.value) gutter.value.scrollTop = area.value.scrollTop
}
</script>

<template>
  <div class="nu-field nu-code">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}<span v-if="language" class="nu-code__lang">{{ language }}</span></label>
    <div class="nu-code__box" :class="{ 'is-invalid': error }">
      <div ref="gutter" class="nu-code__gutter" aria-hidden="true"><span v-for="n in lineCount" :key="n">{{ n }}</span></div>
      <textarea
        :id="id"
        ref="area"
        v-model="model"
        class="nu-code__area"
        :rows="rows"
        :readonly="readonly"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        wrap="off"
        :aria-invalid="!!error || undefined"
        @keydown="onKeydown"
        @scroll="syncScroll"
      />
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-code__lang { margin-inline-start: 6px; padding: 0 5px; border-radius: 3px; background: var(--nu-surface-2); color: var(--nu-text-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; }
.nu-code__box {
  display: flex;
  direction: ltr;
  overflow: hidden;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface-2);
  font-family: var(--nu-font-mono);
  font-size: 12.5px;
  line-height: 1.6;
}
.nu-code__box:focus-within { border-color: var(--nu-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--nu-primary) 18%, transparent); }
.nu-code__box.is-invalid { border-color: var(--nu-danger); }
.nu-code__gutter {
  flex: none;
  display: flex;
  flex-direction: column;
  padding: 8px 8px 8px 10px;
  overflow: hidden;
  border-right: 1px solid var(--nu-border);
  color: var(--nu-text-muted);
  text-align: right;
  user-select: none;
  opacity: 0.7;
}
.nu-code__area {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border: 0;
  outline: 0;
  resize: vertical;
  background: transparent;
  color: var(--nu-text);
  font: inherit;
  line-height: inherit;
  white-space: pre;
  tab-size: 2;
}
</style>
