<script setup lang="ts">
import { t } from '../composables/useLocale'
import { ref } from 'vue'
import NuIcon from './NuIcon.vue'

const props = defineProps<{ accept?: string; multiple?: boolean; label?: string; hint?: string; disabled?: boolean }>()
const files = defineModel<File[]>({ default: () => [] })
const dragging = ref(false)
const input = ref<HTMLInputElement | null>(null)

function add(list: FileList | null | undefined) {
  if (!list?.length) return
  const incoming = Array.from(list)
  files.value = props.multiple ? [...files.value, ...incoming] : incoming.slice(0, 1)
  if (input.value) input.value.value = ''
}
function remove(i: number) {
  files.value = files.value.filter((_, idx) => idx !== i)
}
function size(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}
</script>

<template>
  <div class="nu-upload">
    <label
      class="nu-upload__zone"
      :class="{ 'is-dragging': dragging, 'is-disabled': disabled }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="dragging = false; !disabled && add($event.dataTransfer?.files)"
    >
      <input ref="input" class="nu-sr-only" type="file" :accept="accept" :multiple="multiple" :disabled="disabled" @change="add(($event.target as HTMLInputElement).files)" />
      <NuIcon name="upload" :size="20" />
      <span class="nu-upload__label">{{ label ?? t('dropFiles') }}</span>
      <span v-if="hint" class="nu-upload__hint">{{ hint }}</span>
    </label>
    <ul v-if="files.length" class="nu-upload__list">
      <li v-for="(f, i) in files" :key="`${f.name}-${i}`">
        <NuIcon name="file" :size="16" />
        <span class="nu-upload__name">{{ f.name }}</span>
        <span class="nu-upload__size">{{ size(f.size) }}</span>
        <button type="button" :aria-label="t('remove', { label: f.name })" @click="remove(i)"><NuIcon name="x" :size="14" /></button>
      </li>
    </ul>
  </div>
</template>

<style>
.nu-upload__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 16px 12px;
  border: 1.5px dashed color-mix(in srgb, var(--nu-text) 25%, var(--nu-border));
  border-radius: var(--nu-radius);
  background: var(--nu-surface-2);
  color: var(--nu-text-muted);
  text-align: center;
  cursor: pointer;
  transition: border-color var(--nu-transition), background var(--nu-transition);
}
.nu-upload__zone:hover, .nu-upload__zone.is-dragging, .nu-upload__zone:focus-within {
  border-color: var(--nu-primary);
  background: color-mix(in srgb, var(--nu-primary) 6%, var(--nu-surface));
}
.nu-upload__zone.is-disabled { opacity: 0.55; cursor: not-allowed; }
.nu-upload__label { margin-top: 4px; color: var(--nu-text); font-weight: 500; }
.nu-upload__hint { font-size: 12.5px; }
.nu-upload__list { display: grid; gap: 4px; margin: 8px 0 0; padding: 0; list-style: none; }
.nu-upload__list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  font-size: 13px;
  color: var(--nu-text-muted);
}
.nu-upload__name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--nu-text); }
.nu-upload__size { font-size: 12px; font-variant-numeric: tabular-nums; }
.nu-upload__list button { display: grid; padding: 2px; border: 0; border-radius: 3px; background: transparent; color: var(--nu-text-muted); cursor: pointer; }
.nu-upload__list button:hover { color: var(--nu-danger); }
</style>
