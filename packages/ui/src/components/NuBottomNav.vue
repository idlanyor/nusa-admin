<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { t } from '../composables/useLocale'
import { useOverlay } from '../composables/useOverlay'
import type { NuMenuItem } from '../types'
import NuIcon from './NuIcon.vue'

/**
 * Mobile bottom navigation: a few primary links plus a "Menu" button that opens a sheet with the
 * full menu (the same NuMenuItem[] as the sidebar). Hidden from 992px up.
 */
const props = withDefaults(defineProps<{ menu: NuMenuItem[]; /** Paths shown as tabs; default: the first 4 linked items. */ primary?: string[] }>(), {})

const route = useRoute()
const router = useRouter()
const open = ref(false)
const sheet = ref<HTMLElement | null>(null)
useOverlay(open, sheet, { onEscape: () => (open.value = false) })
watch(() => route.fullPath, () => (open.value = false))

const flat = (items: NuMenuItem[]): NuMenuItem[] => items.flatMap((i) => (i.children?.length ? flat(i.children) : i.header ? [] : [i]))
const pathOf = (i: NuMenuItem) => (i.to ? router.resolve(i.to).path : '')
const tabs = computed(() => {
  const all = flat(props.menu).filter((i) => i.to)
  const picked = props.primary?.length ? props.primary.map((p) => all.find((i) => pathOf(i) === p)).filter(Boolean) : all.slice(0, 4)
  return picked as NuMenuItem[]
})
const isActive = (i: NuMenuItem) => !!i.to && pathOf(i) === route.path
const inSheet = computed(() => !tabs.value.some(isActive) && flat(props.menu).some(isActive))

/** Sheet sections: each section header starts one; each group gets its own titled section. */
const sections = computed(() => {
  const out: { title?: string; items: NuMenuItem[] }[] = [{ items: [] }]
  for (const item of props.menu) {
    if (item.header) out.push({ title: item.label, items: [] })
    else if (item.children?.length) {
      out.push({ title: item.label, items: flat(item.children).map((c) => ({ ...c, icon: c.icon ?? item.icon })) })
      out.push({ items: [] })
    } else out[out.length - 1]!.items.push(item)
  }
  return out.filter((s) => s.items.length)
})
</script>

