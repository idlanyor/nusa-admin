<script setup lang="ts">
import { t } from '../composables/useLocale'
import { RouterLink } from 'vue-router'
import type { NuBreadcrumbItem } from '../types'

defineProps<{ items: NuBreadcrumbItem[] }>()
</script>

<template>
  <nav class="nu-breadcrumb" :aria-label="t('breadcrumb')">
    <template v-for="(b, i) in items" :key="i">
      <span v-if="i" class="nu-breadcrumb__sep" aria-hidden="true">/</span>
      <RouterLink v-if="b.to" :to="b.to">{{ b.label }}</RouterLink>
      <span v-else :aria-current="i === items.length - 1 ? 'page' : undefined">{{ b.label }}</span>
    </template>
  </nav>
</template>

<style>
.nu-breadcrumb { display: flex; flex-wrap: wrap; gap: 6px; font-size: 12.5px; color: var(--nu-text-muted); }
.nu-breadcrumb a { color: var(--nu-text-muted); }
.nu-breadcrumb a:hover { color: var(--nu-primary); }
.nu-breadcrumb__sep { opacity: 0.5; }
</style>
