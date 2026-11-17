<script setup lang="ts">
import type { NuTimelineItem } from '../types'

defineProps<{ items: NuTimelineItem[] }>()
</script>

<template>
  <ol class="nu-timeline">
    <li v-for="(item, i) in items" :key="i" class="nu-timeline__item" :class="item.label !== undefined ? 'nu-timeline__item--label' : `nu-c-${item.color ?? 'primary'}`">
      <span v-if="item.label !== undefined" class="nu-timeline__label">{{ item.label }}</span>
      <template v-else>
      <span class="nu-timeline__marker" :class="{ 'has-icon': item.icon }">
        <component :is="item.icon" v-if="item.icon" />
      </span>
      <div class="nu-timeline__content">
        <div class="nu-timeline__head">
          <span class="nu-timeline__title">{{ item.title }}</span>
          <time v-if="item.time" class="nu-timeline__time">{{ item.time }}</time>
        </div>
        <p v-if="item.description" class="nu-timeline__desc">{{ item.description }}</p>
        <slot name="item" :item="item" :index="i" />
      </div>
      </template>
    </li>
  </ol>
</template>

<style>
.nu-timeline { margin: 0; padding: 0; list-style: none; }
.nu-timeline__item { position: relative; display: flex; gap: 10px; padding-bottom: 12px; }
.nu-timeline__item:last-child { padding-bottom: 0; }
.nu-timeline__item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 28px;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--nu-border);
}
.nu-timeline__item--label { padding-bottom: 12px; }
.nu-timeline__label {
  position: relative;
  z-index: 1;
  padding: 2px 8px;
  border-radius: var(--nu-radius-sm);
  background: var(--nu-text);
  color: var(--nu-surface);
  font-size: 12px;
  font-weight: 600;
}
.nu-timeline__marker {
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--nu-c) 16%, transparent);
  color: var(--nu-c);
}
.nu-timeline__marker:not(.has-icon)::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.nu-timeline__marker svg { width: 14px; height: 14px; }
.nu-timeline__content { flex: 1; min-width: 0; padding-top: 2px; }
.nu-timeline__head { display: flex; justify-content: space-between; gap: 10px; }
.nu-timeline__title { font-weight: 600; }
.nu-timeline__time { flex: none; font-size: 12px; color: var(--nu-text-muted); }
.nu-timeline__desc { margin-top: 2px; font-size: 13px; color: var(--nu-text-muted); }
</style>
