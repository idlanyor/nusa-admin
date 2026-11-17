<script setup lang="ts">
import { computed, useId } from 'vue'
import './form.css'

/** Swatches plus a custom color and hex field. v-model is a #rrggbb string. */
withDefaults(defineProps<{ label?: string; hint?: string; swatches?: string[]; disabled?: boolean }>(), {
  swatches: () => ['#4f46e5', '#2563eb', '#0891b2', '#0d9488', '#16a34a', '#ca8a04', '#ea580c', '#dc2626', '#db2777', '#7c3aed', '#525252', '#171717'],
})
const model = defineModel<string>({ default: '#4f46e5' })
const id = useId()
const valid = computed(() => /^#[0-9a-f]{6}$/i.test(model.value))
function onHex(e: Event) {
  let v = (e.target as HTMLInputElement).value.trim()
  if (!v.startsWith('#')) v = `#${v}`
  if (/^#[0-9a-f]{6}$/i.test(v)) model.value = v.toLowerCase()
}
const isActive = (c: string) => c.toLowerCase() === model.value.toLowerCase()
defineExpose({ valid })
</script>

<template>
  <div class="nu-field nu-color">
    <label v-if="label" class="nu-field__label" :for="id">{{ label }}</label>
    <div class="nu-color__swatches" role="radiogroup" :aria-label="label">
      <button
        v-for="c in swatches"
        :key="c"
        type="button"
        class="nu-color__swatch"
        :class="{ 'is-active': isActive(c) }"
        :style="{ background: c }"
        role="radio"
        :aria-checked="isActive(c)"
        :aria-label="c"
        :title="c"
        :disabled="disabled"
        @click="model = c"
      />
    </div>
    <div class="nu-color__custom">
      <input type="color" class="nu-color__native" :value="valid ? model : '#000000'" :disabled="disabled" :aria-label="`${label ?? 'Color'} picker`" @input="model = ($event.target as HTMLInputElement).value" />
      <div class="nu-control nu-control--sm nu-color__hex">
        <input :id="id" class="nu-control__input" :value="model" maxlength="7" spellcheck="false" :disabled="disabled" @change="onHex" />
      </div>
    </div>
    <span v-if="hint" class="nu-field__hint">{{ hint }}</span>
  </div>
</template>

<style>
.nu-color__swatches { display: flex; flex-wrap: wrap; gap: 6px; }
.nu-color__swatch { width: 24px; height: 24px; padding: 0; border: 2px solid var(--nu-surface); border-radius: 50%; box-shadow: 0 0 0 1px var(--nu-border); cursor: pointer; }
.nu-color__swatch.is-active { box-shadow: 0 0 0 2px var(--nu-text); }
.nu-color__custom { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.nu-color__native { width: 32px; height: 28px; padding: 0; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: none; cursor: pointer; }
.nu-color__hex { width: 110px; font-family: var(--nu-font-mono); }
</style>
