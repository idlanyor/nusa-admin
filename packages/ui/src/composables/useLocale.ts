import { computed, reactive } from 'vue'
import { en, id, type NuMessageKey, type NuMessages } from '../locales'

const STORAGE_KEY = 'nu-locale'
const hasDom = typeof window !== 'undefined'

const state = reactive<{ locale: string; catalogs: Record<string, Partial<NuMessages>> }>({ locale: 'en', catalogs: { en, id } })
let started = false
let hasSaved = false

function start() {
  if (started || !hasDom) return
  started = true
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    hasSaved = saved !== null
    if (saved) state.locale = saved
  } catch {
    /* storage unavailable */
  }
  if (hasDom) document.documentElement.lang = state.locale
}

/** Translate a built-in string, falling back to English. */
export function t(key: NuMessageKey, params: Record<string, string | number> = {}): string {
  start()
  const text = state.catalogs[state.locale]?.[key] ?? en[key]
  return text.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`))
}

/**
 * Language of the kit's built-in text (and of dates/numbers it formats). Ships with `en` and `id`;
 * add others with `addMessages('ms', { ... })` — missing keys fall back to English.
 */
export function useLocale() {
  start()
  return {
    locale: computed(() => state.locale),
    /** BCP 47 tag for Intl/toLocale* calls. */
    intlLocale: computed(() => state.locale),
    t,
    setLocale(code: string) {
      state.locale = code
      hasSaved = true
      if (hasDom) {
        document.documentElement.lang = code
        try {
          localStorage.setItem(STORAGE_KEY, code)
        } catch {
          /* not persisted */
        }
      }
    },
    /** App default; ignored once the visitor picked a language. */
    setDefaultLocale(code: string) {
      if (hasSaved) return
      state.locale = code
      if (hasDom) document.documentElement.lang = code
    },
    addMessages(code: string, messages: Partial<NuMessages>) {
      state.catalogs[code] = { ...state.catalogs[code], ...messages }
    },
  }
}
