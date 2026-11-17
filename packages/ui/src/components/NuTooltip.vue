<script setup lang="ts">
withDefaults(defineProps<{ text: string; placement?: 'top' | 'bottom' | 'left' | 'right' }>(), { placement: 'top' })
</script>

<template>
  <span class="nu-tooltip" :class="`nu-tooltip--${placement}`">
    <slot />
    <span class="nu-tooltip__bubble" role="tooltip">{{ text }}</span>
  </span>
</template>

<style>
.nu-tooltip { position: relative; display: inline-flex; }
.nu-tooltip__bubble {
  position: absolute;
  z-index: 70;
  padding: 4px 8px;
  border-radius: var(--nu-radius-sm);
  background: #171717;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  display: none;
  pointer-events: none;
}
:root[data-theme='dark'] .nu-tooltip__bubble { background: #fafafa; color: #0a0a0a; }
.nu-tooltip:hover .nu-tooltip__bubble, .nu-tooltip:focus-within .nu-tooltip__bubble { display: block; }
.nu-tooltip--top .nu-tooltip__bubble { bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.nu-tooltip--bottom .nu-tooltip__bubble { top: calc(100% + 6px); left: 50%; transform: translateX(-50%); }
.nu-tooltip--left .nu-tooltip__bubble { right: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
.nu-tooltip--right .nu-tooltip__bubble { left: calc(100% + 6px); top: 50%; transform: translateY(-50%); }
</style>
