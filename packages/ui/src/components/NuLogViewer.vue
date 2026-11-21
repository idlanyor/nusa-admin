<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { t } from '../composables/useLocale'
import NuIcon from './NuIcon.vue'

export interface NuLogLine {
  time?: string
  level?: 'debug' | 'info' | 'warn' | 'error' | 'success'
  text: string
}

/** Read-only log / console output: level colors, filter, follow-tail and line wrap. Pass lines as strings or NuLogLine objects. */
const props = withDefaults(defineProps<{ lines: (string | NuLogLine)[]; height?: string; title?: string; searchable?: boolean; wrap?: boolean }>(), {
  height: '320px',
  searchable: true,
})
const body = ref<HTMLElement | null>(null)
const follow = ref(true)
const query = ref('')
const wrapped = ref(props.wrap ?? false)

const LEVELS = /^\s*\[?(DEBUG|INFO|WARN(?:ING)?|ERROR|ERR|SUCCESS|OK)\]?[:\s]/i
const parsed = computed<NuLogLine[]>(() =>
  props.lines.map((l) => {
    if (typeof l !== 'string') return l
    const m = l.match(LEVELS)
    const tag = m?.[1]?.toLowerCase()
    const level = !tag ? undefined : tag.startsWith('warn') ? 'warn' : tag.startsWith('err') ? 'error' : tag === 'ok' ? 'success' : (tag as NuLogLine['level'])
    return { text: l, level }
  }),
)
const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? parsed.value.filter((l) => l.text.toLowerCase().includes(q)) : parsed.value
})

async function toEnd() {
  await nextTick()
  body.value?.scrollTo({ top: body.value.scrollHeight })
}
watch(() => props.lines.length, () => follow.value && toEnd(), { immediate: true })
function onScroll() {
  const el = body.value
  if (el) follow.value = el.scrollHeight - el.scrollTop - el.clientHeight < 24
}
</script>

<template>
  <div class="nu-log">
    <div class="nu-log__bar">
      <strong v-if="title" class="nu-truncate">{{ title }}</strong>
      <label v-if="searchable" class="nu-log__search">
        <NuIcon name="search" :size="13" />
        <input v-model="query" type="search" :placeholder="t('filterLines')" :aria-label="t('filterLines')" />
      </label>
      <span class="nu-log__count">{{ shown.length }}/{{ parsed.length }}</span>
      <button type="button" class="nu-log__btn" :aria-pressed="wrapped" @click="wrapped = !wrapped">{{ t('wrapLines') }}</button>
      <button type="button" class="nu-log__btn" :class="{ 'is-on': follow }" :aria-pressed="follow" @click="follow = !follow; follow && toEnd()">
        <NuIcon name="arrow-down" :size="13" /> {{ t('followTail') }}
      </button>
    </div>
    <div ref="body" class="nu-log__body" :class="{ 'is-wrapped': wrapped }" :style="{ height }" role="log" aria-live="off" tabindex="0" @scroll="onScroll">
      <div v-for="(l, i) in shown" :key="i" class="nu-log__line" :class="l.level && `is-${l.level}`">
        <span v-if="l.time" class="nu-log__time">{{ l.time }}</span>{{ l.text }}
      </div>
      <div v-if="!shown.length" class="nu-log__empty">{{ parsed.length ? t('noMatches') : t('noOutput') }}</div>
    </div>
  </div>
</template>

<style>
.nu-log { overflow: hidden; border: 1px solid #262626; border-radius: var(--nu-radius); background: #0a0a0a; color: #d4d4d4; direction: ltr; }
.nu-log__bar { display: flex; align-items: center; gap: 8px; padding: 5px 8px 5px 12px; border-bottom: 1px solid #262626; background: #171717; font-size: 12.5px; }
.nu-log__bar strong { color: #fafafa; }
.nu-log__search { display: flex; align-items: center; gap: 5px; margin-inline-start: auto; padding: 0 8px; height: 26px; border-radius: 4px; background: #262626; color: #a3a3a3; }
.nu-log__search input { width: 130px; border: 0; outline: 0; background: transparent; color: #fafafa; font-size: 12.5px; }
.nu-log__count { color: #737373; font-variant-numeric: tabular-nums; }
.nu-log__btn { display: inline-flex; align-items: center; gap: 3px; height: 26px; padding: 0 8px; border: 0; border-radius: 4px; background: transparent; color: #a3a3a3; font-size: 12px; cursor: pointer; }
.nu-log__btn:hover, .nu-log__btn[aria-pressed='true'] { background: #262626; color: #fafafa; }
.nu-log__btn.is-on { color: #86efac; }
.nu-log__body { padding: 8px 0; overflow: auto; font-family: var(--nu-font-mono); font-size: 12.5px; line-height: 1.55; outline: 0; }
.nu-log__line { padding: 0 12px; white-space: pre; }
.nu-log__body.is-wrapped .nu-log__line { white-space: pre-wrap; overflow-wrap: anywhere; }
.nu-log__line:hover { background: #171717; }
.nu-log__line.is-error { color: #fca5a5; background: rgba(239, 68, 68, 0.08); }
.nu-log__line.is-warn { color: #fcd34d; }
.nu-log__line.is-success { color: #86efac; }
.nu-log__line.is-debug { color: #737373; }
.nu-log__time { margin-inline-end: 10px; color: #737373; }
.nu-log__empty { padding: 16px 12px; color: #737373; }
</style>
