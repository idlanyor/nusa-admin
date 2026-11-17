<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { NuMenuItem } from '../types'
import NuIcon from './NuIcon.vue'

const props = withDefaults(defineProps<{ item: NuMenuItem; depth?: number }>(), { depth: 0 })

const route = useRoute()
const router = useRouter()

function matches(item: NuMenuItem): boolean {
  return !!item.to && router.resolve(item.to).path === route.path
}
function containsActive(item: NuMenuItem): boolean {
  return matches(item) || !!item.children?.some(containsActive)
}

const hasChildren = computed(() => !!props.item.children?.length)
const active = computed(() => matches(props.item))
const childActive = computed(() => hasChildren.value && props.item.children!.some(containsActive))
const open = ref(childActive.value)

// Navigating into a nested page opens its group; we never auto-close what the user opened.
watch(childActive, (isActive) => {
  if (isActive) open.value = true
})

const tag = computed(() => (hasChildren.value ? 'button' : props.item.to ? RouterLink : 'a'))
const attrs = computed(() => {
  if (hasChildren.value) return { type: 'button', 'aria-expanded': open.value }
  if (props.item.to) return { to: props.item.to }
  return { href: props.item.href ?? '#', target: props.item.target, rel: props.item.target === '_blank' ? 'noopener' : undefined }
})
</script>

<template>
  <li v-if="item.header" class="nu-menu__header"><span>{{ item.label }}</span></li>
  <li v-else class="nu-menu__item" :class="{ 'is-open': open }">
    <component
      :is="tag"
      v-bind="attrs"
      class="nu-menu__link"
      :class="{ 'is-active': active, 'has-active-child': childActive }"
      :style="{ '--nu-depth': depth }"
      :aria-current="active ? 'page' : undefined"
      :title="item.label"
      @click="hasChildren && (open = !open)"
    >
      <span class="nu-menu__icon">
        <component :is="item.icon" v-if="item.icon" />
        <span v-else class="nu-menu__bullet" :class="item.color && [`nu-c-${item.color}`, 'is-colored']" />
      </span>
      <span class="nu-menu__label">{{ item.label }}</span>
      <span v-if="item.badge !== undefined" class="nu-menu__badge" :class="`nu-c-${item.badgeColor ?? 'primary'}`">
        {{ item.badge }}
      </span>
      <NuIcon v-if="hasChildren" class="nu-menu__caret" name="chevron-right" :size="15" />
    </component>
    <div v-if="hasChildren" class="nu-menu__sub">
      <ul>
        <NuMenuItem v-for="(child, i) in item.children" :key="i" :item="child" :depth="depth + 1" />
      </ul>
    </div>
  </li>
</template>
