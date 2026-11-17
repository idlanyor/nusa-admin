<script setup lang="ts">
import { ref } from 'vue'
import NuIcon from './NuIcon.vue'

export interface NuAccordionItem {
  key: string
  title: string
  /** Plain-text body; or use the `#<key>` slot for rich content. */
  content?: string
}

const props = defineProps<{ items: NuAccordionItem[]; multiple?: boolean; defaultOpen?: string[] }>()
const open = ref<string[]>(props.defaultOpen ?? [])

function toggle(key: string) {
  if (open.value.includes(key)) open.value = open.value.filter((k) => k !== key)
  else open.value = props.multiple ? [...open.value, key] : [key]
}
</script>

<template>
  <div class="nu-accordion">
    <div v-for="item in items" :key="item.key" class="nu-accordion__item" :class="{ 'is-open': open.includes(item.key) }">
      <button class="nu-accordion__head" type="button" :aria-expanded="open.includes(item.key)" @click="toggle(item.key)">
        <span>{{ item.title }}</span>
        <NuIcon name="chevron-down" :size="16" />
      </button>
      <div class="nu-accordion__wrap">
        <div class="nu-accordion__inner">
          <div class="nu-accordion__body"><slot :name="item.key" :item="item">{{ item.content }}</slot></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.nu-accordion { border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); }
.nu-accordion__item + .nu-accordion__item { border-top: 1px solid var(--nu-border); }
.nu-accordion__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border: 0;
  background: transparent;
  color: var(--nu-text);
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}
.nu-accordion__head:hover { background: color-mix(in srgb, var(--nu-text) 4%, transparent); }
.nu-accordion__head .nu-icon { color: var(--nu-text-muted); transition: transform var(--nu-transition); }
.nu-accordion__item.is-open .nu-accordion__head .nu-icon { transform: rotate(180deg); }
.nu-accordion__wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--nu-transition); }
.nu-accordion__item.is-open .nu-accordion__wrap { grid-template-rows: 1fr; }
.nu-accordion__inner { min-height: 0; overflow: hidden; }
.nu-accordion__body { padding: 0 14px 12px; color: var(--nu-text-muted); }
</style>
