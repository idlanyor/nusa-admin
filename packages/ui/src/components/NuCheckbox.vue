<script setup lang="ts">
import NuIcon from './NuIcon.vue'

defineProps<{ label?: string; disabled?: boolean; error?: string }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="nu-check" :class="{ 'is-disabled': disabled, 'is-invalid': error }">
    <input v-model="model" class="nu-check__input" type="checkbox" :disabled="disabled" :aria-invalid="!!error || undefined" />
    <span class="nu-check__box"><NuIcon name="check" :size="12" /></span>
    <span v-if="label || $slots.default" class="nu-check__label"><slot>{{ label }}</slot></span>
    <span v-if="error" class="nu-field__error nu-check__error">{{ error }}</span>
  </label>
</template>

<style>
.nu-check { position: relative; display: inline-flex; align-items: center; gap: 9px; cursor: pointer; }
.nu-check.is-invalid { flex-wrap: wrap; }
.nu-check.is-invalid .nu-check__box { border-color: var(--nu-danger); }
.nu-check__error { flex-basis: 100%; padding-left: 27px; font-size: 12.5px; color: var(--nu-danger); }
.nu-check.is-disabled { opacity: 0.55; cursor: not-allowed; }
.nu-check__input { position: absolute; opacity: 0; width: 0; height: 0; }
.nu-check__box {
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid color-mix(in srgb, var(--nu-text) 35%, var(--nu-border));
  border-radius: 3px;
  background: var(--nu-surface);
  color: transparent;
  transition: background var(--nu-transition), border-color var(--nu-transition);
}
.nu-check__box svg { stroke-width: 3.5; }
.nu-check__input:checked + .nu-check__box {
  border-color: var(--nu-primary);
  background: var(--nu-primary);
  color: var(--nu-on-color);
}
.nu-check__input:focus-visible + .nu-check__box {
  outline: 2px solid color-mix(in srgb, var(--nu-primary) 60%, transparent);
  outline-offset: 2px;
}
</style>
