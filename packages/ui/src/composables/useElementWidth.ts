import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/** Tracks an element's content width (used by the SVG charts to stay responsive). */
export function useElementWidth(el: Ref<HTMLElement | null>, fallback = 600) {
  const width = ref(fallback)
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!el.value) return
    width.value = el.value.clientWidth || fallback
    observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) width.value = w
    })
    observer.observe(el.value)
  })
  onBeforeUnmount(() => observer?.disconnect())

  return width
}
