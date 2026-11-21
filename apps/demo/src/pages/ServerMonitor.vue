<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Pause, Play, Server } from 'lucide-vue-next'
import { NuBadge, NuButton, NuCard, NuChart, NuGauge, NuLogViewer, NuPageHeader, NuProgress, NuSegmented, NuTable, useConfirm, useToast, type NuLogLine, type NuTableColumn } from 'nusa-admin'

const toast = useToast()
const { confirm } = useConfirm()
const host = ref('api-1')
const live = ref(true)
const cpu = ref(42)
const mem = ref(61)
const disk = ref(73)
const load = ref([1.2, 0.9, 0.8])
const HIST = 30
const cpuHist = ref<number[]>(Array.from({ length: HIST }, (_, i) => 35 + Math.round(10 * Math.sin(i / 3))))
const memHist = ref<number[]>(Array.from({ length: HIST }, (_, i) => 58 + Math.round(3 * Math.sin(i / 5))))
const labels = computed(() => cpuHist.value.map((_, i) => (i % 5 === 0 ? `-${(HIST - i) * 2}s` : '')))

const MSGS = ['GET /api/orders 200 41ms', 'GET /api/users/42 200 12ms', 'POST /api/invoices 201 88ms', 'WARN slow query: orders.list 812ms', 'GET /health 200 2ms', 'ERROR upstream timeout: payments 3002ms', 'INFO cache hit ratio 0.94', 'GET /api/projects 200 33ms']
const logs = ref<NuLogLine[]>([])
const stamp = () => new Date().toTimeString().slice(0, 8)
function pushLog() {
  const text = MSGS[Math.floor(Math.random() * MSGS.length)]!
  const level: NuLogLine['level'] = text.startsWith('ERROR') ? 'error' : text.startsWith('WARN') ? 'warn' : text.startsWith('INFO') ? 'info' : undefined
  logs.value.push({ time: stamp(), level, text })
  if (logs.value.length > 400) logs.value.splice(0, logs.value.length - 400)
}
for (let i = 0; i < 40; i++) pushLog()

const walk = (v: number, spread: number, lo = 3, hi = 98) => Math.min(hi, Math.max(lo, v + (Math.random() - 0.5) * spread))
const timer = setInterval(() => {
  if (!live.value) return
  cpu.value = Math.round(walk(cpu.value, 18))
  mem.value = Math.round(walk(mem.value, 4, 40, 92))
  load.value = [Number((cpu.value / 30).toFixed(2)), load.value[0]!, load.value[1]!]
  cpuHist.value = [...cpuHist.value.slice(1), cpu.value]
  memHist.value = [...memHist.value.slice(1), mem.value]
  pushLog()
}, 2000)
onBeforeUnmount(() => clearInterval(timer))

interface Proc { pid: number; name: string; user: string; cpu: number; mem: number }
const procs = ref<Proc[]>([
  { pid: 1182, name: 'node /srv/api/server.js', user: 'app', cpu: 24.1, mem: 9.8 },
  { pid: 921, name: 'postgres: writer', user: 'postgres', cpu: 8.4, mem: 14.2 },
  { pid: 1440, name: 'redis-server *:6379', user: 'redis', cpu: 2.2, mem: 3.1 },
  { pid: 611, name: 'nginx: worker process', user: 'www-data', cpu: 1.5, mem: 0.6 },
  { pid: 2301, name: 'backup.sh --nightly', user: 'root', cpu: 0.9, mem: 0.4 },
])
const procCols: NuTableColumn<Proc>[] = [
  { key: 'pid', label: 'PID', width: '70px' },
  { key: 'name', label: 'Command' },
  { key: 'user', label: 'User' },
  { key: 'cpu', label: 'CPU %', align: 'right', sortable: true, format: (v) => v.toFixed(1) },
  { key: 'mem', label: 'Mem %', align: 'right', sortable: true, format: (v) => v.toFixed(1) },
  { key: 'actions', label: '', align: 'right', width: '80px' },
]
async function kill(p: Proc) {
  if (await confirm({ title: `Stop process ${p.pid}?`, message: p.name, danger: true, confirmLabel: 'Send SIGTERM' })) {
    procs.value = procs.value.filter((x) => x.pid !== p.pid)
    toast.info(`SIGTERM sent to ${p.pid}.`)
  }
}
const disks = [
  { mount: '/', used: 73, size: '80 GB' },
  { mount: '/var/lib/postgresql', used: 58, size: '200 GB' },
  { mount: '/backups', used: 91, size: '500 GB' },
]
const services = [
  { name: 'nginx', ok: true, uptime: '41 d' },
  { name: 'api (node)', ok: true, uptime: '3 d' },
  { name: 'postgresql', ok: true, uptime: '41 d' },
  { name: 'redis', ok: true, uptime: '41 d' },
  { name: 'worker-queue', ok: false, uptime: 'restarting' },
]
</script>

