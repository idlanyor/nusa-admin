import type { NuMenuItem } from '../types'

/**
 * Keep only the menu items `allow` accepts (e.g. by role). Groups left without children and
 * section headers left without items are removed too.
 */
export function filterMenu(items: NuMenuItem[], allow: (item: NuMenuItem) => boolean): NuMenuItem[] {
  const kept: NuMenuItem[] = []
  for (const item of items) {
    if (!item.header && !allow(item)) continue
    if (item.children?.length) {
      const children = filterMenu(item.children, allow)
      if (children.length) kept.push({ ...item, children })
      continue
    }
    kept.push(item)
  }
  // Drop headers that no longer have anything under them.
  return kept.filter((item, i) => !item.header || (kept[i + 1] !== undefined && !kept[i + 1]!.header))
}
