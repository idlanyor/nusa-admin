<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, LogOut, Moon, Search, User } from 'lucide-vue-next'
import { NuAvatar, NuCommandPalette, NuDropdown, NuDropdownItem, NuLayout, filterMenu, t, useTheme, type NuCommand } from 'nusa-admin'
import { roleLabel, useAuth } from '../auth'
import { menu as fullMenu } from '../menu'

const router = useRouter()
const auth = useAuth()
const user = computed(() => auth.user.value ?? { name: 'Guest', email: '', role: 'viewer' as const })
const menu = computed(() => filterMenu(fullMenu, (item) => auth.can(item.meta?.roles)))

function signOut() {
  auth.logout()
  router.push('/auth/login')
}

const palette = ref(false)
const commands: NuCommand[] = [
  { label: 'Toggle dark mode', group: 'Actions', icon: Moon, action: useTheme().toggleDark },
  { label: 'Lock screen', group: 'Actions', icon: Lock, to: '/auth/lock' },
  { label: 'Sign out', group: 'Actions', icon: LogOut, action: signOut },
]
</script>

<template>
  <NuLayout :menu="menu" brand="__TITLE__" sidebar-search fullscreen-toggle customizer>
    <template #navbar-start>
      <button class="shell-search" type="button" aria-label="Search or run a command (Ctrl+K)" @click="palette = true">
        <Search /><span class="nu-grow">{{ t('search') }}</span><kbd>Ctrl K</kbd>
      </button>
    </template>
    <template #navbar-user>
      <NuDropdown width="240px">
        <template #trigger>
          <button class="shell-user" type="button" aria-label="Account menu">
            <NuAvatar :name="user.name" :size="28" status="online" />
            <span class="shell-user__name">{{ user.name }}</span>
          </button>
        </template>
        <div class="nu-dropdown__header">{{ user.email }} · {{ roleLabel[user.role] }}</div>
        <NuDropdownItem :icon="User" to="/settings">Settings</NuDropdownItem>
        <NuDropdownItem :icon="Lock" to="/auth/lock">Lock screen</NuDropdownItem>
        <div class="nu-dropdown__divider" />
        <NuDropdownItem :icon="LogOut" danger @click="signOut">Sign out</NuDropdownItem>
      </NuDropdown>
    </template>

    <RouterView />

    <template #footer>
      <span>© {{ new Date().getFullYear() }} __TITLE__</span>
      <span>Built with Nusa Admin</span>
    </template>
  </NuLayout>
  <NuCommandPalette v-model="palette" :menu="menu" :commands="commands" />
</template>

<style>
.shell-search { display: flex; align-items: center; gap: 8px; width: 240px; max-width: 100%; height: 32px; padding: 0 6px 0 10px; border: 0; border-radius: var(--nu-radius-sm); background: color-mix(in srgb, var(--nu-text) 6%, transparent); color: var(--nu-text-muted); cursor: pointer; text-align: start; }
.shell-search svg { width: 16px; height: 16px; flex: none; }
.shell-search kbd { padding: 1px 5px; border: 1px solid var(--nu-border); border-radius: 4px; background: var(--nu-surface); font-size: 11px; }
.shell-user { display: flex; align-items: center; gap: 8px; margin-inline-start: 4px; padding: 2px 8px 2px 2px; border: 0; border-radius: var(--nu-radius-sm); background: transparent; color: var(--nu-text); font-weight: 600; cursor: pointer; }
.shell-user:hover { background: color-mix(in srgb, var(--nu-text) 7%, transparent); }
@media (max-width: 640px) { .shell-user__name, .shell-search { display: none; } }
</style>