<template>
  <NuPageHeader title="Server monitor" subtitle="Live resource usage, processes and logs (simulated)." :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Infrastructure' }, { label: 'Monitor' }]">
    <NuSegmented v-model="host" size="sm" label="Host" :options="['api-1', 'api-2', 'db-1'].map((h) => ({ label: h, value: h }))" />
    <NuButton variant="outline" color="secondary" :icon="live ? Pause : Play" @click="live = !live">{{ live ? 'Pause' : 'Resume' }}</NuButton>
  </NuPageHeader>

  <div class="nu-stack">
    <NuCard flush>
      <div class="gauges">
        <NuGauge :value="cpu" label="CPU" :detail="`load ${load.join(' · ')}`" />
        <NuGauge :value="mem" label="Memory" :detail="`${((mem / 100) * 16).toFixed(1)} / 16 GB`" />
        <NuGauge :value="disk" label="Disk /" detail="58 / 80 GB" />
        <NuGauge :value="38" :max="100" unit=" °C" label="Temperature" :warn="70" :danger="85" detail="package" />
      </div>
    </NuCard>

    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="CPU & memory" subtitle="Last minute, every 2 s">
          <NuChart :labels="labels" :series="[{ name: 'CPU %', data: cpuHist }, { name: 'Memory %', data: memHist }]" :height="220" :format="(v) => `${Math.round(v)}%`" />
        </NuCard>
      </div>
      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Services" flush>
          <ul class="svc">
            <li v-for="s in services" :key="s.name">
              <Server />
              <span class="nu-grow">{{ s.name }}</span>
              <small class="nu-text-muted">{{ s.uptime }}</small>
              <NuBadge :color="s.ok ? 'success' : 'warning'" dot>{{ s.ok ? 'running' : 'degraded' }}</NuBadge>
            </li>
          </ul>
        </NuCard>
        <NuCard title="Filesystems">
          <div class="nu-stack" style="--nu-gap: 10px">
            <NuProgress v-for="d in disks" :key="d.mount" :value="d.used" :label="`${d.mount} · ${d.size}`" show-value :color="d.used >= 90 ? 'danger' : d.used >= 70 ? 'warning' : 'primary'" />
          </div>
        </NuCard>
      </div>
    </div>

    <NuCard title="Top processes" flush>
      <NuTable :columns="procCols" :rows="procs" row-key="pid" :page-size="0" dense>
        <template #cell-name="{ row }"><code>{{ row.name }}</code></template>
        <template #cell-actions="{ row }"><NuButton size="sm" variant="ghost" color="danger" @click="kill(row as Proc)">Stop</NuButton></template>
      </NuTable>
    </NuCard>

    <NuLogViewer :lines="logs" :title="`${host} — /var/log/app.log`" height="280px" />
  </div>
</template>

<style>
.gauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); justify-items: center; gap: 12px; padding: 14px; }
.svc { margin: 0; padding: 0; list-style: none; }
.svc li { display: flex; align-items: center; gap: 8px; padding: 7px 14px; }
.svc li + li { border-top: 1px solid var(--nu-border); }
.svc svg { width: 15px; height: 15px; color: var(--nu-text-muted); }
</style>
