import { computed, reactive } from 'vue'

/**
 * Demo-only session. Replace `login()` with a call to your API; keep the shape
 * (user + role) and the router guard and menu filtering keep working.
 */
export type Role = 'admin' | 'editor' | 'viewer'
export interface SessionUser {
  name: string
  email: string
  role: Role
}

const KEY = 'nu-demo-session'
const state = reactive<{ user: SessionUser | null }>({ user: null })

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
  if (saved && typeof saved.email === 'string' && ['admin', 'editor', 'viewer'].includes(saved.role)) state.user = saved
} catch {
  /* no session */
}

function persist() {
  try {
    if (state.user) localStorage.setItem(KEY, JSON.stringify(state.user))
    else localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: session lasts for this tab only */
  }
}

export const roleLabel: Record<Role, string> = { admin: 'Administrator', editor: 'Editor', viewer: 'Viewer' }

export function useAuth() {
  return {
    user: computed(() => state.user),
    isAuthenticated: computed(() => !!state.user),
    login(email: string, role: Role = 'admin') {
      const local = email.split('@')[0] || 'user'
      const name = local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      state.user = { name: name === 'Ayu' ? 'Ayu Lestari' : name, email, role }
      persist()
    },
    logout() {
      state.user = null
      persist()
    },
    /** True when the user has one of `roles` (or `roles` is empty). */
    can(roles?: readonly Role[] | unknown) {
      if (!Array.isArray(roles) || !roles.length) return true
      return !!state.user && roles.includes(state.user.role)
    },
  }
}
