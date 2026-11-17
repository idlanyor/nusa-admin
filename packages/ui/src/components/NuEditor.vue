<script setup lang="ts">
import { t } from '../composables/useLocale'
import { onBeforeUnmount, onMounted, reactive, ref, useId, watch } from 'vue'
import './form.css'

/**
 * Lightweight rich-text editor (contenteditable). The model is HTML written by the user;
 * sanitize it on the server before showing it to anyone else.
 */
const props = withDefaults(defineProps<{ label?: string; placeholder?: string; hint?: string; error?: string; minHeight?: string; disabled?: boolean }>(), {
  minHeight: '160px',
})
const model = defineModel<string>({ default: '' })

const id = useId()
const editor = ref<HTMLElement | null>(null)
const state = reactive<Record<string, boolean>>({})

const TOOLS = [
  { cmd: 'bold', label: 'bold', glyph: 'B', style: 'font-weight:800' },
  { cmd: 'italic', label: 'italic', glyph: 'I', style: 'font-style:italic;font-family:serif' },
  { cmd: 'underline', label: 'underline', glyph: 'U', style: 'text-decoration:underline' },
  { cmd: 'strikeThrough', label: 'strike', glyph: 'S', style: 'text-decoration:line-through' },
  { sep: true },
  { cmd: 'formatBlock', arg: 'h2', label: 'heading', glyph: 'H2', style: 'font-weight:700' },
  { cmd: 'formatBlock', arg: 'blockquote', label: 'quote', glyph: '“', style: 'font-weight:800;font-size:16px' },
  { cmd: 'insertUnorderedList', label: 'bulletList', glyph: '•≡' },
  { cmd: 'insertOrderedList', label: 'numberedList', glyph: '1≡' },
  { sep: true },
  { cmd: 'createLink', label: 'link', glyph: '🔗' },
  { cmd: 'removeFormat', label: 'clearFormat', glyph: 'Tx' },
] as const

function exec(cmd: string, arg?: string) {
  if (props.disabled) return
  editor.value?.focus()
  if (cmd === 'createLink') {
    const url = window.prompt(t('linkUrl'), 'https://')
    if (!url || url === 'https://') return
    arg = url
  }
  document.execCommand(cmd, false, arg)
  sync()
}
function sync() {
  if (editor.value) model.value = editor.value.innerHTML === '<br>' ? '' : editor.value.innerHTML
  refreshState()
}
function refreshState() {
  if (!editor.value?.contains(document.getSelection()?.anchorNode ?? null)) return
  for (const t of TOOLS) if ('cmd' in t && !('arg' in t)) state[t.cmd] = document.queryCommandState(t.cmd)
}

watch(model, (html) => {
  if (editor.value && editor.value.innerHTML !== html) editor.value.innerHTML = html
})
onMounted(() => {
  if (editor.value) editor.value.innerHTML = model.value
  document.addEventListener('selectionchange', refreshState)
})
onBeforeUnmount(() => document.removeEventListener('selectionchange', refreshState))
</script>

<template>
  <div class="nu-field nu-editor">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-editor__box" :class="{ 'is-invalid': error, 'is-disabled': disabled }">
      <div class="nu-editor__toolbar" role="toolbar" :aria-label="t('formatting', { label: label ?? t('editor') })">
        <template v-for="(tool, i) in TOOLS" :key="i">
          <span v-if="'sep' in tool" class="nu-editor__sep" />
          <button
            v-else
            type="button"
            class="nu-editor__tool"
            :class="{ 'is-on': state[tool.cmd] }"
            :aria-pressed="'arg' in tool ? undefined : !!state[tool.cmd]"
            :aria-label="t(tool.label)"
            :title="t(tool.label)"
            :disabled="disabled"
            @mousedown.prevent
            @click="exec(tool.cmd, 'arg' in tool ? tool.arg : undefined)"
          >
            <span :style="'style' in tool ? tool.style : undefined">{{ tool.glyph }}</span>
          </button>
        </template>
      </div>
      <div
        :id="id"
        ref="editor"
        class="nu-editor__area"
        :contenteditable="!disabled"
        role="textbox"
        aria-multiline="true"
        :aria-invalid="!!error || undefined"
        :data-placeholder="placeholder"
        :style="{ minHeight }"
        @input="sync"
        @blur="sync"
      />
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-editor__box { border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: var(--nu-surface); }
.nu-editor__box:focus-within { border-color: var(--nu-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--nu-primary) 18%, transparent); }
.nu-editor__box.is-invalid { border-color: var(--nu-danger); }
.nu-editor__box.is-disabled { opacity: 0.6; }
.nu-editor__toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 4px; border-bottom: 1px solid var(--nu-border); background: var(--nu-surface-2); border-radius: var(--nu-radius-sm) var(--nu-radius-sm) 0 0; }
.nu-editor__tool {
  min-width: 28px;
  height: 26px;
  padding: 0 6px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--nu-text);
  font-size: 13px;
  cursor: pointer;
}
.nu-editor__tool:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-text) 9%, transparent); }
.nu-editor__tool.is-on { background: color-mix(in srgb, var(--nu-primary) 15%, transparent); color: var(--nu-primary); }
.nu-editor__sep { width: 1px; margin: 4px 3px; background: var(--nu-border); }
.nu-editor__area { padding: 10px 12px; outline: 0; line-height: 1.6; overflow-wrap: anywhere; }
.nu-editor__area:empty::before { content: attr(data-placeholder); color: color-mix(in srgb, var(--nu-text-muted) 75%, transparent); pointer-events: none; }
.nu-editor__area :is(h2) { margin: 6px 0; font-size: 18px; }
.nu-editor__area :is(ul, ol) { margin: 4px 0; padding-inline-start: 22px; }
.nu-editor__area blockquote { margin: 6px 0; padding-inline-start: 10px; border-inline-start: 3px solid var(--nu-border); color: var(--nu-text-muted); }
.nu-editor__area p { margin: 0 0 6px; }
</style>
