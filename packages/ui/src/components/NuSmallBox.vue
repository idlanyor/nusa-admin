<script setup lang="ts">
import { t } from '../composables/useLocale'
import type { Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

/** AdminLTE's "small box": solid tile, big number, faded icon and a footer link. */
withDefaults(
  defineProps<{ label: string; value: string | number; icon?: Component; color?: NuColor; to?: RouteLocationRaw; href?: string; linkLabel?: string }>(),
  { color: 'primary' },
)
</script>

<template>
  <div class="nu-small-box" :class="`nu-c-${color}`">
    <div class="nu-small-box__inner">
      <div class="nu-small-box__value">{{ value }}</div>
      <div class="nu-small-box__label">{{ label }}</div>
    </div>
    <component :is="icon" v-if="icon" class="nu-small-box__icon" aria-hidden="true" />
    <component :is="to ? RouterLink : 'a'" v-if="to || href" v-bind="to ? { to } : { href }" class="nu-small-box__footer">
      {{ linkLabel ?? t('moreInfo') }} <NuIcon name="chevron-right" :size="14" />
    </component>
  </div>
</template>

<style>
.nu-small-box {
  position: relative;
  overflow: hidden;
  border-radius: var(--nu-radius);
  background: var(--nu-c);
  color: var(--nu-on-color);
  box-shadow: var(--nu-shadow-sm);
}
.nu-small-box__inner { position: relative; z-index: 1; padding: 12px 14px; }
.nu-small-box__value { font-size: 28px; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
.nu-small-box__label { opacity: 0.9; }
.nu-small-box__icon {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  width: 58px;
  height: 58px;
  opacity: 0.22;
  transition: transform 0.25s ease;
}
.nu-small-box:hover .nu-small-box__icon { transform: scale(1.08); }
.nu-small-box__footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.12);
  color: inherit !important;
  font-size: 13px;
  text-decoration: none !important;
}
.nu-small-box__footer:hover { background: rgba(0, 0, 0, 0.2); }
</style>
