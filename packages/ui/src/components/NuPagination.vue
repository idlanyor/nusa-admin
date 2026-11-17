<script setup lang="ts">
import { computed } from 'vue'
import NuIcon from './NuIcon.vue'

const props = withDefaults(defineProps<{ total: number; pageSize?: number; siblings?: number }>(), {
  pageSize: 10,
  siblings: 1,
})
const page = defineModel<number>({ default: 1 })

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

/** e.g. [1, '…', 4, 5, 6, '…', 20] */
const items = computed<(number | string)[]>(() => {
  const last = pageCount.value
  const from = Math.max(2, page.value - props.siblings)
  const to = Math.min(last - 1, page.value + props.siblings)
  const out: (number | string)[] = [1]
  if (from > 2) out.push('…l')
  for (let p = from; p <= to; p++) out.push(p)
  if (to < last - 1) out.push('…r')
  if (last > 1) out.push(last)
  return out
})

function go(p: number) {
  page.value = Math.min(pageCount.value, Math.max(1, p))
}
</script>

<template>
  <nav class="nu-pagination" aria-label="Pagination">
    <button class="nu-pagination__btn" type="button" :disabled="page <= 1" aria-label="Previous page" @click="go(page - 1)">
      <NuIcon name="chevron-left" :size="16" />
    </button>
    <template v-for="item in items" :key="item">
      <span v-if="typeof item === 'string'" class="nu-pagination__gap">…</span>
      <button
        v-else
        class="nu-pagination__btn"
        :class="{ 'is-active': item === page }"
        type="button"
        :aria-current="item === page ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item }}
      </button>
    </template>
    <button class="nu-pagination__btn" type="button" :disabled="page >= pageCount" aria-label="Next page" @click="go(page + 1)">
      <NuIcon name="chevron-right" :size="16" />
    </button>
  </nav>
</template>

<style>
.nu-pagination { display: inline-flex; align-items: center; gap: 3px; }
.nu-pagination__btn {
  display: grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}
.nu-pagination__btn:hover:not(:disabled):not(.is-active) { background: var(--nu-surface-2); border-color: color-mix(in srgb, var(--nu-text) 25%, var(--nu-border)); }
.nu-pagination__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.nu-pagination__btn.is-active { border-color: var(--nu-primary); background: var(--nu-primary); color: var(--nu-on-color); font-weight: 600; }
.nu-pagination__gap { padding: 0 4px; color: var(--nu-text-muted); }
</style>
