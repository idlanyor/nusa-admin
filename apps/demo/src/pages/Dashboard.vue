<script setup lang="ts">
import { CircleDollarSign, Download, PackageCheck, ShoppingCart, UserPlus, Users, TriangleAlert } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuChart, NuDonut, NuPageHeader, NuProgress, NuSparkline, NuStatCard,
  NuTable, NuTimeline, type NuTableColumn, type NuTimelineItem,
} from 'nusa-admin'
import { channels, expenses, months, orders, revenue, statusColor, usd, type Order } from '../data'

const columns: NuTableColumn<Order>[] = [
  { key: 'id', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount', align: 'right', format: usd },
  { key: 'status', label: 'Status' },
]

const activity: NuTimelineItem[] = [
  { title: 'Order #4821 paid', time: '2m', description: 'Ayu Lestari · Team plan', color: 'success', icon: PackageCheck },
  { title: 'New customer signed up', time: '26m', description: 'Dimas Pratama joined via referral', color: 'primary', icon: UserPlus },
  { title: 'Payment failed', time: '1h', description: 'Card declined on order #4814', color: 'danger', icon: TriangleAlert },
  { title: 'Monthly report exported', time: '3h', description: 'October revenue summary (PDF)', color: 'info', icon: Download },
]

const goals = [
  { label: 'Quarterly revenue', value: 78, color: 'primary' },
  { label: 'New customers', value: 54, color: 'info' },
  { label: 'Support SLA', value: 92, color: 'success' },
] as const
</script>

<template>
  <NuPageHeader title="Dashboard" subtitle="Here's what's happening with your store today.">
    <NuButton variant="outline" color="secondary" :icon="Download">Export</NuButton>
    <NuButton :icon="ShoppingCart">New order</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Revenue" value="$84,600" :icon="CircleDollarSign" :delta="9.4" delta-label="vs last month">
          <NuSparkline :data="revenue" label="Revenue, last 12 months" />
        </NuStatCard>
      </div>
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Orders" value="1,284" :icon="ShoppingCart" color="info" :delta="4.1" delta-label="vs last month">
          <NuSparkline :data="[88, 92, 81, 97, 104, 99, 112, 108, 119, 124, 117, 128]" label="Orders, last 12 months" />
        </NuStatCard>
      </div>
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Customers" value="9,312" :icon="Users" color="success" :delta="2.8" delta-label="vs last month">
          <NuSparkline :data="[71, 73, 74, 78, 80, 83, 85, 86, 88, 90, 91, 93]" label="Customers, last 12 months" />
        </NuStatCard>
      </div>
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Refund rate" value="1.9%" :icon="TriangleAlert" color="warning" :delta="-0.6" delta-label="vs last month" invert-delta>
          <NuSparkline :data="[31, 29, 30, 27, 28, 26, 25, 26, 23, 22, 21, 19]" label="Refund rate, last 12 months" />
        </NuStatCard>
      </div>
    </div>

    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="Revenue vs expenses" subtitle="Last 12 months, USD" collapsible>
          <NuChart
            type="area"
            :labels="months"
            :series="[{ name: 'Revenue', data: revenue }, { name: 'Expenses', data: expenses }]"
            :format="(v) => `$${(v / 1000).toFixed(0)}K`"
            label="Revenue versus expenses over the last 12 months"
          />
        </NuCard>
      </div>
      <div class="nu-col-lg-4">
        <NuCard title="Traffic by channel" subtitle="Sessions this month">
          <NuDonut :segments="channels" total-label="Sessions" />
        </NuCard>
      </div>
    </div>

    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="Recent orders" flush>
          <template #tools><NuButton size="sm" variant="ghost" to="/tables">View all</NuButton></template>
          <NuTable :columns="columns" :rows="orders.slice(0, 6)" row-key="id" :page-size="0">
            <template #cell-customer="{ row }">
              <div class="nu-cluster">
                <NuAvatar :name="row.customer" :size="28" />
                <span>{{ row.customer }}</span>
              </div>
            </template>
            <template #cell-status="{ row }">
              <NuBadge :color="statusColor[row.status as Order['status']]" dot>{{ row.status }}</NuBadge>
            </template>
          </NuTable>
        </NuCard>
      </div>
      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Activity">
          <NuTimeline :items="activity" />
        </NuCard>
        <NuCard title="Goals">
          <div class="nu-stack" style="--nu-gap: 10px">
            <NuProgress v-for="g in goals" :key="g.label" :label="g.label" :value="g.value" :color="g.color" show-value />
          </div>
        </NuCard>
      </div>
    </div>
  </div>
</template>
