<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { NuCard, NuPageHeader, NuSegmented } from 'nusa-admin'
import { placeholderImage } from '../../data'

const categories = ['Nature', 'City', 'People', 'Abstract']
const photos = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  title: `${categories[i % 4]} ${Math.floor(i / 4) + 1}`,
  category: categories[i % 4]!,
  src: placeholderImage(i, 640, 420, `${categories[i % 4]} ${Math.floor(i / 4) + 1}`),
  thumb: placeholderImage(i, 320, 210),
}))

const filter = ref('All')
const shown = computed(() => (filter.value === 'All' ? photos : photos.filter((p) => p.category === filter.value)))
const open = ref<number | null>(null)
const current = computed(() => (open.value === null ? null : shown.value[open.value]))

function step(d: number) {
  if (open.value === null) return
  open.value = (open.value + d + shown.value.length) % shown.value.length
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = null
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}
watch(open, (v) => (v === null ? document.removeEventListener('keydown', onKey) : document.addEventListener('keydown', onKey)))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <NuPageHeader title="Gallery" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Apps' }, { label: 'Gallery' }]">
    <NuSegmented v-model="filter" label="Filter" :options="['All', ...categories].map((c) => ({ label: c, value: c }))" />
  </NuPageHeader>

  <NuCard>
    <div class="gallery">
      <button v-for="(p, i) in shown" :key="p.id" class="gallery__item" type="button" :aria-label="`Open ${p.title}`" @click="open = i">
        <img :src="p.thumb" :alt="p.title" loading="lazy" />
        <span>{{ p.title }}</span>
      </button>
    </div>
  </NuCard>

  <Teleport to="body">
    <div v-if="current" class="lightbox" role="dialog" aria-modal="true" :aria-label="current.title" @click.self="open = null">
      <button class="lightbox__btn lightbox__close" type="button" aria-label="Close" @click="open = null"><X /></button>
      <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photo" @click="step(-1)"><ChevronLeft /></button>
      <figure>
        <img :src="current.src" :alt="current.title" />
        <figcaption>{{ current.title }} · {{ (open ?? 0) + 1 }} / {{ shown.length }}</figcaption>
      </figure>
      <button class="lightbox__btn lightbox__next" type="button" aria-label="Next photo" @click="step(1)"><ChevronRight /></button>
    </div>
  </Teleport>
</template>

<style>
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
.gallery__item { position: relative; padding: 0; border: 0; border-radius: var(--nu-radius-sm); overflow: hidden; background: none; cursor: zoom-in; aspect-ratio: 32 / 21; }
.gallery__item img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.25s ease; }
.gallery__item:hover img { transform: scale(1.05); }
.gallery__item span { position: absolute; inset: auto 0 0; padding: 14px 8px 5px; background: linear-gradient(transparent, rgba(0, 0, 0, 0.55)); color: #fff; font-size: 12.5px; font-weight: 600; text-align: left; }
.lightbox { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: 48px 56px; background: rgba(0, 0, 0, 0.88); }
.lightbox figure { margin: 0; max-width: 100%; }
.lightbox img { display: block; max-width: min(1000px, 100%); max-height: calc(100vh - 140px); border-radius: var(--nu-radius-sm); }
.lightbox figcaption { margin-top: 8px; color: #e5e5e5; font-size: 13px; text-align: center; }
.lightbox__btn { position: absolute; display: grid; place-items: center; width: 38px; height: 38px; border: 0; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; cursor: pointer; }
.lightbox__btn:hover { background: rgba(255, 255, 255, 0.24); }
.lightbox__close { top: 12px; right: 12px; }
.lightbox__prev { left: 10px; top: 50%; transform: translateY(-50%); }
.lightbox__next { right: 10px; top: 50%; transform: translateY(-50%); }
</style>
