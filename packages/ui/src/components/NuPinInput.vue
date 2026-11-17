<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { t } from '../composables/useLocale'

/** One-time code / PIN boxes. Typing advances, Backspace goes back, pasting fills every box. Emits `complete`. */
const props = withDefaults(defineProps<{ length?: number; label?: string; error?: string; disabled?: boolean; masked?: boolean; numeric?: boolean }>(), {
  length: 6,
  numeric: true,
})
const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ complete: [code: string] }>()
const boxes = ref<HTMLInputElement[]>([])

const allowed = (c: string) => (props.numeric ? /\d/.test(c) : /[A-Za-z0-9]/.test(c))
function setAt(i: number, ch: string) {
  const chars = model.value.padEnd(props.length, ' ').split('')
  chars[i] = ch || ' '
  model.value = chars.join('').trimEnd()
  if (model.value.replace(/ /g, '').length === props.length) emit('complete', model.value)
}
async function focus(i: number) {
  await nextTick()
  boxes.value[Math.max(0, Math.min(props.length - 1, i))]?.select()
}
function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const ch = el.value.slice(-1)
  if (!allowed(ch)) {
    el.value = model.value[i]?.trim() ?? ''
    return
  }
  setAt(i, props.numeric ? ch : ch.toUpperCase())
  focus(i + 1)
}
function onKey(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !model.value[i]?.trim()) (e.preventDefault(), setAt(i - 1, ''), focus(i - 1))
  else if (e.key === 'ArrowLeft') (e.preventDefault(), focus(i - 1))
  else if (e.key === 'ArrowRight') (e.preventDefault(), focus(i + 1))
}
function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = (e.clipboardData?.getData('text') ?? '').split('').filter(allowed).join('').slice(0, props.length)
  if (!text) return
  model.value = props.numeric ? text : text.toUpperCase()
  if (text.length === props.length) emit('complete', model.value)
  focus(text.length)
}
</script>

<template>
  <div class="nu-field nu-pin">
    <span v-if="label" class="nu-field__label">{{ label }}</span>
    <div class="nu-pin__boxes" role="group" :aria-label="label ?? t('code')">
      <input
        v-for="i in length"
        :key="i"
        ref="boxes"
        class="nu-pin__box"
        :class="{ 'is-invalid': error }"
        :type="masked ? 'password' : 'text'"
        :inputmode="numeric ? 'numeric' : 'text'"
        :autocomplete="i === 1 ? 'one-time-code' : 'off'"
        maxlength="2"
        :value="model[i - 1]?.trim() ?? ''"
        :disabled="disabled"
        :aria-label="t('digitOf', { n: i, total: length })"
        :aria-invalid="!!error || undefined"
        @input="onInput(i - 1, $event)"
        @keydown="onKey(i - 1, $event)"
        @paste="onPaste"
        @focus="($event.target as HTMLInputElement).select()"
      />
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
  </div>
</template>

<style>
.nu-pin__boxes { display: flex; gap: 6px; direction: ltr; }
.nu-pin__box {
  width: 40px;
  height: 44px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.nu-pin__box:focus { outline: 0; border-color: var(--nu-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--nu-primary) 18%, transparent); }
.nu-pin__box.is-invalid { border-color: var(--nu-danger); }
</style>
