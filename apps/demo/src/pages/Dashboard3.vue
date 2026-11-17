<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown, ArrowUp, Download, Eye, Search } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuChart, NuPageHeader, NuSegmented, NuSparkline } from 'nusa-admin'
import { months, placeholderImage } from '../data'

const range = ref('week')
const visitors = {
  week: { labels: ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'], current: [100, 120, 170, 167, 180, 177, 160], last: [60, 80, 70, 67, 80, 77, 100] },
  month: { labels: ['W1', 'W2', 'W3', 'W4'], current: [820, 940, 1010, 1180], last: [640, 700, 760, 820] },
}
const products = [
  { name: 'Mechanical keyboard', price: 129, sales: 1240, trend: 12 },
  { name: 'Noise-cancelling headset', price: 249, sales: 980, trend: 0.5 },
  { name: '27" 4K monitor', price: 399, sales: 612, trend: -3 },
  { name: 'Standing desk', price: 549, sales: 387, trend: 63 },
]
const overview = [
  { label: 'Conversion rate', value: '12%', delta: 12, good: true },
  { label: 'Sales rate', value: '0.8%', delta: 0.8, good: true },
  { label: 'Registration rate', value: '1%', delta: -1, good: false },
]
</script>

<template>
  <NuPageHeader title="Dashboard v3" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Dashboard v3' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Online store visitors">
        <template #tools><NuSegmented v-model="range" size="sm" label="Range" :options="[{ label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }]" /></template>
        <div class="nu-between" style="align-items: flex-end; margin-bottom: 8px">
          <div>
            <div style="font-size: 22px; font-weight: 700">820</div>
            <div class="nu-text-sm nu-text-muted">Visitors over time</div>
          </div>
          <div class="d3-delta is-up"><ArrowUp /> 12.5% <span class="nu-text-muted">since last week</span></div>
        </div>
        <NuChart
          :labels="visitors[range as 'week' | 'month'].labels"
          :series="[{ name: 'This period', data: visitors[range as 'week' | 'month'].current }, { name: 'Last period', data: visitors[range as 'week' | 'month'].last }]"
          :height="230"
        />
      </NuCard>

      <NuCard title="Products" flush>
        <template #tools>
          <NuButton size="sm" variant="ghost" color="secondary" :icon="Download" square aria-label="Download" />
          <NuButton size="sm" variant="ghost" color="secondary" :icon="Search" square aria-label="Search products" />
        </template>
        <div style="overflow-x: auto">
          <table class="simple-table">
            <thead><tr><th>Product</th><th class="num">Price</th><th>Sales</th><th>More</th></tr></thead>
            <tbody>
              <tr v-for="(p, i) in products" :key="p.name">
                <td><div class="nu-cluster" style="flex-wrap: nowrap"><img class="product-thumb" :src="placeholderImage(i + 4, 64, 64)" alt="" style="width: 28px; height: 28px" />{{ p.name }}</div></td>
                <td class="num">${{ p.price }} USD</td>
                <td>
                  <span class="d3-delta" :class="p.trend >= 0 ? 'is-up' : 'is-down'"><component :is="p.trend >= 0 ? ArrowUp : ArrowDown" />{{ Math.abs(p.trend) }}%</span>
                  {{ p.sales.toLocaleString() }} sold
                </td>
                <td><NuButton size="sm" variant="ghost" color="secondary" :icon="Eye" square :aria-label="`View ${p.name}`" to="/ecommerce" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Sales">
        <template #tools><RouterLink to="/tables/data" class="nu-text-sm">View report</RouterLink></template>
        <div class="nu-between" style="align-items: flex-end; margin-bottom: 8px">
          <div>
            <div style="font-size: 22px; font-weight: 700">$18,230.00</div>
            <div class="nu-text-sm nu-text-muted">Sales over time</div>
          </div>
          <div class="d3-delta is-up"><ArrowUp /> 33.1% <span class="nu-text-muted">since last month</span></div>
        </div>
        <NuChart
          type="bar"
          :labels="months.slice(5)"
          :series="[{ name: 'This year', data: [1000, 2000, 3000, 2500, 2700, 2500, 3000] }, { name: 'Last year', data: [700, 1700, 2700, 2000, 1800, 1500, 2000] }]"
          :height="230"
        />
      </NuCard>

      <NuCard title="Online store overview">
        <ul class="overview">
          <li v-for="o in overview" :key="o.label">
            <span class="overview__icon"><NuSparkline :data="o.good ? [3, 4, 3, 5, 6, 7] : [6, 5, 6, 4, 3, 3]" :color="o.good ? 'var(--nu-success)' : 'var(--nu-danger)'" :height="28" :area="false" /></span>
            <span class="nu-grow">{{ o.label }}</span>
            <span class="d3-delta" :class="o.good ? 'is-up' : 'is-down'"><component :is="o.good ? ArrowUp : ArrowDown" />{{ o.value }}</span>
          </li>
        </ul>
        <template #footer><NuBadge color="info">Updated 5 minutes ago</NuBadge></template>
      </NuCard>
    </div>
  </div>
</template>

<style>
.d3-delta { display: inline-flex; align-items: center; gap: 3px; font-weight: 600; font-size: 13px; white-space: nowrap; }
.d3-delta svg { width: 14px; height: 14px; }
.d3-delta.is-up { color: var(--nu-success); }
.d3-delta.is-down { color: var(--nu-danger); }
.d3-delta .nu-text-muted { font-weight: 400; }
.overview { margin: 0; padding: 0; list-style: none; }
.overview li { display: flex; align-items: center; gap: 12px; padding: 10px 0; }
.overview li + li { border-top: 1px solid var(--nu-border); }
.overview__icon { width: 70px; flex: none; }
</style>
