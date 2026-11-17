<script setup lang="ts">
import { t, useLocale } from '../composables/useLocale'
import { computed, ref } from 'vue'
import type { NuColor } from '../types'
import NuIcon from './NuIcon.vue'

export interface NuCalendarEvent {
  /** ISO date, YYYY-MM-DD. */
  date: string
  title: string
  color?: NuColor
}

const props = withDefaults(
  defineProps<{
    events?: NuCalendarEvent[]
    /** 0 = Sunday, 1 = Monday. */
    weekStart?: 0 | 1
    locale?: string
    compact?: boolean
    /** Highlight an inclusive date range, [start, end] as YYYY-MM-DD. */
    range?: [string, string] | null
  }>(),
  { events: () => [], weekStart: 1 },
)
const emit = defineEmits<{ select: [date: string]; 'event-click': [event: NuCalendarEvent] }>()
/** Selected day, YYYY-MM-DD. */
const selected = defineModel<string>()

/** Show a month without changing the selection (used by NuDatePicker). */
function showMonth(date: string) {
  const d = new Date(`${date}T00:00:00`)
  cursor.value = new Date(d.getFullYear(), d.getMonth(), 1)
}
defineExpose({ showMonth })

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const today = iso(new Date())
const init = selected.value ? new Date(`${selected.value}T00:00:00`) : new Date()
const cursor = ref(new Date(init.getFullYear(), init.getMonth(), 1))

const { locale: currentLocale } = useLocale()
const lang = computed(() => props.locale ?? currentLocale.value)
const title = computed(() => cursor.value.toLocaleDateString(lang.value, { month: 'long', year: 'numeric' }))
const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 7 + i + props.weekStart).toLocaleDateString(lang.value, { weekday: 'short' })),
)
const byDate = computed(() => {
  const map = new Map<string, NuCalendarEvent[]>()
  for (const e of props.events) map.set(e.date, [...(map.get(e.date) ?? []), e])
  return map
})
const days = computed(() => {
  const first = cursor.value
  const offset = (first.getDay() - props.weekStart + 7) % 7
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(first.getFullYear(), first.getMonth(), i - offset + 1)
    const key = iso(d)
    return { key, day: d.getDate(), outside: d.getMonth() !== first.getMonth(), events: byDate.value.get(key) ?? [] }
  })
})

function move(delta: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
}
function goToday() {
  const now = new Date()
  cursor.value = new Date(now.getFullYear(), now.getMonth(), 1)
  pick(today)
}
function pick(key: string) {
  selected.value = key
  emit('select', key)
}
</script>

<template>
  <div class="nu-calendar" :class="{ 'nu-calendar--compact': compact }">
    <div class="nu-calendar__bar">
      <strong class="nu-calendar__title">{{ title }}</strong>
      <div class="nu-calendar__nav">
        <button type="button" class="nu-calendar__today" @click="goToday">{{ t('today') }}</button>
        <button type="button" :aria-label="t('previousMonth')" @click="move(-1)"><NuIcon name="chevron-left" :size="16" /></button>
        <button type="button" :aria-label="t('nextMonth')" @click="move(1)"><NuIcon name="chevron-right" :size="16" /></button>
      </div>
    </div>
    <div class="nu-calendar__grid nu-calendar__weekdays"><span v-for="w in weekdays" :key="w">{{ w }}</span></div>
    <div class="nu-calendar__grid nu-calendar__days">
      <div
        v-for="d in days"
        :key="d.key"
        class="nu-calendar__day"
        :class="{
          'is-outside': d.outside,
          'is-today': d.key === today,
          'is-selected': d.key === selected,
          'is-in-range': range && d.key >= range[0] && d.key <= range[1],
          'is-range-edge': range && (d.key === range[0] || d.key === range[1]),
        }"
        role="button"
        tabindex="0"
        :aria-label="d.key"
        @click="pick(d.key)"
        @keydown.enter="pick(d.key)"
      >
        <span class="nu-calendar__num">{{ d.day }}</span>
        <template v-if="compact">
          <span v-if="d.events.length" class="nu-calendar__dots">
            <i v-for="(e, i) in d.events.slice(0, 3)" :key="i" :class="`nu-c-${e.color ?? 'primary'}`" />
          </span>
        </template>
        <template v-else>
          <button
            v-for="(e, i) in d.events.slice(0, 3)"
            :key="i"
            type="button"
            class="nu-calendar__event"
            :class="`nu-c-${e.color ?? 'primary'}`"
            :title="e.title"
            @click.stop="emit('event-click', e)"
          >
            {{ e.title }}
          </button>
          <span v-if="d.events.length > 3" class="nu-calendar__more">{{ t('moreEvents', { count: d.events.length - 3 }) }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.nu-calendar__bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 14px; }