<template>
  <nav class="nu-bottomnav" :aria-label="t('mainNav')">
    <RouterLink v-for="tab in tabs" :key="pathOf(tab)" :to="tab.to!" class="nu-bottomnav__tab" :class="{ 'is-active': isActive(tab) }" :aria-current="isActive(tab) ? 'page' : undefined">
      <span class="nu-bottomnav__icon"><component :is="tab.icon" v-if="tab.icon" /><NuIcon v-else name="chevron-right" :size="18" /></span>
      <span class="nu-bottomnav__label">{{ tab.label }}</span>
      <span v-if="tab.badge !== undefined" class="nu-bottomnav__badge" :class="`nu-c-${tab.badgeColor ?? 'danger'}`">{{ tab.badge }}</span>
    </RouterLink>
    <button type="button" class="nu-bottomnav__tab" :class="{ 'is-active': inSheet || open }" :aria-expanded="open" @click="open = true">
      <span class="nu-bottomnav__icon"><NuIcon name="menu" :size="20" /></span>
      <span class="nu-bottomnav__label">{{ t('menu') }}</span>
    </button>
  </nav>

  <Teleport to="body">
    <Transition name="nu-sheet">
      <div v-if="open" class="nu-sheet" @click.self="open = false">
        <div ref="sheet" class="nu-sheet__panel" role="dialog" aria-modal="true" :aria-label="t('menu')" tabindex="-1">
          <div class="nu-sheet__grip" aria-hidden="true" />
          <div class="nu-sheet__head">
            <strong>{{ t('menu') }}</strong>
            <button type="button" class="nu-modal__close" :aria-label="t('close')" @click="open = false"><NuIcon name="x" /></button>
          </div>
          <div class="nu-sheet__body" data-overlay-body>
            <section v-for="(s, i) in sections" :key="i">
              <h4 v-if="s.title">{{ s.title }}</h4>
              <div class="nu-sheet__grid">
                <component
                  :is="item.to ? RouterLink : 'a'"
                  v-for="(item, j) in s.items"
                  :key="j"
                  v-bind="item.to ? { to: item.to } : { href: item.href ?? '#', target: item.target }"
                  class="nu-sheet__item"
                  :class="{ 'is-active': isActive(item) }"
                >
                  <span class="nu-sheet__icon" :class="item.color && `nu-c-${item.color}`"><component :is="item.icon" v-if="item.icon" /><span v-else class="nu-sheet__dot" /></span>
                  <span class="nu-truncate">{{ item.label }}</span>
                </component>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.nu-bottomnav {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 40;
  display: none;
  height: calc(56px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--nu-border);
  background: color-mix(in srgb, var(--nu-surface) 92%, transparent);
  backdrop-filter: saturate(1.4) blur(10px);
}
@media (max-width: 991.98px) {
  .nu-bottomnav { display: flex; }
}
.nu-bottomnav__tab {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 0;
  background: transparent;
  color: var(--nu-text-muted);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none !important;
  cursor: pointer;
}
.nu-bottomnav__tab.is-active { color: var(--nu-primary); }
.nu-bottomnav__tab.is-active::before { content: ''; position: absolute; top: 0; width: 28px; height: 2px; border-radius: 0 0 2px 2px; background: var(--nu-primary); }
.nu-bottomnav__icon { display: grid; place-items: center; height: 22px; }
.nu-bottomnav__icon svg { width: 20px; height: 20px; }
.nu-bottomnav__label { max-width: 100%; padding: 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nu-bottomnav__badge { position: absolute; top: 5px; inset-inline-start: calc(50% + 6px); min-width: 16px; padding: 0 4px; border-radius: 999px; background: var(--nu-c); color: var(--nu-on-color); font-size: 10px; line-height: 16px; }

.nu-sheet { position: fixed; inset: 0; z-index: 105; display: flex; align-items: flex-end; background: var(--nu-backdrop); }
.nu-sheet__panel { width: 100%; max-height: 82vh; display: flex; flex-direction: column; border-radius: 14px 14px 0 0; background: var(--nu-surface); color: var(--nu-text); box-shadow: var(--nu-shadow-lg); outline: 0; padding-bottom: env(safe-area-inset-bottom); }
.nu-sheet__grip { width: 36px; height: 4px; margin: 8px auto 0; border-radius: 2px; background: var(--nu-border); }
.nu-sheet__head { display: flex; align-items: center; justify-content: space-between; padding: 6px 12px 6px 16px; }
.nu-sheet__body { padding: 0 12px 16px; overflow-y: auto; }
.nu-sheet__body h4 { margin: 10px 4px 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--nu-text-muted); }
.nu-sheet__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.nu-sheet__item { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 8px 10px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius); color: var(--nu-text) !important; font-size: 13px; font-weight: 500; text-decoration: none !important; }
.nu-sheet__item.is-active { border-color: var(--nu-primary); background: color-mix(in srgb, var(--nu-primary) 8%, transparent); color: var(--nu-primary) !important; }
.nu-sheet__icon { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border-radius: var(--nu-radius-sm); background: color-mix(in srgb, var(--nu-c, var(--nu-primary)) 12%, transparent); color: var(--nu-c, var(--nu-primary)); }
.nu-sheet__icon svg { width: 15px; height: 15px; }
.nu-sheet__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.nu-sheet-enter-active, .nu-sheet-leave-active { transition: opacity 0.2s ease; }
.nu-sheet-enter-active .nu-sheet__panel, .nu-sheet-leave-active .nu-sheet__panel { transition: transform 0.22s ease; }
.nu-sheet-enter-from, .nu-sheet-leave-to { opacity: 0; }
.nu-sheet-enter-from .nu-sheet__panel, .nu-sheet-leave-to .nu-sheet__panel { transform: translateY(100%); }
</style>
