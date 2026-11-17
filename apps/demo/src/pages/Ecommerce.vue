<script setup lang="ts">
import { ref } from 'vue'
import { Heart, ShoppingCart } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuPageHeader, NuRating, NuSegmented, NuTabs, NuTimeline, useToast } from 'nusa-admin'
import { placeholderImage } from '../data'

const toast = useToast()
const images = [0, 1, 2, 3, 4].map((i) => ({ big: placeholderImage(i + 10, 800, 600, 'Desk lamp'), thumb: placeholderImage(i + 10, 160, 120) }))
const active = ref(0)
const color = ref('graphite')
const size = ref('m')
const qty = ref(1)
const tab = ref('description')
</script>

<template>
  <NuPageHeader title="E-commerce" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'E-commerce' }]" />

  <NuCard>
    <div class="nu-row">
      <div class="nu-col-md-6">
        <img class="product__main" :src="images[active]!.big" alt="Aurora desk lamp, selected view" />
        <div class="product__thumbs">
          <button v-for="(img, i) in images" :key="i" type="button" :class="{ 'is-active': i === active }" :aria-label="`View image ${i + 1}`" @click="active = i">
            <img :src="img.thumb" alt="" />
          </button>
        </div>
      </div>
      <div class="nu-col-md-6 nu-stack" style="--nu-gap: 12px">
        <div>
          <NuBadge color="success">In stock</NuBadge>
          <h2 class="product__title">Aurora desk lamp</h2>
          <div class="nu-cluster"><NuRating :model-value="4" readonly :size="15" /><span class="nu-text-sm nu-text-muted">4.0 · 128 reviews</span></div>
        </div>
        <p class="nu-text-muted">Dimmable LED lamp with a warm-to-cool color range, a USB-C charging port in the base and a weighted aluminium arm.</p>
        <div>
          <div class="nu-field__label" style="margin-bottom: 4px">Color</div>
          <NuSegmented v-model="color" label="Color" :options="[{ label: 'Graphite', value: 'graphite' }, { label: 'Sand', value: 'sand' }, { label: 'Sage', value: 'sage' }]" />
        </div>
        <div>
          <div class="nu-field__label" style="margin-bottom: 4px">Size</div>
          <NuSegmented v-model="size" label="Size" :options="[{ label: 'S', value: 's' }, { label: 'M', value: 'm' }, { label: 'L', value: 'l' }, { label: 'XL', value: 'xl', disabled: true }]" />
        </div>
        <div class="product__price">
          <strong>$80.00</strong>
          <s class="nu-text-muted">$99.00</s>
          <NuBadge color="danger">−19%</NuBadge>
        </div>
        <div class="nu-cluster">
          <div class="product__qty">
            <button type="button" aria-label="Decrease quantity" @click="qty = Math.max(1, qty - 1)">−</button>
            <span aria-live="polite">{{ qty }}</span>
            <button type="button" aria-label="Increase quantity" @click="qty++">+</button>
          </div>
          <NuButton size="lg" :icon="ShoppingCart" @click="toast.success(`${qty} × Aurora desk lamp added to cart.`)">Add to cart</NuButton>
          <NuButton size="lg" variant="outline" color="secondary" :icon="Heart" square aria-label="Add to wishlist" @click="toast.info('Saved to wishlist.')" />
        </div>
      </div>
    </div>

    <div style="margin-top: 16px">
      <NuTabs v-model="tab" :tabs="[{ key: 'description', label: 'Description' }, { key: 'specs', label: 'Specifications' }, { key: 'reviews', label: 'Reviews (3)' }]">
        <template #description>
          <p>Designed for long evenings at the desk: flicker-free light, five brightness levels and a memory function that restores your last setting.</p>
        </template>
        <template #specs>
          <table class="st st--striped" style="max-width: 520px">
            <tbody>
              <tr><td>Power</td><td>10 W LED, USB-C 5 V / 2 A</td></tr>
              <tr><td>Color temperature</td><td>2700–6500 K</td></tr>
              <tr><td>Height</td><td>42 cm (arm extended 58 cm)</td></tr>
              <tr><td>Warranty</td><td>2 years</td></tr>
            </tbody>
          </table>
        </template>
        <template #reviews>
          <NuTimeline
            :items="[
              { title: 'Great light, sturdy base — Ayu', time: '★★★★★', description: 'The warm setting is perfect for reading.', color: 'success' },
              { title: 'Good, but the cable is short — Budi', time: '★★★★', description: 'Bought an extension; otherwise excellent.', color: 'info' },
              { title: 'Arrived scratched — Citra', time: '★★★', description: 'Support replaced it within a week.', color: 'warning' },
            ]"
          />
        </template>
      </NuTabs>
    </div>
  </NuCard>
</template>

<style>
.product__main { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--nu-radius); }
.product__thumbs { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-top: 6px; }
.product__thumbs button { padding: 0; border: 2px solid transparent; border-radius: var(--nu-radius-sm); overflow: hidden; background: none; cursor: pointer; opacity: 0.7; }
.product__thumbs button.is-active { border-color: var(--nu-primary); opacity: 1; }
.product__thumbs img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.product__title { margin: 6px 0 2px; font-size: 22px; font-weight: 700; }
.product__price { display: flex; align-items: baseline; gap: 8px; }
.product__price strong { font-size: 26px; font-weight: 800; }
.product__qty { display: inline-flex; align-items: center; height: 38px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); }
.product__qty button { width: 34px; height: 100%; border: 0; background: transparent; color: var(--nu-text); font-size: 16px; cursor: pointer; }
.product__qty button:hover { background: var(--nu-surface-2); }
.product__qty span { min-width: 30px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
</style>
