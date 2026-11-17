import type { NuTableColumn } from '../types'

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : String(v)
  // Quote when needed; neutralise leading formula characters so spreadsheets don't execute them.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

/** CSV text for rows, using each column's label and `format` (if any). */
export function toCsv<T extends Record<string, any>>(rows: T[], columns: NuTableColumn<T>[]): string {
  const cols = columns.filter((c) => c.label)
  const header = cols.map((c) => cell(c.label)).join(',')
  const body = rows.map((row) => cols.map((c) => cell(c.format ? c.format(row[c.key], row) : row[c.key])).join(','))
  return [header, ...body].join('\r\n')
}

/** Ask the browser to save `text` as a file. */
export function downloadText(filename: string, text: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([type.startsWith('text/csv') ? '﻿' + text : text], { type })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