.nu-calendar__title { font-size: 14.5px; }
.nu-calendar__nav { display: flex; gap: 3px; }
.nu-calendar__nav button {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.nu-calendar__nav button:hover { background: var(--nu-surface-2); }
.nu-calendar__grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
.nu-calendar__weekdays {
  border-block: 1px solid var(--nu-border);
  background: var(--nu-surface-2);
  color: var(--nu-text-muted);
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.nu-calendar__weekdays span { padding: 5px 8px; }
.nu-calendar__day {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 92px;
  padding: 4px;
  border-inline-end: 1px solid var(--nu-border);
  border-bottom: 1px solid var(--nu-border);
  cursor: pointer;
  min-width: 0;
}
.nu-calendar__day:nth-child(7n) { border-inline-end: 0; }
.nu-calendar__day:nth-last-child(-n + 7) { border-bottom: 0; }
.nu-calendar__day:hover { background: color-mix(in srgb, var(--nu-text) 3%, transparent); }
.nu-calendar__day.is-outside .nu-calendar__day.is-in-range { background: color-mix(in srgb, var(--nu-primary) 12%, transparent); }
.nu-calendar--compact .nu-calendar__day.is-in-range { border-radius: 0; }
.nu-calendar__day.is-range-edge .nu-calendar__num { background: var(--nu-primary); color: var(--nu-on-color); font-weight: 700; }
.nu-calendar__num { opacity: 0.4; }
.nu-calendar__day.is-selected { background: color-mix(in srgb, var(--nu-primary) 8%, transparent); }
.nu-calendar__num {
  align-self: flex-start;
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
}
.nu-calendar__day.is-today .nu-calendar__num { background: var(--nu-primary); color: var(--nu-on-color); font-weight: 700; }
.nu-calendar__event {
  display: block;
  width: 100%;
  padding: 1px 5px;
  border: 0;
  border-inline-start: 2px solid var(--nu-c);
  border-radius: 2px;
  background: color-mix(in srgb, var(--nu-c) 13%, transparent);
  color: var(--nu-text);
  font-size: 11.5px;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.nu-calendar__more { padding: 0 5px; font-size: 11px; color: var(--nu-text-muted); }

.nu-calendar--compact .nu-calendar__weekdays { padding: 0 8px; border: 0; background: transparent; text-align: center; }
.nu-calendar--compact .nu-calendar__weekdays span { padding: 2px 0; }
.nu-calendar--compact .nu-calendar__days { padding: 0 8px 8px; }
.nu-calendar--compact .nu-calendar__day { align-items: center; min-height: 34px; padding: 2px; border: 0; border-radius: var(--nu-radius-sm); }
.nu-calendar--compact .nu-calendar__num { align-self: center; }
.nu-calendar__dots { display: flex; gap: 2px; }
.nu-calendar__dots i { width: 4px; height: 4px; border-radius: 50%; background: var(--nu-c); }
@media (max-width: 640px) {
  .nu-calendar:not(.nu-calendar--compact) .nu-calendar__day { min-height: 64px; }
}
</style>
