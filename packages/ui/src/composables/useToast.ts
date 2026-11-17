import { reactive, readonly } from 'vue'
import type { NuColor } from '../types'

export interface NuToast {
  id: number
  title?: string
  message: string
  color: NuColor
  /** ms before auto-dismiss; 0 keeps it until closed. */
  duration: number
}

export type NuToastInput = string | (Partial<Omit<NuToast, 'id'>> & { message: string })

const toasts = reactive<NuToast[]>([])
let seq = 0

function dismiss(id: number) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}

function push(input: NuToastInput, color?: NuColor) {
  const opts = typeof input === 'string' ? { message: input } : input
  const toast: NuToast = { id: ++seq, color: color ?? 'primary', duration: 4000, ...opts }
  if (color) toast.color = color
  toasts.push(toast)
  if (toast.duration > 0) setTimeout(() => dismiss(toast.id), toast.duration)
  return toast.id
}

/** Fire toasts from anywhere. Mount <NuToastHost /> once (NuLayout already does). */
export function useToast() {
  return {
    toasts: readonly(toasts) as readonly NuToast[],
    show: push,
    success: (input: NuToastInput) => push(input, 'success'),
    error: (input: NuToastInput) => push(input, 'danger'),
    warning: (input: NuToastInput) => push(input, 'warning'),
    info: (input: NuToastInput) => push(input, 'info'),
    dismiss,
  }
}
