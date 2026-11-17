<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  title?: string
  subtitle?: string
  icon?: Component
  to?: RouteLocationRaw
  href?: string
  /** Render as a button (emits native click). */
  clickable?: boolean
  active?: boolean
}>()

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : props.clickable ? 'button' : 'div'))
const attrs = computed(() => (props.to ? { to: props.to } : props.href ? { href: props.href } : props.clickable ? { type: 'button' } : {}))
</script>

<template>
  <li>
    <component :is="tag" v-bind="attrs" class="nu-list-item" :class="{ 'is-active': active }">
      <span v-if="icon || $slots.start" class="nu-list-item__icon"><slot name="start"><component :is="icon" /></slot></span>
      <span class="nu-list-item__text">
        <slot>
          <div class="nu-list-item__title">{{ title }}</div>
          <div v-if="subtitle" class="nu-list-item__subtitle">{{ subtitle }}</div>
        </slot>
      </span>
      <span v-if="$slots.end" class="nu-list-item__end"><slot name="end" /></span>
    </component>
  </li>
</template>
