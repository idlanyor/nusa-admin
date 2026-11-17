<script setup lang="ts">
import { useId } from 'vue'
import type { NuOption, NuSize } from '../types'
import NuIcon from './NuIcon.vue'
import './form.css'

defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{
    options: NuOption[]
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: NuSize
    disabled?: boolean
    required?: boolean
  }>(),
  { size: 'md' },
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
      <select :id="id" v-model="model" v-bind="$attrs" class="nu-control__input" :disabled="disabled" :required="required">
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
      </select>
      <span class="nu-control__affix"><NuIcon name="chevron-down" :size="16" /></span>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>
