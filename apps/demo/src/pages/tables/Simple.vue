<script setup lang="ts">
import { NuBadge, NuCard, NuPageHeader, NuProgress } from 'nusa-admin'

const tasks = [
  { task: 'Update software', progress: 55, color: 'danger' },
  { task: 'Clean database', progress: 70, color: 'warning' },
  { task: 'Cron job running', progress: 30, color: 'primary' },
  { task: 'Fix and squish bugs', progress: 90, color: 'success' },
] as const
const people = [
  { id: 183, user: 'Ayu Lestari', date: '11-7-2026', status: 'Approved', reason: 'Bacon ipsum dolor sit amet salami venison chicken.' },
  { id: 219, user: 'Budi Santoso', date: '11-7-2026', status: 'Pending', reason: 'Flank pork belly ball tip short ribs.' },
  { id: 657, user: 'Citra Dewi', date: '11-7-2026', status: 'Approved', reason: 'Turducken beef ribs jowl tongue.' },
  { id: 175, user: 'Dimas Pratama', date: '11-7-2026', status: 'Denied', reason: 'Pastrami sirloin doner shankle.' },
] as const
const statusColor = { Approved: 'success', Pending: 'warning', Denied: 'danger' } as const
</script>

<template>
  <NuPageHeader title="Simple tables" subtitle="Plain HTML tables styled with the kit's classes." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Tables' }, { label: 'Simple' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-6">
      <NuCard title="Bordered table" flush>
        <div style="overflow-x: auto">
          <table class="st st--bordered">
            <thead><tr><th style="width: 40px">#</th><th>Task</th><th>Progress</th><th style="width: 60px">Label</th></tr></thead>
            <tbody>
              <tr v-for="(t, i) in tasks" :key="t.task">
                <td>{{ i + 1 }}.</td>
                <td>{{ t.task }}</td>
                <td><NuProgress :value="t.progress" :color="t.color" :height="6" :label="t.task" label-hidden /></td>
                <td><NuBadge :color="t.color" variant="solid">{{ t.progress }}%</NuBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </NuCard>
    </div>
    <div class="nu-col-lg-6">
      <NuCard title="Condensed, striped" flush>
        <div style="overflow-x: auto">
          <table class="st st--striped st--condensed">
            <thead><tr><th style="width: 40px">#</th><th>Task</th><th>Progress</th><th style="width: 60px">Label</th></tr></thead>
            <tbody>
              <tr v-for="(t, i) in tasks" :key="t.task">
                <td>{{ i + 1 }}.</td>
                <td>{{ t.task }}</td>
                <td><NuProgress :value="t.progress" :color="t.color" :height="4" :label="t.task" label-hidden /></td>
                <td><NuBadge :color="t.color">{{ t.progress }}%</NuBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </NuCard>
    </div>
    <div class="nu-col-12">
      <NuCard title="Hover rows" flush>
        <div style="overflow-x: auto">
          <table class="st st--hover">
            <thead><tr><th>ID</th><th>User</th><th>Date</th><th>Status</th><th>Reason</th></tr></thead>
            <tbody>
              <tr v-for="p in people" :key="p.id">
                <td>{{ p.id }}</td>
                <td>{{ p.user }}</td>
                <td>{{ p.date }}</td>
                <td><NuBadge :color="statusColor[p.status]">{{ p.status }}</NuBadge></td>
                <td>{{ p.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </NuCard>
    </div>
  </div>
</template>

