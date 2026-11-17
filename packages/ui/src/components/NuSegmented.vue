<script setup lang="ts">
import type { NuOption, NuSize } from '../types'

withDefaults(defineProps<{ options: NuOption[]; size?: NuSize; block?: boolean; label?: string }>(), { size: 'md' })
const model = defineModel<string | number>()
</script>

<template>
  <div class="nu-segmented" :class="[`nu-segmented--${size}`, { 'nu-segmented--block': block }]" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      class="nu-segmented__btn"
      :class="{ 'is-active': o.value === model }"
      type="button"
      role="radio"
      :aria-checked="o.value === model"
      :disabled="o.disabled"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style>
.nu-segmented {
  display: inline-flex;
  padding: 2px;
  border-radius: var(--nu-radius-sm);
  background: color-mix(in srgb, var(--nu-text) 8%, transparent);
}
.nu-segmented--block { display: flex; }
.nu-segmented--block .nu-segmented__btn { flex: 1; }
.nu-segmented__btn {
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--nu-text-muted);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}
.nu-segmented--sm .nu-segmented__btn { height: 24px; padding: 0 8px; font-size: 12.5px; }
.nu-segmented--lg .nu-segmented__btn { height: 34px; padding: 0 16px; }
.nu-segmented__btn:hover:not(:disabled) { color: var(--nu-text); }
.nu-segmented__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nu-segmented__btn.is-active { background: var(--nu-surface); color: var(--nu-text); box-shadow: var(--nu-shadow-sm); }
</style>
