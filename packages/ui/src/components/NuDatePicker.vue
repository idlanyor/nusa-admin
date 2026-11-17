<script setup lang="ts">
import { t, useLocale } from '../composables/useLocale'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import NuCalendar from './NuCalendar.vue'
import NuIcon from './NuIcon.vue'
import './form.css'

/** Single date (`YYYY-MM-DD`) or, with `range`, a `[start, end]` pair. */
type Value = string | [string, string] | null

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    disabled?: boolean
    range?: boolean
    clearable?: boolean
    locale?: string
    weekStart?: 0 | 1
  }>(),
  { weekStart: 1 },
)
const model = defineModel<Value>({ default: null })
const emit = defineEmits<{ blur: [] }>()

const id = useId()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const calendar = ref<InstanceType<typeof NuCalendar> | null>(null)
/** First click of a range, waiting for the second. */
const pending = ref<string | null>(null)

const { locale: currentLocale } = useLocale()
const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(props.locale ?? currentLocale.value, { day: 'numeric', month: 'short', year: 'numeric' })
const display = computed(() => {
  const v = model.value
  if (!v) return ''
  return Array.isArray(v) ? `${fmt(v[0])} – ${fmt(v[1])}` : fmt(v)
})
const highlight = computed<[string, string] | null>(() => {
  if (pending.value) return [pending.value, pending.value]
  return props.range && Array.isArray(model.value) ? model.value : null
})
const selectedDay = computed(() => (typeof model.value === 'string' ? model.value : undefined))

async function show() {
  if (props.disabled) return
  open.value = true
  pending.value = null
  await nextTick()
  const anchor = Array.isArray(model.value) ? model.value[0] : model.value
  if (anchor) calendar.value?.showMonth(anchor)
}
function hide(refocus = false) {
  if (!open.value) return
  open.value = false
  pending.value = null
  emit('blur')
  if (refocus) trigger.value?.focus()
}
function pick(day: string) {
  if (!props.range) {
    model.value = day
    hide(true)
    return
  }
  if (!pending.value) {
    pending.value = day
    return
  }
  const [a, b] = [pending.value, day].sort() as [string, string]
  model.value = [a, b]
  hide(true)
}
function onDoc(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) hide()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) (e.stopPropagation(), hide(true))
}
onMounted(() => document.addEventListener('pointerdown', onDoc))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDoc))
</script>

<template>
  <div ref="root" class="nu-field nu-datepicker" @keydown="onKey">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-control" :class="{ 'is-invalid': error, 'is-disabled': disabled }">
      <span class="nu-control__affix"><NuIcon name="calendar" :size="16" /></span>
      <button
        :id="id"
        ref="trigger"
        class="nu-datepicker__trigger"
        type="button"
        :disabled="disabled"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-invalid="!!error || undefined"
        @click="open ? hide() : show()"
      >
        <span v-if="display">{{ display }}</span>
        <span v-else class="nu-combo__placeholder">{{ placeholder ?? (range ? t('selectDateRange') : t('selectDate')) }}</span>
      </button>
      <button v-if="clearable && model && !disabled" class="nu-combo__clear" type="button" :aria-label="t('clearDate')" @click="model = null">
        <NuIcon name="x" :size="14" />
      </button>
    </div>
    <div v-if="open" class="nu-datepicker__popover" role="dialog" :aria-label="range ? t('chooseDateRange') : t('chooseDate')">
      <NuCalendar
        ref="calendar"
        compact
        :model-value="selectedDay"
        :range="highlight"
        :locale="locale ?? currentLocale"
        :week-start="weekStart"
        @select="pick"
      />
      <p v-if="range" class="nu-datepicker__hint">{{ pending ? t('pickEnd') : t('pickStart') }}</p>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-datepicker { position: relative; }
.nu-datepicker__trigger {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--nu-text);
  text-align: start;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nu-datepicker__popover {
  position: absolute;
  top: 100%;
  inset-inline-start: 0;
  z-index: 65;
  width: 290px;
  max-width: calc(100vw - 24px);
  margin-top: 4px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-lg);
}
.nu-datepicker__hint { padding: 0 14px 10px; font-size: 12px; color: var(--nu-text-muted); }
</style>
