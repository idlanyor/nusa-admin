<script setup lang="ts">
import NuBreadcrumb from './NuBreadcrumb.vue'
import type { NuBreadcrumbItem } from '../types'

defineProps<{ title: string; subtitle?: string; breadcrumb?: NuBreadcrumbItem[] }>()
</script>

<template>
  <div class="nu-page-header">
    <div class="nu-page-header__text">
      <NuBreadcrumb v-if="breadcrumb?.length" class="nu-page-header__crumbs" :items="breadcrumb" />
      <h1 class="nu-page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="nu-page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="nu-page-header__actions"><slot /></div>
  </div>
</template>

<style>
.nu-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 14px;
}
.nu-page-header__text { min-width: 0; }
.nu-page-header__title { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3; }
.nu-page-header__subtitle { margin-top: 2px; color: var(--nu-text-muted); }
.nu-page-header__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.nu-page-header__crumbs { margin-bottom: 4px; }
</style>
