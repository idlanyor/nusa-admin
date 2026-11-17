<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { NuMenuItem } from '../types'
import NuDropdown from './NuDropdown.vue'
import NuDropdownItem from './NuDropdownItem.vue'
import NuIcon from './NuIcon.vue'

/**
 * Horizontal version of the sidebar menu. Items before the first section header stay top-level;
 * each section header becomes a dropdown holding the items under it. Entries that don't fit
 * move into a "More" dropdown.
 */
const props = withDefaults(defineProps<{ menu: NuMenuItem[]; moreLabel?: string }>(), { moreLabel: 'More' })

const route = useRoute()
const router = useRouter()
const root = ref<HTMLElement | null>(null)
const visible = ref(Number.POSITIVE_INFINITY)

/** Top-level entries: plain items, plus one group per section header. */
const entries = computed(() => {
  const out: NuMenuItem[] = []
  let group: NuMenuItem | null = null
  for (const item of props.menu) {
    if (item.header) {
      group = { label: item.label, children: [] }
      out.push(group)
    } else if (group) group.children!.push(item)
    else out.push(item)
  }
  return out.filter((e) => !e.children || e.children.length)
})
const overflow = computed(() => entries.value.slice(visible.value))

const isActive = (item: NuMenuItem): boolean =>
  (!!item.to && router.resolve(item.to).path === route.path) || !!item.children?.some(isActive)

/** Dropdown rows, with nested groups shown as headers. */
function flatten(items: NuMenuItem[], depth = 0): { item: NuMenuItem; depth: number }[] {
  return items.flatMap((item) =>
    item.header ? [] : item.children?.length ? [{ item, depth }, ...flatten(item.children, depth + 1)] : [{ item, depth }],
  )
}

let widths: number[] = []
const MORE_WIDTH = 90

function fit() {
  const el = root.value
  if (!el) return
  const available = el.clientWidth
  if (widths.reduce((a, b) => a + b, 0) <= available) {
    visible.value = Number.POSITIVE_INFINITY
    return
  }
  let used = 0
  let n = 0
  for (const w of widths) {
    if (used + w + MORE_WIDTH > available) break
    used += w
    n++
  }
  visible.value = n
}
/** Measure every entry at full size once, then fit on each resize. */
async function remeasure() {
  visible.value = Number.POSITIVE_INFINITY
  await nextTick()
  const items = root.value ? Array.from(root.value.querySelectorAll<HTMLElement>(':scope > .nu-topnav__entry')) : []
  widths = items.map((i) => i.offsetWidth + 2)
  fit()
}

let observer: ResizeObserver | undefined
onMounted(() => {
  remeasure()
  observer = new ResizeObserver(fit)
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())
watch(entries, remeasure)
</script>

<template>
  <nav ref="root" class="nu-topnav" aria-label="Main">
    <div v-for="(item, i) in entries" v-show="i < visible" :key="i" class="nu-topnav__entry">
      <NuDropdown v-if="item.children?.length" align="left" width="230px">
        <template #trigger>
          <button class="nu-topnav__link" :class="{ 'is-active': isActive(item) }" type="button">
            <component :is="item.icon" v-if="item.icon" class="nu-topnav__icon" />
            {{ item.label }}
            <NuIcon name="chevron-down" :size="14" />
          </button>
        </template>
        <template v-for="(entry, j) in flatten(item.children)" :key="j">
          <div v-if="entry.item.children?.length" class="nu-dropdown__header" :style="{ paddingLeft: `${8 + entry.depth * 12}px` }">
            {{ entry.item.label }}
          </div>
          <NuDropdownItem
            v-else
            :to="entry.item.to"
            :href="entry.item.to ? undefined : entry.item.href"
            :icon="entry.item.icon"
            :class="{ 'is-current': isActive(entry.item) }"
            :style="{ paddingLeft: `${8 + entry.depth * 12}px` }"
          >
            {{ entry.item.label }}
          </NuDropdownItem>
        </template>
      </NuDropdown>
      <RouterLink v-else-if="item.to" class="nu-topnav__link" :class="{ 'is-active': isActive(item) }" :to="item.to">
        <component :is="item.icon" v-if="item.icon" class="nu-topnav__icon" />
        {{ item.label }}
      </RouterLink>
      <a v-else class="nu-topnav__link" :href="item.href ?? '#'" :target="item.target">
        <component :is="item.icon" v-if="item.icon" class="nu-topnav__icon" />
        {{ item.label }}
      </a>
    </div>

    <NuDropdown v-if="overflow.length" align="right" width="240px">
      <template #trigger>
        <button class="nu-topnav__link" :class="{ 'is-active': overflow.some(isActive) }" type="button">
          {{ moreLabel }} <NuIcon name="chevron-down" :size="14" />
        </button>
      </template>
      <template v-for="(entry, j) in flatten(overflow)" :key="j">
        <div v-if="entry.item.children?.length" class="nu-dropdown__header" :style="{ paddingLeft: `${8 + entry.depth * 12}px` }">
          {{ entry.item.label }}
        </div>
        <NuDropdownItem
          v-else
          :to="entry.item.to"
          :href="entry.item.to ? undefined : entry.item.href"
          :icon="entry.item.icon"
          :class="{ 'is-current': isActive(entry.item) }"
          :style="{ paddingLeft: `${8 + entry.depth * 12}px` }"
        >
          {{ entry.item.label }}
        </NuDropdownItem>
      </template>
    </NuDropdown>
  </nav>
</template>

<style>
.nu-topnav { flex: 1 1 auto; display: flex; align-items: center; gap: 2px; min-width: 0; }
.nu-topnav__entry { flex: none; display: flex; }
.nu-topnav .nu-dropdown__menu { max-height: calc(100vh - var(--nu-navbar-height) - 16px); overflow-y: auto; }
.nu-topnav__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text-muted);
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none !important;
  cursor: pointer;
}
.nu-topnav__link:hover { background: color-mix(in srgb, var(--nu-text) 7%, transparent); color: var(--nu-text); }
.nu-topnav__link.is-active { background: color-mix(in srgb, var(--nu-primary) 12%, transparent); color: var(--nu-primary); }
.nu-topnav__icon { width: 16px; height: 16px; }
.nu-dropdown-item.is-current { color: var(--nu-primary); font-weight: 600; }
</style>
