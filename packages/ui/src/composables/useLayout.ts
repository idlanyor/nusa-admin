import { reactive, readonly } from 'vue'

export type NuSidebarVariant = 'dark' | 'light'

interface LayoutState {
  /** Desktop: sidebar shrunk to an icon rail (expands on hover). */
  collapsed: boolean
  /** Mobile: off-canvas sidebar is open. */
  mobileOpen: boolean
  sidebarVariant: NuSidebarVariant
  /** Horizontal menu in the navbar instead of a sidebar (desktop only). */
  topNav: boolean
  /** Centered, max-width page with the sidebar scrolling inside it. */
  boxed: boolean
  /** Navbar sticks to the top while scrolling. */
  fixedNavbar: boolean
  /** Sidebar stays in place while the page scrolls. */
  fixedSidebar: boolean
  /** Footer sticks to the bottom of the viewport. */
  fixedFooter: boolean
  /** Right-to-left text direction. */
  rtl: boolean
}

/** Layout options that are saved and can be toggled at runtime. */
export type NuLayoutOption = 'collapsed' | 'topNav' | 'boxed' | 'fixedNavbar' | 'fixedSidebar' | 'fixedFooter' | 'rtl'
const BOOLEAN_KEYS: NuLayoutOption[] = ['collapsed', 'topNav', 'boxed', 'fixedNavbar', 'fixedSidebar', 'fixedFooter', 'rtl']

const STORAGE_KEY = 'nu-layout'
const MOBILE_QUERY = '(max-width: 991.98px)'
const hasDom = typeof window !== 'undefined'

const state = reactive<LayoutState>({
  collapsed: false,
  mobileOpen: false,
  sidebarVariant: 'dark',
  topNav: false,
  boxed: false,
  fixedNavbar: true,
  fixedSidebar: true,
  fixedFooter: false,
  rtl: false,
})
let started = false
let hasSaved = false

function persist() {
  hasSaved = true
  try {
    const { mobileOpen: _transient, ...saved } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    /* storage unavailable */
  }
}

function applyDirection(rtl: boolean) {
  if (hasDom) document.documentElement.dir = rtl ? 'rtl' : 'ltr'
}

function start() {
  if (started || !hasDom) return
  started = true
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    hasSaved = raw !== null
    const saved = JSON.parse(raw || '{}')
    for (const key of BOOLEAN_KEYS) if (typeof saved[key] === 'boolean') state[key] = saved[key]
    if (saved.sidebarVariant === 'dark' || saved.sidebarVariant === 'light') state.sidebarVariant = saved.sidebarVariant
  } catch {
    /* ignore corrupt storage */
  }
  applyDirection(state.rtl)
}

/** Global sidebar state shared by NuLayout, NuNavbar and anything else that needs it. */
export function useLayout() {
  start()
  const isMobile = () => hasDom && window.matchMedia(MOBILE_QUERY).matches
  return {
    layout: readonly(state),
    isMobile,
    /** Mobile → open/close the drawer. Desktop → collapse/expand the rail. */
    toggleSidebar() {
      if (isMobile()) state.mobileOpen = !state.mobileOpen
      else {
        state.collapsed = !state.collapsed
        persist()
      }
    },
    setCollapsed(value: boolean) {
      state.collapsed = value
      persist()
    },
    closeMobile() {
      state.mobileOpen = false
    },
    /** App-level defaults: applied only while the visitor has no saved preference, never persisted. */
    setDefaults(defaults: { sidebarVariant?: NuSidebarVariant } & Partial<Record<NuLayoutOption, boolean>>) {
      if (hasSaved) return
      if (defaults.sidebarVariant) state.sidebarVariant = defaults.sidebarVariant
      for (const key of BOOLEAN_KEYS) if (typeof defaults[key] === 'boolean') state[key] = defaults[key]!
      applyDirection(state.rtl)
    },
    setOption(key: NuLayoutOption, value: boolean) {
      state[key] = value
      if (key === 'rtl') applyDirection(value)
      persist()
    },
    /** Set `<html dir>`; NuLayout uses this for pages that force a direction. */
    applyDirection,
    setSidebarVariant(variant: NuSidebarVariant) {
      state.sidebarVariant = variant
      persist()
    },
  }
}
