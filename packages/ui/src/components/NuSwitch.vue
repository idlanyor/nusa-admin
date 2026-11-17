<script setup lang="ts">
defineProps<{ label?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="nu-switch" :class="{ 'is-disabled': disabled }">
    <input v-model="model" class="nu-switch__input" type="checkbox" role="switch" :disabled="disabled" />
    <span class="nu-switch__track"><span class="nu-switch__thumb" /></span>
    <span v-if="label || $slots.default" class="nu-switch__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style>
.nu-switch { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.nu-switch.is-disabled { opacity: 0.55; cursor: not-allowed; }
.nu-switch__input { position: absolute; opacity: 0; width: 0; height: 0; }
.nu-switch__track {
  flex: none;
  width: 36px;
  height: 20px;
  padding: 2px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--nu-text) 25%, var(--nu-border));
  transition: background var(--nu-transition);
}
.nu-switch__thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform var(--nu-transition);
}
.nu-switch__input:checked + .nu-switch__track { background: var(--nu-primary); }
.nu-switch__input:checked + .nu-switch__track .nu-switch__thumb { transform: translateX(16px); }
.nu-switch__input:focus-visible + .nu-switch__track {
  outline: 2px solid color-mix(in srgb, var(--nu-primary) 60%, transparent);
  outline-offset: 2px;
}
</style>
