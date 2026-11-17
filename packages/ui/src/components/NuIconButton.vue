<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  /** Accessible name — required since the button has no text. */
  label: string
  /** Count bubble; `true` shows a plain dot. */
  badge?: number | string | boolean
}>()
</script>

<template>
  <button class="nu-icon-btn" type="button" :aria-label="label" :title="label">
    <slot><component :is="icon" /></slot>
    <span v-if="badge" class="nu-icon-btn__badge" :class="{ 'is-dot': badge === true }">
      <template v-if="badge !== true">{{ badge }}</template>
    </span>
  </button>
</template>

<style>
.nu-icon-btn {
  position: relative;
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text-muted);
  cursor: pointer;
  transition: background var(--nu-transition), color var(--nu-transition);
}
.nu-icon-btn:hover { background: color-mix(in srgb, var(--nu-text) 8%, transparent); color: var(--nu-text); }
.nu-icon-btn svg { width: 18px; height: 18px; }
.nu-icon-btn__badge {
  position: absolute;
  top: -3px;
  inset-inline-end: -5px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border: 2px solid var(--nu-surface);
  border-radius: 999px;
  background: var(--nu-danger);
  color: var(--nu-on-color);
  font-size: 10px;
  font-weight: 700;
  line-height: 12px;
  box-sizing: content-box;
}
.nu-icon-btn__badge.is-dot { top: 6px; inset-inline-end: 6px; min-width: 8px; width: 8px; height: 8px; padding: 0; box-sizing: border-box; }
</style>
