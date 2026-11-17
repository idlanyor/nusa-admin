<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { NuColor, NuSize } from '../types'

const props = withDefaults(
  defineProps<{
    color?: NuColor
    variant?: 'solid' | 'soft' | 'outline' | 'ghost'
    size?: NuSize
    icon?: Component
    /** Icon-only square button. Provide `aria-label`. */
    square?: boolean
    block?: boolean
    loading?: boolean
    disabled?: boolean
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { color: 'primary', variant: 'solid', size: 'md', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="nu-btn"
    :class="[
      `nu-c-${color}`,
      `nu-btn--${variant}`,
      `nu-btn--${size}`,
      { 'nu-btn--block': block, 'nu-btn--square': square, 'is-loading': loading },
    ]"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="nu-btn__spinner" />
    <component :is="icon" v-else-if="icon" class="nu-btn__icon" />
    <span v-if="$slots.default && !square" class="nu-btn__label"><slot /></span>
  </component>
</template>

<style>
.nu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: var(--nu-radius-sm);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none !important;
  transition: background var(--nu-transition), border-color var(--nu-transition), color var(--nu-transition), box-shadow var(--nu-transition);
}
.nu-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.nu-btn--sm { height: 26px; padding: 0 8px; font-size: 12.5px; gap: 6px; }
.nu-btn--lg { height: 38px; padding: 0 16px; font-size: 14px; }
.nu-btn--block { display: flex; width: 100%; }
.nu-btn--square { width: 32px; padding: 0; }
.nu-btn--square.nu-btn--sm { width: 26px; }
.nu-btn--square.nu-btn--lg { width: 38px; }
.nu-btn__icon { width: 16px; height: 16px; flex: none; }
.nu-btn--lg .nu-btn__icon { width: 18px; height: 18px; }

.nu-btn--solid { background: var(--nu-c); color: var(--nu-on-color); box-shadow: var(--nu-shadow-sm); }
.nu-btn--solid:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-c) 88%, #000); }

.nu-btn--soft { background: color-mix(in srgb, var(--nu-c) 13%, transparent); color: var(--nu-c); }
.nu-btn--soft:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-c) 22%, transparent); }

.nu-btn--outline { background: transparent; color: var(--nu-c); border-color: color-mix(in srgb, var(--nu-c) 55%, transparent); }
.nu-btn--outline:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-c) 10%, transparent); }

.nu-btn--ghost { background: transparent; color: var(--nu-c); }
.nu-btn--ghost:hover:not(:disabled) { background: color-mix(in srgb, var(--nu-c) 12%, transparent); }

.nu-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: nu-spin 0.7s linear infinite;
}
@keyframes nu-spin { to { transform: rotate(360deg); } }
</style>
