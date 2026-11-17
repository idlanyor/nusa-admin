<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bell, CreditCard, Languages, Lock, LogOut, MessageSquare, Moon, PanelRight, Plus, Search, Settings, User } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCommandPalette, NuCustomizer, NuDropdown, NuDropdownItem, NuIconButton, NuLayout, filterMenu, t, useLocale, useTheme,
  type NuCommand,
} from 'nusa-admin'
import { roleLabel, useAuth } from '../auth'
import { menu as fullMenu } from '../menu'

const route = useRoute()
const router = useRouter()

/** Layout example pages override options through route meta (see router.ts). */
const meta = computed(() => route.meta as { layout?: 'sidebar' | 'top-nav'; boxed?: boolean; fixedNavbar?: boolean; fixedSidebar?: boolean; fixedFooter?: boolean; rtl?: boolean })

const auth = useAuth()
const user = computed(() => auth.user.value ?? { name: 'Guest', email: '', role: 'viewer' as const })
/** Hide what the signed-in role can't open (the router guard enforces it too). */
const menu = computed(() => filterMenu(fullMenu, (item) => auth.can(item.meta?.roles)))
function signOut() {
  auth.logout()
  router.push('/auth/login')
}

const palette = ref(false)
const isMac = typeof navigator !== 'undefined' && /Mac|iP(hone|ad)/.test(navigator.platform)
const { toggleDark } = useTheme()
const commands: NuCommand[] = [
  { label: 'New project', group: 'Actions', icon: Plus, to: '/projects/new', keywords: 'create add' },
  { label: 'Compose email', group: 'Actions', icon: MessageSquare, to: '/apps/mailbox/compose', keywords: 'mail write' },
  { label: 'Toggle dark mode', group: 'Actions', icon: Moon, action: toggleDark, keywords: 'theme light' },
  { label: 'Open control panel', group: 'Actions', icon: PanelRight, action: () => (controlPanel.value = true), keywords: 'layout settings customize' },
  { label: 'Lock screen', group: 'Actions', icon: Lock, to: '/auth/lock' },
  { label: 'Sign out', group: 'Actions', icon: LogOut, action: signOut, keywords: 'logout' },
]
const searchFallback = (q: string): NuCommand => ({ label: `Search everything for “${q}”`, group: 'Search', icon: Search, to: { path: '/search', query: { q } } })

const controlPanel = ref(false)
/** Switches the kit's built-in text (placeholders, labels, validation, dates). Page copy stays English. */
const { locale: language, setLocale } = useLocale()
const languages = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
]

const messages = [
  { from: 'Budi Santoso', text: 'Could you review the roadmap draft?', time: '4 min' },
  { from: 'Citra Dewi', text: 'Feedback summary is in your inbox.', time: '1 h' },
  { from: 'Dimas Pratama', text: 'Lunch on Friday?', time: '3 h' },
]
const notifications = [
  { title: 'New order #4821', time: '2 min ago' },
  { title: 'Server CPU above 80%', time: '18 min ago' },
  { title: 'Weekly report is ready', time: '1 hour ago' },
]
</script>

