<script setup lang="ts">
import { t } from '../composables/useLocale'
import { computed, ref } from 'vue'
import { useElementWidth } from '../composables/useElementWidth'

type Position = number[]
interface Geometry {
  type: string
  coordinates: any
}
export interface NuGeoFeature {
  id?: string | number
  properties?: Record<string, any> | null
  geometry: Geometry | null
}

/**
 * Choropleth map from GeoJSON features (bring your own data, e.g. `world-atlas` + `topojson-client`).
 * Values are colored with the sequential `--nu-seq-*` ramp; features without a value use `--nu-seq-empty`.
 */
const props = withDefaults(
  defineProps<{
    features: NuGeoFeature[]
    values: Record<string, number>
    /** How to get a feature's key into `values`. Defaults to `properties.name`. */
    keyOf?: (f: NuGeoFeature) => string
    /** Width ÷ height of the drawing. */
    aspect?: number
    /** Format values in the tooltip and legend. */
    format?: (v: number) => string
    /** Accessible summary (also provide the numbers as text elsewhere, e.g. a list or table). */
    label?: string
    /** Feature keys to leave out, e.g. ['Antarctica']. */
    exclude?: string[]
  }>(),
  { aspect: 2, label: 'Map', exclude: () => [] },
)

const el = ref<HTMLElement | null>(null)
const width = useElementWidth(el, 640)
const height = computed(() => Math.round(width.value / props.aspect))
const hover = ref<{ name: string; value?: number; x: number; y: number } | null>(null)

const nameOf = (f: NuGeoFeature) => props.keyOf?.(f) ?? String(f.properties?.name ?? f.id ?? '')
const fmt = (v: number) => (props.format ? props.format(v) : v.toLocaleString())
const shown = computed(() => props.features.filter((f) => f.geometry && !props.exclude.includes(nameOf(f))))

function polygons(g: Geometry): Position[][][] {
  if (g.type === 'Polygon') return [g.coordinates]
  if (g.type === 'MultiPolygon') return g.coordinates
  return []
}

/** Bounds of every vertex, for an equirectangular fit. */
const bounds = computed(() => {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const f of shown.value)
    for (const poly of polygons(f.geometry!))
      for (const ring of poly)
        for (const [x, y] of ring) {
          if (x! < x0) x0 = x!
          if (x! > x1) x1 = x!
          if (y! < y0) y0 = y!
          if (y! > y1) y1 = y!
        }
  return { x0, y0, x1, y1 }
})

const paths = computed(() => {
  const { x0, y0, x1, y1 } = bounds.value
  const pad = 4
  const k = Math.min((width.value - pad * 2) / (x1 - x0 || 1), (height.value - pad * 2) / (y1 - y0 || 1))
  const ox = (width.value - (x1 - x0) * k) / 2
  const oy = (height.value - (y1 - y0) * k) / 2
  const half = ((x1 - x0) * k) / 2
  return shown.value.map((f) => {
    let d = ''
    for (const poly of polygons(f.geometry!))
      for (const ring of poly) {
        let prev: number | null = null
        ring.forEach(([lon, lat], i) => {
          const x = ox + (lon! - x0) * k
          const y = oy + (y1 - lat!) * k
          // Start a new sub-path where a ring jumps across the map (antimeridian).
          const jump = prev !== null && Math.abs(x - prev) > half
          d += `${i === 0 || jump ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
          prev = x
        })
        d += 'Z'
      }
    const name = nameOf(f)
    return { name, d, value: props.values[name] }
  })
})

/** Five equal-width bins from 0 to the largest value, rounded to a clean step. */
const bins = computed(() => {
  const max = Math.max(0, ...Object.values(props.values))
  if (!max) return [1, 2, 3, 4, 5]
  const rough = max / 5
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough)!
  return [1, 2, 3, 4, 5].map((i) => step * i)
})
const level = (v?: number) => (v === undefined ? 0 : Math.min(5, bins.value.findIndex((b) => v <= b) + 1 || 5))

function onMove(e: PointerEvent, p: { name: string; value?: number }) {
  const r = el.value!.getBoundingClientRect()
  hover.value = { ...p, x: e.clientX - r.left, y: e.clientY - r.top }
}
</script>

<template>
  <figure class="nu-geomap">
    <div ref="el" class="nu-geomap__plot" @pointerleave="hover = null">
      <svg :width="width" :height="height" role="img" :aria-label="label">
        <path
          v-for="p in paths"
          :key="p.name"
          :d="p.d"
          class="nu-geomap__shape"
          :class="{ 'is-hover': hover?.name === p.name }"
          :style="{ fill: `var(--nu-seq-${level(p.value) || 'empty'})` }"
          @pointermove="onMove($event, p)"
        />
      </svg>
      <div
        v-if="hover"
        class="nu-geomap__tip"
        :style="{ left: `${hover.x}px`, top: `${hover.y}px`, transform: `translate(${hover.x > width / 2 ? 'calc(-100% - 12px)' : '12px'}, -50%)` }"
      >
        <strong>{{ hover.name }}</strong>
        <span>{{ hover.value === undefined ? t('noData') : fmt(hover.value) }}</span>
      </div>
    </div>
    <figcaption class="nu-geomap__legend">
      <span v-for="(b, i) in bins" :key="b" class="nu-geomap__bin">
        <i :style="{ background: `var(--nu-seq-${i + 1})` }" />{{ i === 0 ? '≤' : '' }}{{ fmt(b) }}
      </span>
      <span class="nu-geomap__bin"><i style="background: var(--nu-seq-empty)" />{{ t('noData') }}</span>
    </figcaption>
  </figure>
</template>

<style>
.nu-geomap { margin: 0; }
.nu-geomap__plot { position: relative; width: 100%; direction: ltr; }
.nu-geomap__plot svg { display: block; }
.nu-geomap__shape { stroke: var(--nu-surface); stroke-width: 0.6; stroke-linejoin: round; transition: opacity 0.12s ease; }
.nu-geomap__shape.is-hover { stroke: var(--nu-text); stroke-width: 1.2; }
.nu-geomap__plot:hover .nu-geomap__shape:not(.is-hover) { opacity: 0.85; }
.nu-geomap__tip {
  position: absolute;
  z-index: 5;
  display: flex;
  flex-direction: column;
  padding: 6px 9px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow);
  font-size: 12.5px;
  white-space: nowrap;
  pointer-events: none;
}
.nu-geomap__tip span { color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
.nu-geomap__legend { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; font-size: 12px; color: var(--nu-text-muted); font-variant-numeric: tabular-nums; }
.nu-geomap__bin { display: inline-flex; align-items: center; gap: 5px; }
.nu-geomap__bin i { width: 14px; height: 10px; border-radius: 2px; }
</style>
