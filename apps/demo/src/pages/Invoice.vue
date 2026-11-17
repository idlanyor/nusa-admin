<script setup lang="ts">
import { Download, Printer, Send } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuPageHeader, useToast } from 'nusa-admin'

const toast = useToast()
const items = [
  { name: 'Team plan', detail: 'Monthly subscription, 3 seats', qty: 3, price: 79 },
  { name: 'Add-on: Storage', detail: '100 GB extra', qty: 1, price: 12 },
  { name: 'Onboarding session', detail: '2 hours, remote', qty: 2, price: 60 },
]
const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
const tax = Math.round(subtotal * 0.11 * 100) / 100
const usd = (v: number) => `$${v.toLocaleString('en', { minimumFractionDigits: 2 })}`
const print = () => window.print()
</script>

<template>
  <NuPageHeader title="Invoice INV-2041" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Billing', to: '/billing' }, { label: 'INV-2041' }]">
    <NuButton variant="outline" color="secondary" :icon="Printer" @click="print">Print</NuButton>
    <NuButton variant="outline" color="secondary" :icon="Download" @click="toast.info('INV-2041.pdf downloaded (demo).')">PDF</NuButton>
    <NuButton :icon="Send" @click="toast.success('Invoice sent to ayu@example.com.')">Send</NuButton>
  </NuPageHeader>

  <NuCard class="invoice">
    <div class="invoice__head">
      <div>
        <div class="nu-brand"><span class="nu-brand__logo">N</span><span class="nu-brand__name">Nusa Admin</span></div>
        <address>PT Nusa Digital<br />Jl. Asia Afrika No. 8<br />Bandung 40111, Indonesia</address>
      </div>
      <div class="invoice__meta">
        <NuBadge color="success" dot>Paid</NuBadge>
        <dl>
          <dt>Invoice</dt><dd>INV-2041</dd>
          <dt>Issued</dt><dd>1 Nov 2026</dd>
          <dt>Due</dt><dd>15 Nov 2026</dd>
        </dl>
      </div>
    </div>

    <div class="invoice__to">
      <div class="nu-text-sm nu-text-muted">Billed to</div>
      <strong>Ayu Lestari</strong>
      <address>CV Lestari Kreatif<br />Jl. Braga No. 21, Bandung 40111<br />ayu@example.com</address>
    </div>

    <div class="invoice__table">
      <table>
        <thead>
          <tr><th>Item</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr>
        </thead>
        <tbody>
          <tr v-for="i in items" :key="i.name">
            <td><strong>{{ i.name }}</strong><div class="nu-text-sm nu-text-muted">{{ i.detail }}</div></td>
            <td class="num">{{ i.qty }}</td>
            <td class="num">{{ usd(i.price) }}</td>
            <td class="num">{{ usd(i.qty * i.price) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td colspan="3">Subtotal</td><td class="num">{{ usd(subtotal) }}</td></tr>
          <tr><td colspan="3">VAT (11%)</td><td class="num">{{ usd(tax) }}</td></tr>
          <tr class="invoice__total"><td colspan="3">Total</td><td class="num">{{ usd(subtotal + tax) }}</td></tr>
        </tfoot>
      </table>
    </div>

    <p class="nu-text-sm nu-text-muted">Paid by Mastercard •••• 7852 on 1 Nov 2026. Thank you for your business.</p>
  </NuCard>
</template>

<style>
.invoice { max-width: 860px; }
.invoice .nu-card__body { display: grid; gap: 16px; }
.invoice address { margin-top: 6px; font-style: normal; color: var(--nu-text-muted); font-size: 13px; }
.invoice__head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 14px; }
.invoice__meta { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.invoice__meta dl { display: grid; grid-template-columns: auto auto; gap: 2px 14px; margin: 0; font-size: 13px; }
.invoice__meta dt { color: var(--nu-text-muted); }
.invoice__meta dd { margin: 0; text-align: end; font-weight: 600; font-variant-numeric: tabular-nums; }
.invoice__table { overflow-x: auto; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); }
.invoice table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.invoice th { padding: 7px 12px; background: var(--nu-surface-2); color: var(--nu-text-muted); font-size: 12px; text-align: start; text-transform: uppercase; letter-spacing: 0.04em; }
.invoice td { padding: 8px 12px; border-top: 1px solid var(--nu-border); }
.invoice .num { text-align: end; font-variant-numeric: tabular-nums; white-space: nowrap; }
.invoice tfoot td { padding: 5px 12px; border-top: 0; color: var(--nu-text-muted); text-align: end; }
.invoice tfoot tr:first-child td { border-top: 1px solid var(--nu-border); padding-top: 9px; }
.invoice tfoot .invoice__total td { padding-bottom: 10px; color: var(--nu-text); font-size: 15px; font-weight: 700; }
@media print {
  .nu-sidebar, .nu-navbar, .nu-layout__footer, .nu-page-header, .nu-customizer__fab { display: none !important; }
  .nu-layout__main { margin: 0 !important; }
  .invoice { border: 0; box-shadow: none; max-width: none; }
}
</style>
