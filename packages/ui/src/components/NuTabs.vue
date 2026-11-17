<script setup lang="ts">
import type { NuTab } from '../types'

const props = defineProps<{ tabs: NuTab[]; variant?: 'line' | 'pills' }>()
const active = defineModel<string>()

if (active.value === undefined && props.tabs.length) active.value = props.tabs[0]!.key
</script>

<template>
  <div class="nu-tabs" :class="`nu-tabs--${variant ?? 'line'}`">
    <div class="nu-tabs__list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="nu-tabs__tab"
        :class="{ 'is-active': tab.key === active }"
        type="button"
        role="tab"
        :aria-selected="tab.key === active"
        :disabled="tab.disabled"
        @click="active = tab.key"
      >
        <component :is="tab.icon" v-if="tab.icon" class="nu-tabs__icon" />
        {{ tab.label }}
      </button>
    </div>
    <div class="nu-tabs__panel" role="tabpanel">
      <slot :name="active" />
    </div>
  </div>
</template>

<style>
.nu-tabs__list { display: flex; gap: 4px; overflow-x: auto; }
.nu-tabs--line .nu-tabs__list { border-bottom: 1px solid var(--nu-border); }
.nu-tabs__tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  color: var(--nu-text-muted);
  font-weight: 600;
  font-size: 13.5px;
  white-space: nowrap;
  cursor: pointer;
}
.nu-tabs__tab:hover:not(:disabled) { color: var(--nu-text); }
.nu-tabs__tab:disabled { opacity: 0.5; cursor: not-allowed; }
.nu-tabs__icon { width: 16px; height: 16px; }
.nu-tabs--line .nu-tabs__tab { margin-bottom: -1px; border-bottom: 2px solid transparent; }
.nu-tabs--line .nu-tabs__tab.is-active { color: var(--nu-primary); border-bottom-color: var(--nu-primary); }
.nu-tabs--pills .nu-tabs__tab { border-radius: var(--nu-radius-sm); padding: 6px 12px; }
.nu-tabs--pills .nu-tabs__tab.is-active {
  background: color-mix(in srgb, var(--nu-primary) 13%, transparent);
  color: var(--nu-primary);
}
.nu-tabs__panel { padding-top: 12px; }
</style>
