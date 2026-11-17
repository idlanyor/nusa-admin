<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps<{ icon?: Component; to?: RouteLocationRaw; href?: string; danger?: boolean; disabled?: boolean }>()

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: 'button', disabled: props.disabled }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" class="nu-dropdown-item" :class="{ 'is-danger': danger }" role="menuitem">
    <component :is="icon" v-if="icon" class="nu-dropdown-item__icon" />
    <span class="nu-dropdown-item__label"><slot /></span>
    <slot name="end" />
  </component>
</template>

<style>
.nu-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text);
  font-size: 13.5px;
  text-align: left;
  text-decoration: none !important;
  cursor: pointer;
}
.nu-dropdown-item:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-text) 7%, transparent); }
.nu-dropdown-item:disabled { opacity: 0.5; cursor: not-allowed; }
.nu-dropdown-item.is-danger { color: var(--nu-danger); }
.nu-dropdown-item__icon { width: 16px; height: 16px; flex: none; color: var(--nu-text-muted); }
.nu-dropdown-item.is-danger .nu-dropdown-item__icon { color: inherit; }
.nu-dropdown-item__label { flex: 1; min-width: 0; }
</style>
