import { reactive, readonly } from 'vue'
import type { NuColor } from '../types'

export interface NuConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Red confirm button for destructive actions. */
  danger?: boolean
  color?: NuColor
  /** User must type this text before confirming (e.g. the resource name). */
  typeToConfirm?: string
}

interface Pending extends NuConfirmOptions {
  id: number
  resolve: (ok: boolean) => void
}

const state = reactive<{ current: Pending | null; queue: Pending[] }>({ current: null, queue: [] })
let seq = 0

function next() {
  state.current = state.queue.shift() ?? null
}

/**
 * Promise-based confirm dialog: `if (await confirm({ title: 'Delete project?', danger: true })) …`.
 * Needs one <NuConfirmHost /> (NuLayout includes it). Calls queue up.
 */
export function useConfirm() {
  function confirm(input: NuConfirmOptions | string): Promise<boolean> {
    const opts = typeof input === 'string' ? { title: input } : input
    return new Promise((resolve) => {
      state.queue.push({ ...opts, id: ++seq, resolve })
      if (!state.current) next()
    })
  }
  function settle(ok: boolean) {
    const cur = state.current
    if (!cur) return
    cur.resolve(ok)
    next()
  }
  return { confirm, settle, pending: readonly(state) }
}
