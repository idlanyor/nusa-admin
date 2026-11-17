<script setup lang="ts">
import { computed, useId } from 'vue'
import { t } from '../composables/useLocale'
import NuIcon from './NuIcon.vue'
import './form.css'

/** Number field with −/+ steppers, min/max clamping and optional prefix/suffix text. */
const props = withDefaults(
  defineProps<{ label?: string; hint?: string; error?: string; min?: number; max?: number; step?: number; disabled?: boolean; prefix?: string; suffix?: string; precision?: number }>(),
  { step: 1 },
)
const model = defineModel<number | null>({ default: null })
const emit = defineEmits<{ blur: [] }>()
const id = useId()

const decimals = computed(() => props.precision ?? (String(props.step).split('.')[1]?.length ?? 0))
function clamp(v: number) {
  let n = v
  if (props.min !== undefined) n = Math.max(props.min, n)
  if (props.max !== undefined) n = Math.min(props.max, n)
  return Number(n.toFixed(decimals.value))
}
function bump(dir: 1 | -1) {
  model.value = clamp((model.value ?? props.min ?? 0) + dir * props.step)
}
function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(',', '.')
  model.value = raw === '' || raw === '-' ? null : Number.isNaN(Number(raw)) ? model.value : Number(raw)
}
function onBlur() {
  if (model.value !== null) model.value = clamp(model.value)
  emit('blur')
}
</script>

<template>
  <div class="nu-field">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-control nu-number" :class="{ 'is-invalid': error, 'is-disabled': disabled }">
      <button type="button" class="nu-number__btn" :aria-label="t('decrease')" :disabled="disabled || (min !== undefined && (model ?? min) <= min)" @click="bump(-1)">
        <NuIcon name="minus" :size="14" />
      </button>
      <span v-if="prefix" class="nu-control__affix">{{ prefix }}</span>
      <input
        :id="id"
        class="nu-control__input nu-number__input"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        :value="model ?? ''"
        :aria-valuenow="model ?? undefined"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-invalid="!!error || undefined"
        :disabled="disabled"
        @input="onInput"
        @blur="onBlur"
        @keydown.up.prevent="bump(1)"
        @keydown.down.prevent="bump(-1)"
      />
      <span v-if="suffix" class="nu-control__affix">{{ suffix }}</span>
      <button type="button" class="nu-number__btn" :aria-label="t('increase')" :disabled="disabled || (max !== undefined && (model ?? -Infinity) >= max)" @click="bump(1)">
        <NuIcon name="plus" :size="14" />
      </button>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-number { padding-inline: 2px; }
.nu-number__input { text-align: center; font-variant-numeric: tabular-nums; }
.nu-number__btn { display: grid; place-items: center; width: 28px; height: 28px; border: 0; border-radius: var(--nu-radius-sm); background: transparent; color: var(--nu-text-muted); cursor: pointer; }
.nu-number__btn:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-text) 8%, transparent); color: var(--nu-text); }
.nu-number__btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
