<script setup lang="ts">
import { NuCallout, NuCard, NuPageHeader, NuRibbon, type NuColor } from 'nusa-admin'

const colors: NuColor[] = ['primary', 'success', 'warning', 'danger', 'info', 'secondary']
</script>

<template>
  <NuPageHeader title="Ribbons & callouts" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Ribbons & callouts' }]" />

  <div class="nu-stack">
    <div class="nu-row">
      <div v-for="(c, i) in colors" :key="c" class="nu-col-sm-6 nu-col-lg-4">
        <NuCard :title="`Ribbon · ${c}`">
          <NuRibbon :text="['New', 'Sale', 'Hot', '-20%', 'Info', 'Beta'][i]!" :color="c" :size="i % 2 ? 'lg' : 'md'" />
          <p class="nu-text-muted" style="min-height: 48px">{{ i % 2 ? 'Large' : 'Regular' }} ribbon in the {{ c }} color.</p>
        </NuCard>
      </div>
    </div>

    <NuCard title="Callouts">
      <div class="nu-stack" style="--nu-gap: 10px">
        <NuCallout color="danger" title="I am a danger callout!">There is a problem that we need to fix. A wonderful serenity has taken possession of my entire soul.</NuCallout>
        <NuCallout color="info" title="I am an info callout!">Follow the steps to continue to payment.</NuCallout>
        <NuCallout color="warning" title="I am a warning callout!">This is a yellow callout.</NuCallout>
        <NuCallout color="success" title="I am a success callout!">This is a green callout.</NuCallout>
      </div>
    </NuCard>
  </div>
</template>
