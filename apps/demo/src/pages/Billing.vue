<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDownLeft, ArrowUpRight, CreditCard, Download, Landmark, Pencil, Plus, Wallet } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuInfoBox, NuInput, NuList, NuListItem, NuModal, NuPageHeader, useToast } from 'nusa-admin'

const toast = useToast()
const addCard = ref(false)
const cards = ref([
  { brand: 'Mastercard', last4: '7852', exp: '11/28', primary: true },
  { brand: 'Visa', last4: '5248', exp: '04/27', primary: false },
])
const invoices = [
  { id: 'INV-2041', date: '1 Nov 2026', amount: '$237.00' },
  { id: 'INV-1987', date: '1 Oct 2026', amount: '$237.00' },
  { id: 'INV-1930', date: '1 Sep 2026', amount: '$158.00' },
  { id: 'INV-1876', date: '1 Aug 2026', amount: '$158.00' },
]
const transactions = [
  { name: 'Team plan renewal', date: '1 Nov 2026, 09:00', amount: -237, pending: false },
  { name: 'Refund — order #4820', date: '28 Oct 2026, 14:12', amount: 24, pending: false },
  { name: 'Add-on: Storage', date: '21 Oct 2026, 10:40', amount: -12, pending: false },
  { name: 'Payout to bank', date: '15 Oct 2026, 08:00', amount: 1840, pending: false },
  { name: 'Add-on: Seats', date: '12 Oct 2026, 16:25', amount: -35, pending: true },
]
const money = (v: number) => `${v < 0 ? '−' : '+'}$${Math.abs(v).toLocaleString()}`
</script>

<template>
  <NuPageHeader title="Billing" subtitle="Payment methods, invoices and recent transactions." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Billing' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-8 nu-stack">
      <div class="nu-row">
        <div class="nu-col-md-6">
          <div class="pay-card">
            <div class="nu-between"><span>Nusa Bank</span><CreditCard /></div>
            <div class="pay-card__number">4562 1122 4594 7852</div>
            <div class="pay-card__meta">
              <div><small>Card holder</small><strong>Ayu Lestari</strong></div>
              <div><small>Expires</small><strong>11/28</strong></div>
            </div>
          </div>
        </div>
        <div class="nu-col-md-6 nu-stack" style="--nu-gap: 12px">
          <NuInfoBox label="Balance" value="$4,820.00" :icon="Wallet" color="success" description="Available for payout" />
          <NuInfoBox label="Next payout" value="$1,640.00" :icon="Landmark" color="info" description="Scheduled for 15 Nov 2026" />
        </div>
      </div>

      <NuCard title="Payment methods">
        <template #tools><NuButton size="sm" :icon="Plus" @click="addCard = true">Add card</NuButton></template>
        <div class="nu-row" style="--nu-gap: 12px">
          <div v-for="c in cards" :key="c.last4" class="nu-col-md-6">
            <div class="pay-method">
              <CreditCard />
              <div class="nu-grow">
                <div class="nu-fw-600 nu-tabular">{{ c.brand }} •••• {{ c.last4 }}</div>
                <div class="nu-text-sm nu-text-muted">Expires {{ c.exp }}</div>
              </div>
              <NuBadge v-if="c.primary" color="success">Primary</NuBadge>
              <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="`Edit card ending ${c.last4}`" />
            </div>
          </div>
        </div>
      </NuCard>

      <NuCard title="Transactions" subtitle="Last 30 days" flush>
        <NuList>
          <NuListItem v-for="t in transactions" :key="t.name + t.date" :title="t.name" :subtitle="t.date">
            <template #start>
              <span class="tx-icon" :class="t.pending ? 'is-pending' : t.amount < 0 ? 'is-out' : 'is-in'">
                <component :is="t.amount < 0 ? ArrowUpRight : ArrowDownLeft" />
              </span>
            </template>
            <template #end>
              <NuBadge v-if="t.pending" color="warning">Pending</NuBadge>
              <strong class="nu-tabular" :style="{ color: t.amount < 0 ? 'var(--nu-text)' : 'var(--nu-success)' }">{{ money(t.amount) }}</strong>
            </template>
          </NuListItem>
        </NuList>
      </NuCard>
    </div>

    <div class="nu-col-lg-4 nu-stack">
      <NuCard title="Invoices" flush>
        <template #tools><NuButton size="sm" variant="ghost" to="/invoice">View latest</NuButton></template>
        <NuList>
          <NuListItem v-for="inv in invoices" :key="inv.id" :title="inv.date" :subtitle="inv.id">
            <template #end>
              <span class="nu-tabular">{{ inv.amount }}</span>
              <NuButton size="sm" variant="ghost" color="secondary" :icon="Download" square :aria-label="`Download ${inv.id}`" @click="toast.info(`${inv.id}.pdf downloaded (demo).`)" />
            </template>
          </NuListItem>
        </NuList>
      </NuCard>

      <NuCard title="Billing details">
        <address class="bill-address">
          <strong>PT Nusa Digital</strong>
          Jl. Asia Afrika No. 8<br />Bandung 40111, Indonesia<br />
          <span class="nu-text-muted">Tax ID: 01.234.567.8-901.000</span>
        </address>
        <template #footer><NuButton size="sm" variant="outline" color="secondary" :icon="Pencil">Edit details</NuButton></template>
      </NuCard>
    </div>
  </div>

  <NuModal v-model="addCard" title="Add card" size="sm">
    <form id="card-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="addCard = false; toast.success('Card added (demo).')">
      <NuInput label="Name on card" required autocomplete="cc-name" />
      <NuInput label="Card number" required inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" />
      <div class="nu-row" style="--nu-gap: 10px">
        <div class="nu-col-6"><NuInput label="Expiry" required placeholder="MM/YY" autocomplete="cc-exp" /></div>
        <div class="nu-col-6"><NuInput label="CVC" required inputmode="numeric" autocomplete="cc-csc" /></div>
      </div>
    </form>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton type="submit" form="card-form">Add card</NuButton>
    </template>
  </NuModal>
</template>

<style>
.pay-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  height: 100%;
  min-height: 168px;
  padding: 16px;
  border-radius: var(--nu-radius);
  background:
    radial-gradient(400px 200px at 100% 0%, rgba(255, 255, 255, 0.18), transparent),
    linear-gradient(135deg, #1e1b4b, #4338ca);
  color: #fff;
}
.pay-card svg { width: 22px; height: 22px; }
.pay-card__number { font-family: var(--nu-font-mono); font-size: 18px; letter-spacing: 0.06em; }
.pay-card__meta { display: flex; gap: 28px; }
.pay-card__meta small { display: block; font-size: 11px; opacity: 0.75; }
.pay-method { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); }
.pay-method > svg { width: 20px; height: 20px; color: var(--nu-text-muted); }
.tx-icon { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; }
.tx-icon svg { width: 14px; height: 14px; }
.tx-icon.is-in { color: var(--nu-success); }
.tx-icon.is-out { color: var(--nu-danger); }
.tx-icon.is-pending { color: var(--nu-text-muted); }
.bill-address { display: grid; gap: 2px; font-style: normal; }
</style>