<template>
  <NuLayout
    :menu="menu"
    brand="Nusa Admin"
    sidebar-search
    fullscreen-toggle
    :layout="meta.layout"
    :boxed="meta.boxed"
    :fixed-navbar="meta.fixedNavbar"
    :fixed-sidebar="meta.fixedSidebar"
    :fixed-footer="meta.fixedFooter"
    :rtl="meta.rtl"
  >
    <template #sidebar-top>
      <RouterLink class="shell-userpanel" to="/profile">
        <NuAvatar :name="user.name" :size="32" status="online" />
        <span class="shell-userpanel__text">
          <strong>{{ user.name }}</strong>
          <small>{{ roleLabel[user.role] }}</small>
        </span>
      </RouterLink>
    </template>

    <template #navbar-start>
      <button class="shell-search" type="button" aria-label="Search or run a command (Ctrl+K)" @click="palette = true">
        <Search />
        <span class="nu-grow">{{ t('search') }}</span>
        <kbd>{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
      </button>
    </template>

    <template #navbar-end>
      <NuDropdown width="200px">
        <template #trigger><NuIconButton :icon="Languages" label="Language" /></template>
        <div class="nu-dropdown__header">Language</div>
        <NuDropdownItem v-for="l in languages" :key="l.code" :class="{ 'is-current': language === l.code }" :aria-current="language === l.code || undefined" @click="setLocale(l.code)">
          {{ l.label }}
        </NuDropdownItem>
      </NuDropdown>

      <NuDropdown width="320px">
        <template #trigger><NuIconButton :icon="MessageSquare" label="Messages" :badge="messages.length" /></template>
        <div class="nu-dropdown__header">Messages</div>
        <NuDropdownItem v-for="m in messages" :key="m.from" to="/apps/chat">
          <span class="shell-msg">
            <NuAvatar :name="m.from" :size="30" />
            <span class="nu-grow">
              <span class="nu-between"><strong>{{ m.from }}</strong><small class="nu-text-muted">{{ m.time }}</small></span>
              <span class="nu-text-sm nu-text-muted nu-truncate" style="display: block">{{ m.text }}</span>
            </span>
          </span>
        </NuDropdownItem>
        <div class="nu-dropdown__divider" />
        <NuDropdownItem to="/apps/mailbox">See all messages</NuDropdownItem>
      </NuDropdown>

      <NuDropdown width="300px">
        <template #trigger><NuIconButton :icon="Bell" label="Notifications" :badge="notifications.length" /></template>
        <div class="nu-dropdown__header">{{ notifications.length }} notifications</div>
        <NuDropdownItem v-for="n in notifications" :key="n.title">
          <div>{{ n.title }}</div>
          <div class="nu-text-sm nu-text-muted">{{ n.time }}</div>
        </NuDropdownItem>
      </NuDropdown>
    </template>

    <template #navbar-user>
      <NuDropdown width="260px">
        <template #trigger>
          <button class="shell-user" type="button" aria-label="Account menu">
            <NuAvatar :name="user.name" :size="28" status="online" />
            <span class="shell-user__name">{{ user.name }}</span>
          </button>
        </template>
        <div class="shell-usercard">
          <NuAvatar :name="user.name" :size="56" />
          <strong>{{ user.name }}</strong>
          <small>{{ user.email }}</small>
          <NuBadge color="success" dot>{{ roleLabel[user.role] }}</NuBadge>
        </div>
        <NuDropdownItem :icon="User" to="/profile">Profile</NuDropdownItem>
        <NuDropdownItem v-if="auth.can(['admin'])" :icon="CreditCard" to="/billing">Billing</NuDropdownItem>
        <NuDropdownItem v-if="auth.can(['admin'])" :icon="Settings" to="/settings">Settings</NuDropdownItem>
        <div class="nu-dropdown__divider" />
        <NuDropdownItem :icon="Lock" to="/auth/lock">Lock screen</NuDropdownItem>
        <NuDropdownItem :icon="LogOut" danger @click="signOut">Sign out</NuDropdownItem>
      </NuDropdown>
      <NuIconButton :icon="PanelRight" label="Control panel" @click="controlPanel = true" />
    </template>

    <RouterView />

    <template #footer>
      <span>© {{ new Date().getFullYear() }} Nusa Admin · <RouterLink to="/faq">Help</RouterLink></span>
      <span>Vue 3 · Vite · Bun</span>
    </template>
  </NuLayout>

  <NuCommandPalette v-model="palette" :menu="menu" :commands="commands" :fallback="searchFallback" />

  <NuCustomizer v-model="controlPanel" hide-trigger>
    <section>
      <h4>Shortcuts</h4>
      <NuButton size="sm" variant="soft" to="/layout/options" @click="controlPanel = false">All layout options</NuButton>
    </section>
  </NuCustomizer>
</template>

<style>
.shell-search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
  max-width: 100%;
  height: 32px;
  padding: 0 6px 0 10px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: color-mix(in srgb, var(--nu-text) 6%, transparent);
  color: var(--nu-text-muted);
  text-align: start;
  cursor: pointer;
}
.shell-search:hover { background: color-mix(in srgb, var(--nu-text) 9%, transparent); }
.shell-search svg { width: 16px; height: 16px; flex: none; }
.shell-search kbd { padding: 1px 5px; border: 1px solid var(--nu-border); border-radius: 4px; background: var(--nu-surface); font-size: 11px; }
.shell-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-inline-start: 4px;
  padding: 2px 8px 2px 2px;
  border: 0;
  border-radius: var(--nu-radius-sm);
  background: transparent;
  color: var(--nu-text);
  font-weight: 600;
  cursor: pointer;
}
.shell-user:hover { background: color-mix(in srgb, var(--nu-text) 7%, transparent); }
.shell-usercard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: -4px -4px 4px;
  padding: 14px 10px 10px;
  border-radius: var(--nu-radius) var(--nu-radius) 0 0;
  background: color-mix(in srgb, var(--nu-primary) 9%, var(--nu-surface));
  text-align: center;
}
.shell-usercard small { color: var(--nu-text-muted); margin-bottom: 4px; }
.shell-msg { display: flex; gap: 8px; width: 100%; min-width: 0; }
.shell-userpanel {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--nu-sidebar-border);
  color: var(--nu-sidebar-text-strong) !important;
  text-decoration: none !important;
  white-space: nowrap;
}
.shell-userpanel .nu-avatar__status { border-color: var(--nu-sidebar-bg); }
.shell-userpanel__text { display: flex; flex-direction: column; line-height: 1.3; min-width: 0; }
.shell-userpanel__text small { color: var(--nu-sidebar-muted); }
.nu-layout.is-collapsed .nu-layout__sidebar:not(:hover, :focus-within) .shell-userpanel__text { opacity: 0; }
@media (max-width: 640px) {
  .shell-user__name, .shell-search { display: none; }
}
/* The top-nav menu needs the room; search stays in the sidebar drawer and on /search. */
@media (min-width: 992px) {
  .nu-layout.is-top-nav .shell-search { display: none; }
}
@media (min-width: 992px) and (max-width: 1280px) {
  .nu-layout.is-top-nav .shell-user__name { display: none; }
}
</style>
