<script setup lang="ts">
/**
 * The Nusa Admin mark: three "islands" (Nusa = archipelago) forming an N.
 * `tile` sits on the brand color; `mark` is the bare shape in the current text color.
 */
withDefaults(defineProps<{ size?: number | string; variant?: 'tile' | 'mark'; /** Accessible name; omit when a visible brand name sits next to it. */ title?: string }>(), {
  size: 32,
  variant: 'tile',
})
</script>

<template>
  <svg
    class="nu-logo"
    :class="`nu-logo--${variant}`"
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    :role="title ? 'img' : undefined"
    :aria-label="title"
    :aria-hidden="title ? undefined : 'true'"
  >
    <rect v-if="variant === 'tile'" class="nu-logo__tile" width="32" height="32" rx="8" />
    <g class="nu-logo__mark" fill="none" stroke-width="5" stroke-linecap="round">
      <path d="M7 12.5V23.5"/>
      <path d="M25 8.5V19.5"/>
      <path d="M13.6 8.6L18.4 23.4" stroke-opacity=".72"/>
    </g>
  </svg>
</template>

<style>
.nu-logo { flex: none; display: inline-block; vertical-align: middle; }
.nu-logo__tile { fill: var(--nu-primary); }
.nu-logo--tile .nu-logo__mark { stroke: var(--nu-on-color); }
.nu-logo--mark .nu-logo__mark { stroke: currentColor; }
</style>
