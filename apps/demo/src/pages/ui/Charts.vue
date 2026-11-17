<script setup lang="ts">
import { NuCard, NuChart, NuDonut, NuPageHeader, NuSparkline } from 'nusa-admin'
import { channels, expenses, months, revenue, visitsByDay } from '../../data'

const usdK = (v: number) => `$${(v / 1000).toFixed(0)}K`
</script>

<template>
  <NuPageHeader
    title="Charts"
    subtitle="Dependency-free SVG charts that follow the theme tokens."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Charts' }]"
  />

  <div class="nu-row">
    <div class="nu-col-lg-6">
      <NuCard title="Line" subtitle="Revenue vs expenses, USD">
        <NuChart :labels="months" :series="[{ name: 'Revenue', data: revenue }, { name: 'Expenses', data: expenses }]" :format="usdK" />
      </NuCard>
    </div>
    <div class="nu-col-lg-6">
      <NuCard title="Area" subtitle="Monthly revenue, USD">
        <NuChart type="area" :labels="months" :series="[{ name: 'Revenue', data: revenue }]" :format="usdK" />
      </NuCard>
    </div>
    <div class="nu-col-lg-6">
      <NuCard title="Bar" subtitle="Sessions by day and platform">
        <NuChart
          type="bar"
          :labels="visitsByDay.labels"
          :series="[{ name: 'Web', data: visitsByDay.web }, { name: 'Mobile', data: visitsByDay.mobile }]"
        />
      </NuCard>
    </div>
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Donut" subtitle="Sessions by channel">
        <NuDonut :segments="channels" total-label="Sessions" />
      </NuCard>
      <NuCard title="Sparklines" subtitle="For stat tiles and table cells">
        <div class="nu-row" style="--nu-gap: 16px">
          <div class="nu-col-4"><NuSparkline :data="revenue" /></div>
          <div class="nu-col-4"><NuSparkline :data="visitsByDay.web" color="var(--nu-chart-2)" /></div>
          <div class="nu-col-4"><NuSparkline :data="visitsByDay.mobile" color="var(--nu-chart-3)" :area="false" /></div>
        </div>
      </NuCard>
    </div>
  </div>
</template>
