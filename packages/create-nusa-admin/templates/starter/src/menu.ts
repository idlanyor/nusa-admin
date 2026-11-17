import { LayoutDashboard, Settings, Users } from 'lucide-vue-next'
import type { NuMenuItem } from 'nusa-admin'

/** One array drives the sidebar, the top-nav layout and the command palette. */
export const menu: NuMenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Management', header: true },
  { label: 'Users', icon: Users, to: '/users', meta: { roles: ['admin'] } },
  { label: 'Settings', icon: Settings, to: '/settings', meta: { roles: ['admin'] } },
]
