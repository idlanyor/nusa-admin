<script setup lang="ts">
import { ref } from 'vue'
import { Check, Minus } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuPageHeader, NuSegmented } from 'nusa-admin'

const period = ref('yearly')
const plans = [
  { name: 'Starter', monthly: 19, blurb: 'For individuals getting started.', features: ['1 workspace', '3 team members', '5 GB storage', 'Email support'], popular: false },
  { name: 'Team', monthly: 79, blurb: 'For growing teams that collaborate daily.', features: ['5 workspaces', '25 team members', '100 GB storage', 'Priority support', 'Roles & permissions'], popular: true },
  { name: 'Business', monthly: 249, blurb: 'For companies with advanced needs.', features: ['Unlimited workspaces', 'Unlimited members', '1 TB storage', 'Dedicated manager', 'SSO & audit log'], popular: false },
]
const price = (m: number) => (period.value === 'yearly' ? Math.round((m * 10) / 12) : m)

const matrix = [
  { feature: 'Custom domain', values: [false, true, true] },
  { feature: 'API access', values: [false, true, true] },
  { feature: 'Audit log', values: [false, false, true] },
  { feature: 'Uptime SLA', values: ['—', '99.9%', '99.99%'] },
]
</script>

<template>
  <NuPageHeader title="Pricing" subtitle="Simple plans. Switch or cancel any time." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Pricing' }]">
    <NuSegmented v-model="period" label="Billing period" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly (2 months free)', value: 'yearly' }]" />
  </NuPageHeader>

  <div class="nu-stack">
    <div class="nu-row">
      <div v-for="p in plans" :key="p.name" class="nu-col-md-4">
        <NuCard :accent="p.popular ? 'primary' : undefined" class="plan">
          <div class="nu-between">
            <h3>{{ p.name }}</h3>
            <NuBadge v-if="p.popular">Most popular</NuBadge>
          </div>
          <p class="nu-text-muted">{{ p.blurb }}</p>
          <div class="plan__price"><strong>${{ price(p.monthly) }}</strong><span>/ month{{ period === 'yearly' ? ', billed yearly' : '' }}</span></div>
          <NuButton block :variant="p.popular ? 'solid' : 'outline'">Choose {{ p.name }}</NuButton>
          <ul class="plan__features">
            <li v-for="f in p.features" :key="f"><Check />{{ f }}</li>
          </ul>
        </NuCard>
      </div>
    </div>

    <NuCard title="Compare plans" flush>
      <div style="overflow-x: auto">
        <table class="compare">
          <thead><tr><th>Feature</th><th v-for="p in plans" :key="p.name">{{ p.name }}</th></tr></thead>
          <tbody>
            <tr v-for="row in matrix" :key="row.feature">
              <td>{{ row.feature }}</td>
              <td v-for="(v, i) in row.values" :key="i">
                <template v-if="typeof v === 'string'">{{ v }}</template>
                <Check v-else-if="v" class="is-yes" aria-label="Included" />
                <Minus v-else class="is-no" aria-label="Not included" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NuCard>
  </div>
</template>

<style>
.plan { height: 100%; }
.plan .nu-card__body { display: flex; flex-direction: column; gap: 10px; }
.plan h3 { font-size: 16px; }
.plan__price { display: flex; align-items: baseline; gap: 6px; }
.plan__price strong { font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.plan__price span { color: var(--nu-text-muted); font-size: 13px; }
.plan__features { display: grid; gap: 6px; margin: 2px 0 0; padding: 0; list-style: none; }
.plan__features li { display: flex; align-items: center; gap: 8px; }
.plan__features svg { width: 15px; height: 15px; color: var(--nu-success); flex: none; }
.compare { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.compare th { padding: 7px 14px; background: var(--nu-surface-2); color: var(--nu-text-muted); font-size: 12px; text-align: center; text-transform: uppercase; letter-spacing: 0.04em; }
.compare th:first-child, .compare td:first-child { text-align: start; }
.compare td { padding: 8px 14px; border-top: 1px solid var(--nu-border); text-align: center; }
.compare svg { width: 16px; height: 16px; }
.compare .is-yes { color: var(--nu-success); }
.compare .is-no { color: var(--nu-text-muted); opacity: 0.6; }
</style>
