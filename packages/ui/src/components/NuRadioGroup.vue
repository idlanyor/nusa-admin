<script setup lang="ts">
import { useId } from 'vue'
import type { NuOption } from '../types'
import './form.css'

defineProps<{ options: NuOption[]; label?: string; inline?: boolean; disabled?: boolean; hint?: string; error?: string }>()
const model = defineModel<string | number>()
const name = useId()
</script>

<template>
  <fieldset class="nu-field nu-radio-group" :disabled="disabled">
    <legend v-if="label" class="nu-field__label">{{ label }}</legend>
    <div class="nu-radio-group__options" :class="{ 'is-inline': inline }">
      <label v-for="o in options" :key="o.value" class="nu-radio" :class="{ 'is-disabled': disabled || o.disabled }">
        <input v-model="model" class="nu-radio__input" type="radio" :name="name" :value="o.value" :disabled="o.disabled" :aria-invalid="!!error || undefined" />
        <span class="nu-radio__dot" />
        <span>{{ o.label }}</span>
      </label>
    </div>
    <span v-if="error" class="nu-field__error">{{ error }}</span>
    <span v-else-if="hint" class="nu-field__hint">{{ hint }}</span>
  </fieldset>
</template>

<style>
.nu-radio-group { margin: 0; padding: 0; border: 0; }
.nu-radio-group legend { padding: 0; margin-bottom: 4px; }
.nu-radio-group__options { display: flex; flex-direction: column; gap: 6px; }
.nu-radio-group__options.is-inline { flex-direction: row; flex-wrap: wrap; gap: 6px 16px; }
.nu-radio { position: relative; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.nu-radio.is-disabled { opacity: 0.55; cursor: not-allowed; }
.nu-radio__input { position: absolute; opacity: 0; width: 0; height: 0; }
.nu-radio__dot {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid color-mix(in srgb, var(--nu-text) 35%, var(--nu-border));
  border-radius: 50%;
  background: var(--nu-surface);
}
.nu-radio__dot::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--nu-primary); transform: scale(0); transition: transform 0.12s ease; }
.nu-radio__input:checked + .nu-radio__dot { border-color: var(--nu-primary); }
.nu-radio__input:checked + .nu-radio__dot::after { transform: scale(1); }
.nu-radio__input:focus-visible + .nu-radio__dot { outline: 2px solid color-mix(in srgb, var(--nu-primary) 60%, transparent); outline-offset: 2px; }
</style>
