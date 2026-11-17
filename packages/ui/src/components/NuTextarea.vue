<script setup lang="ts">
import { useId } from 'vue'
import './form.css'

defineOptions({ inheritAttrs: false })
withDefaults(
  defineProps<{ label?: string; placeholder?: string; hint?: string; error?: string; rows?: number; disabled?: boolean; required?: boolean }>(),
  { rows: 4 },
)
const model = defineModel<string>()
const id = useId()
</script>

<template>
  <div class="nu-field">
    <label v-if="label" class="nu-field__label" :for="id">
      {{ label }} <span v-if="required" class="nu-field__required" aria-hidden="true">*</span>
    </label>
    <div class="nu-control" :class="{ 'is-invalid': error, 'is-disabled': disabled }">
      <textarea
        :id="id"
        v-model="model"
        v-bind="$attrs"
        class="nu-control__input"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
      />
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>
