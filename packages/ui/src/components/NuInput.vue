<script setup lang="ts">
import { useId } from 'vue'
import type { NuSize } from '../types'
import './form.css'

defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    label?: string
    type?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: NuSize
    disabled?: boolean
    required?: boolean
  }>(),
  { type: 'text', size: 'md' },
)
const model = defineModel<string | number>()
const id = useId()
</script>

<template>
  <div class="nu-field">
    <label v-if="label" class="nu-field__label" :for="id">
      {{ label }} <span v-if="required" class="nu-field__required" aria-hidden="true">*</span>
    </label>
    <div class="nu-control" :class="[`nu-control--${size}`, { 'is-invalid': error, 'is-disabled': disabled }]">
      <span v-if="$slots.prefix" class="nu-control__affix"><slot name="prefix" /></span>
      <input
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
