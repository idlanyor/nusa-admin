import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Open overlays, bottom → top. Only the top one reacts to Escape/Tab. */
const stack: symbol[] = []
let savedOverflow = ''
let savedPadding = ''

function lockScroll() {
  const body = document.body
  savedOverflow = body.style.overflow
  savedPadding = body.style.paddingRight
  // Compensate for the scrollbar so the page doesn't shift sideways.
  const gap = window.innerWidth - document.documentElement.clientWidth
  if (gap > 0) body.style.paddingRight = `${gap}px`
  body.style.overflow = 'hidden'
}
function unlockScroll() {
  document.body.style.overflow = savedOverflow
  document.body.style.paddingRight = savedPadding
}

function focusables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('inert'))
}

/**
 * Modal behaviour for a dialog-like panel: locks page scroll, moves focus inside,
 * keeps Tab within the panel, closes on Escape, and returns focus to whatever
 * opened it. Overlays stack — only the topmost handles keys.
 */
export function useOverlay(
  open: Ref<boolean>,
  panel: Ref<HTMLElement | null>,
  options: { onEscape?: () => void } = {},
) {
  const id = Symbol('overlay')
  let returnTo: HTMLElement | null = null
  let active = false

  function onKeydown(e: KeyboardEvent) {
    if (stack[stack.length - 1] !== id || !panel.value) return
    if (e.key === 'Escape') {
      options.onEscape?.()
      return
    }
    if (e.key !== 'Tab') return
    const items = focusables(panel.value)
    if (!items.length) {
      e.preventDefault()
      panel.value.focus()
      return
    }
    const first = items[0]!
    const last = items[items.length - 1]!
    const current = document.activeElement
    if (!panel.value.contains(current)) {
      e.preventDefault()
      first.focus()
    } else if (e.shiftKey && (current === first || current === panel.value)) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && current === last) {
      e.preventDefault()
      first.focus()
    }
  }

  async function activate() {
    if (active || typeof document === 'undefined') return
    active = true
    returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!stack.length) lockScroll()
    stack.push(id)
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    const el = panel.value
    if (!el || !active) return
    const target = el.querySelector<HTMLElement>('[autofocus]') ?? focusables(el.querySelector<HTMLElement>('[data-overlay-body]') ?? el)[0] ?? el
    target.focus({ preventScroll: true })
  }

  function deactivate() {
    if (!active) return
    active = false
    document.removeEventListener('keydown', onKeydown)
    const i = stack.indexOf(id)
    if (i !== -1) stack.splice(i, 1)
    if (!stack.length) unlockScroll()
    returnTo?.focus({ preventScroll: true })
    returnTo = null
  }

  watch(open, (isOpen) => (isOpen ? activate() : deactivate()), { immediate: true })
  onBeforeUnmount(deactivate)
}
