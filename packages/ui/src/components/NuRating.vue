<script setup lang="ts">
import { ref } from 'vue'
import NuIcon from './NuIcon.vue'

withDefaults(defineProps<{ max?: number; readonly?: boolean; size?: number; label?: string }>(), { max: 5, size: 18, label: 'Rating' })
const model = defineModel<number>({ default: 0 })
const hover = ref(0)
</script>

<template>
  <span class="nu-rating" :class="{ 'is-readonly': readonly }" role="radiogroup" :aria-label="label" @pointerleave="hover = 0">
    <button
      v-for="n in max"
      :key="n"
      class="nu-rating__star"
      :class="{ 'is-on': n <= (hover || model) }"
      type="button"
      role="radio"
      :aria-checked="n === model"
      :aria-label="`${n} of ${max}`"
      :disabled="readonly"
      @pointerenter="!readonly && (hover = n)"
      @click="model = n === model ? 0 : n"
    >
      <NuIcon name="star" :size="size" />
    </button>
  </span>
</template>

<style>
.nu-rating { display: inline-flex; gap: 1px; }
.nu-rating__star { display: grid; padding: 1px; border: 0; background: transparent; color: color-mix(in srgb, var(--nu-text) 25%, transparent); cursor: pointer; }
.nu-rating.is-readonly .nu-rating__star { cursor: default; }
.nu-rating__star.is-on { color: #e8a200; }
.nu-rating__star.is-on svg { fill: currentColor; }
</style>
