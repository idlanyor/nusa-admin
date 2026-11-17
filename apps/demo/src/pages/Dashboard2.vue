<script setup lang="ts">
import { ref } from 'vue'
import { Cog, Download, ShoppingCart, ThumbsUp, Users } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuChart, NuDirectChat, NuDonut, NuInfoBox, NuList, NuListItem, NuPageHeader,
  NuProgress, NuTable, type NuChatMessage, type NuTableColumn,
} from 'nusa-admin'
import { expenses, months, orders, placeholderImage, revenue, statusColor, usd, type Order } from '../data'

const chat = ref<NuChatMessage[]>([
  { from: 'Budi Santoso', text: 'Is the monthly recap ready?', time: '09:10' },
  { from: 'Ayu Lestari', text: 'Almost — finishing the goal section now.', time: '09:12', me: true },
  { from: 'Budi Santoso', text: 'Great, ping me when it is up.', time: '09:13' },
])
function send(text: string) {
  chat.value.push({ from: 'Ayu Lestari', text, me: true, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) })
}

const members = ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri', 'Fajar Nugroho', 'Gita Maharani', 'Hendra Wijaya']
const columns: NuTableColumn<Order>[] = [
  { key: 'id', label: 'Order' },
  { key: 'product', label: 'Item' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount', align: 'right', format: usd },
]
const browsers = [
  { label: 'Chrome', value: 6420 },
  { label: 'Safari', value: 2310 },
  { label: 'Firefox', value: 980 },
  { label: 'Edge', value: 760 },
]
const products = [
  { name: 'Mechanical keyboard', price: '$129', note: 'Hot-swappable, 75% layout', tag: 'warning' },
  { name: 'Noise-cancelling headset', price: '$249', note: 'Up to 30 hours battery', tag: 'info' },
  { name: '27" 4K monitor', price: '$399', note: 'USB-C with 90 W charging', tag: 'danger' },
  { name: 'Standing desk', price: '$549', note: 'Dual motor, memory presets', tag: 'success' },
] as const
const countries = [
  { name: 'Indonesia', share: 48 },
  { name: 'Malaysia', share: 17 },
  { name: 'Singapore', share: 12 },
  { name: 'Philippines', share: 9 },
  { name: 'Thailand', share: 7 },
]
</script>

<template>
  <NuPageHeader title="Dashboard v2" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Dashboard v2' }]" />

  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="CPU traffic" value="10%" :icon="Cog" color="info" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Likes" value="41,410" :icon="ThumbsUp" color="danger" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="Sales" value="760" :icon="ShoppingCart" color="success" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuInfoBox label="New members" value="2,000" :icon="Users" color="warning" /></div>
    </div>

    <NuCard title="Monthly recap report" collapsible maximizable>
      <template #tools><NuButton size="sm" variant="ghost" color="secondary" :icon="Download">Export</NuButton></template>
      <div class="nu-row">
        <div class="nu-col-lg-8">
          <p class="nu-text-sm nu-text-muted" style="margin-bottom: 6px">Sales: 1 Jan – 31 Dec 2026</p>
          <NuChart type="area" :labels="months" :series="[{ name: 'Revenue', data: revenue }, { name: 'Expenses', data: expenses }]" :format="(v) => `$${(v / 1000).toFixed(0)}K`" :height="240" />
        </div>
        <div class="nu-col-lg-4">
          <p class="nu-fw-600" style="margin-bottom: 10px">Goal completion</p>
          <div class="nu-stack" style="--nu-gap: 12px">
            <NuProgress label="Add products to cart" :value="160" :max="200" show-value />
            <NuProgress label="Complete purchase" :value="310" :max="400" color="danger" show-value />
            <NuProgress label="Visit premium page" :value="480" :max="800" color="success" show-value />
            <NuProgress label="Send inquiries" :value="250" :max="500" color="warning" show-value />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="recap">
          <div><strong>$35,210.43</strong><span>Total revenue</span><NuBadge color="success">+17%</NuBadge></div>
          <div><strong>$10,390.90</strong><span>Total cost</span><NuBadge color="warning">0%</NuBadge></div>
          <div><strong>$24,813.53</strong><span>Total profit</span><NuBadge color="success">+20%</NuBadge></div>
          <div><strong>1,200</strong><span>Goal completions</span><NuBadge color="danger">−18%</NuBadge></div>
        </div>
      </template>
    </NuCard>

    <div class="nu-row">
      <div class="nu-col-lg-8 nu-stack">
        <NuCard title="Visitors by country" subtitle="Share of sessions this month">
          <div class="nu-stack" style="--nu-gap: 10px">
            <NuProgress v-for="(c, i) in countries" :key="c.name" :label="c.name" :value="c.share" :color="i === 0 ? 'primary' : 'info'" show-value />
          </div>
        </NuCard>
        <div class="nu-row">
          <div class="nu-col-md-6">
            <NuCard title="Direct chat" accent="warning" flush removable>
              <template #tools><NuBadge color="warning">3 new</NuBadge></template>
              <NuDirectChat :messages="chat" height="250px" @send="send" />
            </NuCard>
          </div>
          <div class="nu-col-md-6">
            <NuCard title="Latest members" accent="danger" removable>
              <template #tools><NuBadge color="danger">8 new</NuBadge></template>
              <ul class="members">
                <li v-for="(m, i) in members" :key="m">
                  <NuAvatar :name="m" :size="44" />
                  <span class="nu-truncate">{{ m.split(' ')[0] }}</span>
                  <small>{{ ['Today', 'Yesterday', '12 Nov', '11 Nov'][i % 4] }}</small>
                </li>
              </ul>
              <template #footer><RouterLink to="/users">View all users</RouterLink></template>
            </NuCard>
          </div>
        </div>
        <NuCard title="Latest orders" flush>
          <NuTable :columns="columns" :rows="orders.slice(0, 7)" row-key="id" :page-size="0">
            <template #cell-status="{ row }"><NuBadge :color="statusColor[row.status as Order['status']]">{{ row.status }}</NuBadge></template>
          </NuTable>
          <template #footer>
            <div class="nu-between">
              <NuButton size="sm" to="/tables/data">Place new order</NuButton>
              <NuButton size="sm" variant="outline" color="secondary" to="/tables/data">View all orders</NuButton>
            </div>
          </template>
        </NuCard>
      </div>

      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Browser usage">
          <NuDonut :segments="browsers" total-label="Visits" :size="150" />
        </NuCard>
        <NuCard title="Recently added products" flush>
          <NuList>
            <NuListItem v-for="(p, i) in products" :key="p.name" :title="p.name" :subtitle="p.note">
              <template #start><img class="product-thumb" :src="placeholderImage(i + 2, 80, 80)" alt="" /></template>
              <template #end><NuBadge :color="p.tag">{{ p.price }}</NuBadge></template>
            </NuListItem>
          </NuList>
          <template #footer><RouterLink to="/ecommerce">View all products</RouterLink></template>
        </NuCard>
      </div>
    </div>
  </div>
</template>

<style>
.recap { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; text-align: center; }
.recap > div { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.recap > div + div { border-left: 1px solid var(--nu-border); }
.recap strong { font-size: 16px; font-variant-numeric: tabular-nums; }
.recap span { font-size: 12px; color: var(--nu-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
@media (max-width: 640px) {
  .recap { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .recap > div:nth-child(3) { border-left: 0; }
}
.members { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 6px; margin: 0; padding: 0; list-style: none; text-align: center; }
.members li { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 0; max-width: 100%; }
.members span { max-width: 100%; font-weight: 600; font-size: 13px; }
.members small { font-size: 11.5px; color: var(--nu-text-muted); }
</style>
