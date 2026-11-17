<script setup lang="ts">
import { ref } from 'vue'
import { CircleDollarSign, HardDrive, PackageCheck, ShoppingCart, ThumbsUp, Users } from 'lucide-vue-next'
import {
  NuBadge, NuCalendar, NuCard, NuDescriptions, NuInfoBox, NuPageHeader, NuRating, NuStatCard, NuTimeline,
} from 'nusa-admin'

const rating = ref(4)
const day = ref<string>()
</script>

<template>
  <NuPageHeader
    title="Data display"
    subtitle="Info boxes, descriptions, timelines, ratings and a compact calendar."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Data display' }]"
  />

  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Revenue" value="$84,600" :icon="CircleDollarSign" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Likes" value="41,410" :icon="ThumbsUp" color="danger" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Sales" value="760" :icon="ShoppingCart" color="success" :progress="70" description="70% of monthly target" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Storage" value="412 GB" :icon="HardDrive" color="warning" :progress="82" description="82% of 500 GB used" /></div>
    </div>

    <div class="nu-row">
      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Descriptions">
          <NuDescriptions
            :columns="2"
            :items="[
              { label: 'Customer', value: 'Ayu Lestari' },
              { label: 'Plan', key: 'plan' },
              { label: 'Email', value: 'ayu@example.com' },
              { label: 'Member since', value: '12 Mar 2024' },
              { label: 'Billing', value: 'Yearly' },
              { label: 'Next invoice', value: '12 Mar 2027' },
            ]"
          >
            <template #plan><NuBadge color="success">Business</NuBadge></template>
          </NuDescriptions>
        </NuCard>
        <NuCard title="Rating">
          <div class="nu-stack" style="--nu-gap: 8px">
            <div class="nu-cluster"><NuRating v-model="rating" /> <span class="nu-text-muted">{{ rating }} of 5</span></div>
            <div class="nu-cluster"><NuRating :model-value="3" readonly :size="14" /> <span class="nu-text-sm nu-text-muted">Read-only, small</span></div>
          </div>
        </NuCard>
      </div>

      <div class="nu-col-lg-4">
        <NuCard title="Timeline">
          <NuTimeline
            :items="[
              { title: 'Order delivered', time: '10:42', description: 'Signed by the customer', color: 'success', icon: PackageCheck },
              { title: 'Out for delivery', time: '08:15', description: 'Courier picked up the parcel', color: 'info' },
              { title: 'Payment received', time: 'Yesterday', description: '$237.00 via card', color: 'primary', icon: CircleDollarSign },
              { title: 'Order placed', time: 'Yesterday', description: 'Team plan × 3', color: 'secondary' },
            ]"
          />
        </NuCard>
      </div>

      <div class="nu-col-lg-4">
        <NuCard title="Compact calendar" flush>
          <NuCalendar
            v-model="day"
            compact
            :events="[
              { date: new Date().toISOString().slice(0, 10), title: 'Today' },
              { date: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10), title: 'Review', color: 'success' },
            ]"
          />
        </NuCard>
      </div>
    </div>

    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Soft stat" value="1,284" :icon="ShoppingCart" :delta="4.1" delta-label="vs last month" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Solid stat" value="9,312" :icon="Users" variant="solid" color="success" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Negative delta" value="318" color="danger" :delta="-2.4" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Inverted delta" value="1.9%" color="warning" :delta="-0.6" invert-delta delta-label="lower is better" /></div>
    </div>
  </div>
</template>
