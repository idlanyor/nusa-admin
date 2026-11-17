<script setup lang="ts">
import { t } from '../composables/useLocale'
import { ref, useId } from 'vue'
import NuIcon from './NuIcon.vue'
import './form.css'

defineProps<{ label?: string; placeholder?: string; hint?: string; error?: string; disabled?: boolean }>()
const model = defineModel<string[]>({ default: () => [] })
const draft = ref('')
const id = useId()

function add() {
  const tag = draft.value.trim().replace(/,$/, '')
  if (tag && !model.value.includes(tag)) model.value = [...model.value, tag]
  draft.value = ''
}
function remove(tag: string) {
  model.value = model.value.filter((t) => t !== tag)
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    add()
  } else if (e.key === 'Backspace' && !draft.value && model.value.length) {
    model.value = model.value.slice(0, -1)
  }
}
</script>

<template>
  <div class="nu-field">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-control nu-tag-input" :class="{ 'is-disabled': disabled, 'is-invalid': error }">
      <span v-for="tag in model" :key="tag" class="nu-tag-input__tag">
        {{ tag }}
        <button type="button" :aria-label="t('remove', { label: tag })" :disabled="disabled" @click="remove(tag)"><NuIcon name="x" :size="12" /></button>
      </span>
      <input :id="id" v-model="draft" class="nu-control__input" :placeholder="model.length ? '' : placeholder" :disabled="disabled" :aria-invalid="!!error || undefined" @keydown="onKey" @blur="add" />
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-tag-input { flex-wrap: wrap; gap: 4px; padding-top: 3px; padding-bottom: 3px; }
.nu-tag-input .nu-control__input { flex: 1 1 80px; padding: 3px 0; }
.nu-tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 3px 2px 7px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--nu-primary) 13%, transparent);
  color: var(--nu-primary);
  font-size: 12.5px;
  font-weight: 600;
}
.nu-tag-input__tag button { display: grid; padding: 1px; border: 0; border-radius: 2px; background: transparent; color: inherit; cursor: pointer; }
.nu-tag-input__tag button:hover { background: color-mix(in srgb, var(--nu-primary) 20%, transparent); }
</style>
