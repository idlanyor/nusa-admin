import { reactive, readonly } from 'vue'

export type NuThemeMode = 'light' | 'dark' | 'auto'

interface ThemeState {
  mode: NuThemeMode
  /** Custom brand color (any CSS color) or null for the token default. */
  primary: string | null
  /** What `mode` currently resolves to. */
  resolved: 'light' | 'dark'
}

const STORAGE_KEY = 'nu-theme'
const hasDom = typeof window !== 'undefined'

const state = reactive<ThemeState>({ mode: 'auto', primary: null, resolved: 'light' })
let started = false
let hasSaved = false

function systemDark() {
  return hasDom && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply() {
  state.resolved = state.mode === 'auto' ? (systemDark() ? 'dark' : 'light') : state.mode
  if (!hasDom) return
  const root = document.documentElement
  root.dataset.theme = state.resolved
  if (state.primary) root.style.setProperty('--nu-primary', state.primary)
  else root.style.removeProperty('--nu-primary')
}

function persist() {
  hasSaved = true
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: state.mode, primary: state.primary }))
  } catch {
    /* storage unavailable — theme simply won't persist */
  }
}

function start() {
  if (started) return
  started = true
  if (hasDom) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      hasSaved = raw !== null
      const saved = JSON.parse(raw || '{}')
      if (saved.mode === 'light' || saved.mode === 'dark' || saved.mode === 'auto') state.mode = saved.mode
      if (typeof saved.primary === 'string') state.primary = saved.primary
    } catch {
      /* ignore corrupt storage */
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply)
  }
  apply()
}

/** Global light/dark + brand-color state, persisted to localStorage. */
export function useTheme() {
  start()
  return {
    theme: readonly(state),
    /** App-level defaults: applied only while the visitor has no saved preference, never persisted. */
    setDefaults(defaults: { mode?: NuThemeMode; primary?: string }) {
      if (hasSaved) return
      if (defaults.mode) state.mode = defaults.mode
      if (defaults.primary) state.primary = defaults.primary
      apply()
    },
    setMode(mode: NuThemeMode) {
      state.mode = mode
      apply()
      persist()
    },
    toggleDark() {
      state.mode = state.resolved === 'dark' ? 'light' : 'dark'
      apply()
      persist()
    },
    setPrimary(color: string | null) {
      state.primary = color
      apply()
      persist()
    },
  }
}
