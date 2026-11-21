<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { t } from '../composables/useLocale'
import NuIcon from './NuIcon.vue'

/** Read-only value (token, password, IP, connection string) with reveal and copy buttons. */
const props = withDefaults(defineProps<{ value: string; label?: string; masked?: boolean; copyable?: boolean; mono?: boolean }>(), {
  masked: true,
  copyable: true,
  mono: true,
})
const emit = defineEmits<{ copy: [] }>()
const shown = ref(!props.masked)
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: props.value })
    document.body.append(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  emit('copy')
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1500)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="nu-field nu-secret">
    <span v-if="label" class="nu-field__label">{{ label }}</span>
    <div class="nu-secret__box">
      <code class="nu-secret__value" :class="{ 'is-mono': mono }" :aria-label="label">{{ shown ? value : '•'.repeat(Math.min(24, Math.max(8, value.length))) }}</code>
      <button v-if="masked" type="button" class="nu-secret__btn" :aria-pressed="shown" :aria-label="shown ? t('hide') : t('show')" @click="shown = !shown">
        <NuIcon :name="shown ? 'eye-off' : 'eye'" :size="15" />
      </button>
      <button v-if="copyable" type="button" class="nu-secret__btn" :aria-label="copied ? t('copied') : t('copy')" @click="copy">
        <NuIcon :name="copied ? 'check' : 'copy'" :size="15" />
      </button>
    </div>
    <span class="nu-sr-only" aria-live="polite">{{ copied ? t('copied') : '' }}</span>
  </div>
</template>

<style>
.nu-secret__box { display: flex; align-items: center; gap: 2px; min-height: 34px; padding: 0 4px 0 10px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: var(--nu-surface-2); }
.nu-secret__value { flex: 1; min-width: 0; padding: 0; background: none; overflow-wrap: anywhere; font-size: 13px; }
.nu-secret__value:not(.is-mono) { font-family: inherit; }
.nu-secret__btn { display: grid; place-items: center; width: 28px; height: 28px; flex: none; border: 0; border-radius: var(--nu-radius-sm); background: transparent; color: var(--nu-text-muted); cursor: pointer; }
.nu-secret__btn:hover { background: color-mix(in srgb, var(--nu-text) 8%, transparent); color: var(--nu-text); }
</style>
