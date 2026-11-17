<script setup lang="ts">
import { t } from '../composables/useLocale'
import { computed, ref } from 'vue'
import type { NuOption } from '../types'
import NuIcon from './NuIcon.vue'

type Value = string | number

/** Dual list box: move options between "available" and "selected". v-model is the selected values. */
const props = withDefaults(
  defineProps<{ options: NuOption[]; titles?: [string, string]; searchable?: boolean; height?: string; disabled?: boolean }>(),
  { searchable: true, height: '220px' },
)
const model = defineModel<Value[]>({ default: () => [] })

const queries = ref(['', ''])
const title = (side: 0 | 1) => props.titles?.[side] ?? (side === 0 ? t('available') : t('selected'))
const checked = ref<[Value[], Value[]]>([[], []])

const sides = computed(() => {
  const chosen = new Set(model.value)
  const left = props.options.filter((o) => !chosen.has(o.value))
  // Keep the right side in the order things were chosen.
  const right = model.value.map((v) => props.options.find((o) => o.value === v)).filter(Boolean) as NuOption[]
  return [left, right].map((list, i) => {
    const q = queries.value[i]!.trim().toLowerCase()
    return { all: list, shown: q ? list.filter((o) => o.label.toLowerCase().includes(q)) : list }
  })
})

function toggle(side: 0 | 1, v: Value, on: boolean) {
  const list = checked.value[side]
  checked.value[side] = on ? [...list, v] : list.filter((x) => x !== v)
}
function move(from: 0 | 1, all = false) {
  const values = all ? sides.value[from]!.shown.filter((o) => !o.disabled).map((o) => o.value) : checked.value[from]
  if (!values.length) return
  model.value = from === 0 ? [...model.value, ...values.filter((v) => !model.value.includes(v))] : model.value.filter((v) => !values.includes(v))
  checked.value[from] = []
}
</script>

<template>
  <div class="nu-transfer" :class="{ 'is-disabled': disabled }">
    <section v-for="side in [0, 1] as const" :key="side" class="nu-transfer__panel">
      <header class="nu-transfer__head">
        <strong>{{ title(side) }}</strong>
        <span class="nu-text-sm nu-text-muted">{{ checked[side].length ? `${checked[side].length}/` : '' }}{{ sides[side]!.all.length }}</span>
      </header>
      <div v-if="searchable" class="nu-transfer__search">
        <NuIcon name="search" :size="14" />
        <input v-model="queries[side]" type="search" :placeholder="t('searchIn', { title: title(side).toLowerCase() })" :aria-label="t('searchIn', { title: title(side) })" :disabled="disabled" />
      </div>
      <ul class="nu-transfer__list" :style="{ height }" :aria-label="title(side)">
        <li v-for="o in sides[side]!.shown" :key="o.value">
          <label class="nu-check" :class="{ 'is-disabled': o.disabled || disabled }">
            <input
              class="nu-check__input"
              type="checkbox"
              :checked="checked[side].includes(o.value)"
              :disabled="o.disabled || disabled"
              @change="toggle(side, o.value, ($event.target as HTMLInputElement).checked)"
            />
            <span class="nu-check__box"><NuIcon name="check" :size="12" /></span>
            <span>{{ o.label }}</span>
          </label>
        </li>
        <li v-if="!sides[side]!.shown.length" class="nu-transfer__empty">{{ t('nothingHere') }}</li>
      </ul>
    </section>
    <div class="nu-transfer__actions">
      <button type="button" class="nu-btn nu-btn--outline nu-btn--sm nu-c-secondary" :disabled="disabled || !checked[0].length" :aria-label="t('addChecked')" @click="move(0)">
        <NuIcon name="chevron-right" :size="16" />
      </button>
      <button type="button" class="nu-btn nu-btn--outline nu-btn--sm nu-c-secondary" :disabled="disabled || !checked[1].length" :aria-label="t('removeChecked')" @click="move(1)">
        <NuIcon name="chevron-left" :size="16" />
      </button>
      <button type="button" class="nu-btn nu-btn--ghost nu-btn--sm nu-c-secondary" :disabled="disabled || !sides[0]!.shown.length" @click="move(0, true)">{{ t('all') }}</button>
      <button type="button" class="nu-btn nu-btn--ghost nu-btn--sm nu-c-secondary" :disabled="disabled || !sides[1]!.shown.length" @click="move(1, true)">{{ t('none') }}</button>
    </div>
  </div>
</template>

<style>
.nu-transfer { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: 10px; align-items: center; }
.nu-transfer > .nu-transfer__panel:nth-of-type(2) { grid-column: 3; grid-row: 1; }
.nu-transfer__actions { grid-column: 2; grid-row: 1; display: flex; flex-direction: column; gap: 6px; }
.nu-transfer__panel { border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); min-width: 0; }
.nu-transfer__head { display: flex; justify-content: space-between; padding: 7px 12px; border-bottom: 1px solid var(--nu-border); background: var(--nu-surface-2); border-radius: var(--nu-radius) var(--nu-radius) 0 0; }
.nu-transfer__search { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-bottom: 1px solid var(--nu-border); color: var(--nu-text-muted); }
.nu-transfer__search input { flex: 1; min-width: 0; height: 24px; border: 0; outline: 0; background: transparent; color: var(--nu-text); }
.nu-transfer__list { margin: 0; padding: 4px 0; overflow-y: auto; list-style: none; }
.nu-transfer__list li { padding: 4px 12px; }
.nu-transfer__list li:hover { background: color-mix(in srgb, var(--nu-text) 4%, transparent); }
.nu-transfer__empty { color: var(--nu-text-muted); font-size: 13px; }
@media (max-width: 640px) {
  .nu-transfer { grid-template-columns: minmax(0, 1fr); }
  .nu-transfer > .nu-transfer__panel:nth-of-type(2) { grid-column: 1; grid-row: 3; }
  .nu-transfer__actions { grid-column: 1; grid-row: 2; flex-direction: row; justify-content: center; }
  .nu-transfer__actions .nu-icon--dir { transform: rotate(90deg); }
}
</style>
