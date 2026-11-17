<script setup lang="ts">
import { t } from '../composables/useLocale'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import type { NuOption } from '../types'
import NuIcon from './NuIcon.vue'
import './form.css'

type Value = string | number

const props = withDefaults(
  defineProps<{
    options: NuOption[]
    multiple?: boolean
    label?: string
    placeholder?: string
    searchPlaceholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    clearable?: boolean
    emptyText?: string
  }>(),
  {},
)
const model = defineModel<Value | Value[] | null>({ default: null })
const emit = defineEmits<{ blur: [] }>()

const id = useId()
const listId = `${id}-list`
const open = ref(false)
const query = ref('')
const active = ref(0)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const search = ref<HTMLInputElement | null>(null)

const selected = computed<Value[]>(() =>
  props.multiple ? (Array.isArray(model.value) ? model.value : []) : model.value == null || model.value === '' ? [] : [model.value as Value],
)
const selectedOptions = computed(() => selected.value.map((v) => props.options.find((o) => o.value === v)).filter(Boolean) as NuOption[])
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.options.filter((o) => o.label.toLowerCase().includes(q)) : props.options
})

async function show() {
  if (props.disabled) return
  open.value = true
  query.value = ''
  const first = filtered.value.findIndex((o) => selected.value.includes(o.value))
  active.value = Math.max(0, first)
  await nextTick()
  search.value?.focus()
}
function hide(refocus = false) {
  if (!open.value) return
  open.value = false
  emit('blur')
  if (refocus) trigger.value?.focus()
}
function choose(o: NuOption) {
  if (o.disabled) return
  if (props.multiple) {
    model.value = selected.value.includes(o.value) ? selected.value.filter((v) => v !== o.value) : [...selected.value, o.value]
  } else {
    model.value = o.value
    hide(true)
  }
}
function unselect(v: Value) {
  model.value = props.multiple ? selected.value.filter((x) => x !== v) : null
}
function clear() {
  model.value = props.multiple ? [] : null
}
function onKey(e: KeyboardEvent) {
  const n = filtered.value.length
  if (e.key === 'ArrowDown') (e.preventDefault(), (active.value = n ? (active.value + 1) % n : 0))
  else if (e.key === 'ArrowUp') (e.preventDefault(), (active.value = n ? (active.value - 1 + n) % n : 0))
  else if (e.key === 'Enter') {
    e.preventDefault()
    const o = filtered.value[active.value]
    if (o) choose(o)
  } else if (e.key === 'Escape') (e.preventDefault(), e.stopPropagation(), hide(true))
  else if (e.key === 'Tab') hide()
}
function onTriggerKey(e: KeyboardEvent) {
  if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) (e.preventDefault(), show())
  else if (e.key === 'Backspace' && props.multiple && selected.value.length) unselect(selected.value[selected.value.length - 1]!)
}
function onDoc(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) hide()
}
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="nu-field nu-combo" :class="{ 'is-open': open }">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-control nu-combo__control" :class="{ 'is-invalid': error, 'is-disabled': disabled }">
      <div
        :id="id"
        ref="trigger"
        class="nu-combo__trigger"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-invalid="!!error || undefined"
        :aria-disabled="disabled || undefined"
        @click="open ? hide() : show()"
        @keydown="onTriggerKey"
      >
        <template v-if="selectedOptions.length">
          <template v-if="multiple">
            <span v-for="o in selectedOptions" :key="o.value" class="nu-tag-input__tag">
              {{ o.label }}
              <button type="button" :aria-label="t('remove', { label: o.label })" @click.stop="unselect(o.value)"><NuIcon name="x" :size="12" /></button>
            </span>
          </template>
          <span v-else class="nu-combo__value">{{ selectedOptions[0]!.label }}</span>
        </template>
        <span v-else class="nu-combo__placeholder">{{ placeholder ?? t('selectPlaceholder') }}</span>
      </div>
      <button v-if="clearable && selected.length && !disabled" class="nu-combo__clear" type="button" :aria-label="t('clearSelection')" @click="clear">
        <NuIcon name="x" :size="14" />
      </button>
      <span class="nu-control__affix"><NuIcon name="chevron-down" :size="16" /></span>
    </div>
    <div v-if="open" class="nu-combo__popover">
      <div class="nu-combo__search">
        <NuIcon name="search" :size="14" />
        <input
          ref="search"
          v-model="query"
          :placeholder="searchPlaceholder ?? t('search')"
          :aria-label="searchPlaceholder ?? t('search')"
          :aria-controls="listId"
          :aria-activedescendant="filtered[active] ? `${id}-o-${active}` : undefined"
          @keydown="onKey"
          @input="active = 0"
        />
      </div>
      <ul :id="listId" class="nu-combo__list" role="listbox" :aria-multiselectable="multiple || undefined">
        <li
          v-for="(o, i) in filtered"
          :id="`${id}-o-${i}`"
          :key="o.value"
          class="nu-combo__option"
          :class="{ 'is-active': i === active, 'is-selected': selected.includes(o.value), 'is-disabled': o.disabled }"
          role="option"
          :aria-selected="selected.includes(o.value)"
          :aria-disabled="o.disabled || undefined"
          @pointerenter="active = i"
          @click="choose(o)"
        >
          <span class="nu-grow">{{ o.label }}</span>
          <NuIcon v-if="selected.includes(o.value)" name="check" :size="14" />
        </li>
        <li v-if="!filtered.length" class="nu-combo__empty">{{ emptyText ?? t('noMatches') }}</li>
      </ul>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-combo { position: relative; }
.nu-combo__control { padding-inline-end: 8px; }
.nu-combo__trigger {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 3px 0;
  outline: 0;
  cursor: pointer;
}
.nu-control.is-disabled .nu-combo__trigger { cursor: not-allowed; }
.nu-combo__value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nu-combo__placeholder { color: color-mix(in srgb, var(--nu-text-muted) 75%, transparent); }
.nu-combo__clear { display: grid; padding: 2px; border: 0; border-radius: 3px; background: transparent; color: var(--nu-text-muted); cursor: pointer; }
.nu-combo__clear:hover { color: var(--nu-text); }
.nu-combo__popover {
  position: absolute;
  top: 100%;
  inset-inline-start: 0;
  inset-inline-end: 0;
  z-index: 65;
  margin-top: 4px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-lg);
}
.nu-combo__search { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-bottom: 1px solid var(--nu-border); color: var(--nu-text-muted); }
.nu-combo__search input { flex: 1; min-width: 0; height: 26px; border: 0; outline: 0; background: transparent; color: var(--nu-text); }
.nu-combo__list { max-height: 240px; margin: 0; padding: 4px; overflow-y: auto; list-style: none; }
.nu-combo__option { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: var(--nu-radius-sm); cursor: pointer; }
.nu-combo__option.is-active { background: color-mix(in srgb, var(--nu-text) 7%, transparent); }
.nu-combo__option.is-selected { color: var(--nu-primary); font-weight: 600; }
.nu-combo__option.is-disabled { opacity: 0.5; cursor: not-allowed; }
.nu-combo__empty { padding: 8px; color: var(--nu-text-muted); font-size: 13px; }
</style>
