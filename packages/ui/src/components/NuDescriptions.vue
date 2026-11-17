<script setup lang="ts">
export interface NuDescriptionItem {
  key?: string
  label: string
  value?: string | number
}

withDefaults(defineProps<{ items: NuDescriptionItem[]; columns?: 1 | 2 | 3 }>(), { columns: 1 })
</script>

<template>
  <dl class="nu-desc" :class="`nu-desc--${columns}`">
    <div v-for="(item, i) in items" :key="item.key ?? i" class="nu-desc__item">
      <dt>{{ item.label }}</dt>
      <dd><slot :name="item.key ?? `item-${i}`" :item="item">{{ item.value ?? '—' }}</slot></dd>
    </div>
  </dl>
</template>

<style>
.nu-desc { display: grid; gap: 10px 20px; margin: 0; }
.nu-desc--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.nu-desc--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 640px) { .nu-desc { grid-template-columns: 1fr !important; } }
.nu-desc__item { min-width: 0; }
.nu-desc dt { font-size: 12px; color: var(--nu-text-muted); }
.nu-desc dd { margin: 1px 0 0; font-weight: 500; overflow-wrap: anywhere; }
</style>
