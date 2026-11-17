<script setup lang="ts">
import { CircleDollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-vue-next'
import { NuCard, NuChart, NuDonut, NuPageHeader, NuSparkline, NuStatCard, NuTimeline } from 'nusa-admin'

// Replace these sample numbers with your own data.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenue = [42, 46, 51, 50, 56, 62, 59, 66, 72, 70, 77, 85].map((v) => v * 1000)
const costs = [31, 33, 35, 37, 37, 40, 41, 43, 44, 46, 47, 50].map((v) => v * 1000)
const usdK = (v: number) => `$${Math.round(v / 1000)}K`
</script>

<template>
  <NuPageHeader title="Dashboard" subtitle="Your numbers at a glance." />
  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Revenue" value="$84,600" :icon="CircleDollarSign" :delta="9.4" delta-label="vs last month">
          <NuSparkline :data="revenue" label="Revenue, last 12 months" />
        </NuStatCard>
      </div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Orders" value="1,284" :icon="ShoppingCart" color="info" :delta="4.1" delta-label="vs last month" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Customers" value="9,312" :icon="Users" color="success" :delta="2.8" delta-label="vs last month" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Conversion" value="3.1%" :icon="TrendingUp" color="warning" :delta="-0.4" delta-label="vs last month" /></div>
    </div>
    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="Revenue vs costs" subtitle="Last 12 months" collapsible maximizable>
          <NuChart type="area" :labels="months" :series="[{ name: 'Revenue', data: revenue }, { name: 'Costs', data: costs }]" :format="usdK" />
        </NuCard>
      </div>
      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Traffic by channel">
          <NuDonut :segments="[{ label: 'Organic', value: 4820 }, { label: 'Direct', value: 2960 }, { label: 'Social', value: 1740 }]" total-label="Sessions" :size="150" />
        </NuCard>
        <NuCard title="Activity">
          <NuTimeline
            :items="[
              { title: 'Project created', time: 'now', color: 'primary' },
              { title: 'Open Users to manage accounts', time: 'next', color: 'info' },
            ]"
          />
        </NuCard>
      </div>
    </div>
  </div>
</template>
