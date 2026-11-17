<script setup lang="ts">
import { computed, useId } from 'vue'
import './form.css'

const props = withDefaults(
  defineProps<{ min?: number; max?: number; step?: number; label?: string; showValue?: boolean; disabled?: boolean; format?: (v: number) => string }>(),
  { min: 0, max: 100, step: 1 },
)
const model = defineModel<number>({ default: 0 })
const id = useId()
const pct = computed(() => ((model.value - props.min) / (props.max - props.min || 1)) * 100)
</script>

<template>
  <div class="nu-field">
    <div v-if="label || showValue" class="nu-slider__head">
      <label class="nu-field__label" :for="id">{{ label }}</label>
      <span v-if="showValue" class="nu-slider__value">{{ format ? format(model) : model }}</span>
    </div>
    <input
      :id="id"
      v-model.number="model"
      class="nu-slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :style="{ '--nu-fill': `${pct}%` }"
    />
  </div>
</template>

<style>
.nu-slider__head { display: flex; justify-content: space-between; gap: 10px; }
.nu-slider__value { font-size: 12.5px; color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
.nu-slider {
  appearance: none;
  width: 100%;
  height: 18px;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
.nu-slider:disabled { opacity: 0.55; cursor: not-allowed; }
.nu-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, var(--nu-primary) var(--nu-fill), color-mix(in srgb, var(--nu-text) 15%, transparent) var(--nu-fill));
}
.nu-slider::-moz-range-track { height: 4px; border-radius: 2px; background: color-mix(in srgb, var(--nu-text) 15%, transparent); }
.nu-slider::-moz-range-progress { height: 4px; border-radius: 2px; background: var(--nu-primary); }
.nu-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  margin-top: -5px;
  border: 2px solid var(--nu-primary);
  border-radius: 50%;
  background: var(--nu-surface);
}
.nu-slider::-moz-range-thumb { width: 10px; height: 10px; border: 2px solid var(--nu-primary); border-radius: 50%; background: var(--nu-surface); }
</style>
