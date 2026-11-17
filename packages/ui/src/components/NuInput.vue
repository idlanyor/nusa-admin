<script setup lang="ts">
import { computed, useId } from 'vue'
import { applyMask } from '../utils/mask'
import type { NuSize } from '../types'
import './form.css'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    label?: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: NuSize
    disabled?: boolean
    required?: boolean
    /** Input mask: `9` digit, `a` letter, `*` either; other characters are literals. */
    mask?: string
  }>(),
  { type: 'text', size: 'md' },
)
const model = defineModel<string | number>()
const id = useId()
const numericMask = computed(() => !!props.mask && /^[^a*]*$/.test(props.mask) && /9/.test(props.mask))

function onMaskedInput(e: Event) {
  const el = e.target as HTMLInputElement
  const atEnd = el.selectionStart === el.value.length
  const next = applyMask(el.value, props.mask!)
  el.value = next
  if (atEnd) el.setSelectionRange(next.length, next.length)
  model.value = next
}
</script>

<template>
  <div class="nu-field">
    <label v-if="label" class="nu-field__label" :for="id">
      {{ label }} <span v-if="required" class="nu-field__required" aria-hidden="true">*</span>
    </label>
    <div class="nu-control" :class="[`nu-control--${size}`, { 'is-invalid': error, 'is-disabled': disabled }]">
      <span v-if="$slots.prefix" class="nu-control__affix"><slot name="prefix" /></span>
      <input
        v-if="mask"
        :id="id"
        :value="model"
        v-bind="$attrs"
        class="nu-control__input"
        :type="type"
        :inputmode="numericMask ? 'numeric' : undefined"
        :placeholder="placeholder ?? mask.replace(/[9a*]/g, '_')"
        :maxlength="mask.length"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
        @input="onMaskedInput"
      />
      <input
        v-else
        :id="id"
        v-model="model"
        v-bind="$attrs"
        class="nu-control__input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
      />
      <span v-if="$slots.suffix" class="nu-control__affix"><slot name="suffix" /></span>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>
