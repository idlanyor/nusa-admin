import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type NuColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
export type NuSize = 'sm' | 'md' | 'lg'

/** One entry of the sidebar menu. Nest with `children`; use `header` for a section title. */
export interface NuMenuItem {
  label: string
  icon?: Component
  to?: RouteLocationRaw
  href?: string
  target?: string
  badge?: string | number
  badgeColor?: NuColor
  children?: NuMenuItem[]
  /** Render as a non-interactive section heading. */
  header?: boolean
  /** Colors the bullet of an icon-less item (AdminLTE "labels"). */
  color?: NuColor
  /** Free-form app data, e.g. `{ roles: ['admin'] }` for use with `filterMenu()`. */
  meta?: Record<string, unknown>
}

export interface NuBreadcrumbItem {
  label: string
  to?: RouteLocationRaw
}

export interface NuTableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  /** Format the raw value for display (ignored when a `cell-<key>` slot is used). */
  format?: (value: any, row: T) => string
}

export interface NuOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface NuTab {
  key: string
  label: string
  icon?: Component
  disabled?: boolean
}

export interface NuChartSeries {
  name: string
  data: number[]
  /** Any CSS color. Defaults to the categorical chart tokens, in order. */
  color?: string
}

export interface NuDonutSegment {
  label: string
  value: number
  color?: string
}

export interface NuTimelineItem {
  /** A date separator pill instead of an event (other fields are ignored). */
  label?: string
  title?: string
  time?: string
  description?: string
  color?: NuColor
  icon?: Component
}
