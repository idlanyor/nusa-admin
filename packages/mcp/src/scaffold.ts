/** Page recipes that compile against the real kit API (see tests/scaffold.test.ts). */
export type PageKind = 'list' | 'form' | 'detail' | 'dashboard'

const pascal = (s: string) => s.replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase())
const camel = (s: string) => pascal(s).replace(/^./, (c) => c.toLowerCase())
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').toLowerCase().replace(/^-|-$/g, '')
const plural = (s: string) => (/(s|x|ch|sh)$/i.test(s) ? `${s}es` : /[^aeiou]y$/i.test(s) ? `${s.slice(0, -1)}ies` : `${s}s`)
const human = (s: string) => kebab(s).replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())

interface Field { key: string; label: string; kind: 'text' | 'email' | 'number' | 'date' | 'status' | 'textarea' }
function parseFields(fields: string[] | undefined): Field[] {
  const list = fields?.length ? fields : ['name', 'email', 'status', 'createdAt']
  return list.map((f) => {
    const key = camel(f)
    const k = key.toLowerCase()
    const kind: Field['kind'] = k.includes('email') ? 'email' : /(amount|price|total|qty|quantity|count|age|stock)/.test(k) ? 'number' : /(date|at$|day)/.test(k) ? 'date' : k === 'status' ? 'status' : /(description|notes?|bio|body)/.test(k) ? 'textarea' : 'text'
    return { key, label: human(f), kind }
  })
}
const tsType = (f: Field) => (f.kind === 'number' ? 'number' : f.kind === 'status' ? "'Active' | 'Inactive'" : 'string')
const sample = (f: Field, i: number) =>
  f.kind === 'number' ? String((i + 1) * 10) : f.kind === 'email' ? `'user${i + 1}@example.com'` : f.kind === 'date' ? `'2026-11-${String(10 + i).padStart(2, '0')}'` : f.kind === 'status' ? (i % 2 ? "'Inactive'" : "'Active'") : `'${f.label} ${i + 1}'`

export function scaffoldPage(kind: PageKind, entityName: string, fieldNames?: string[]): { path: string; code: string; notes: string } {
  const Entity = pascal(entityName || 'Item')
  const entities = plural(Entity)
  const route = `/${kebab(entities)}`
  const fields = parseFields(fieldNames)
  const first = fields[0]!
  const iface = `interface ${Entity} {\n  id: number\n${fields.map((f) => `  ${f.key}: ${tsType(f)}`).join('\n')}\n}`
  const rows = `[\n${[0, 1, 2].map((i) => `  { id: ${i + 1}, ${fields.map((f) => `${f.key}: ${sample(f, i)}`).join(', ')} },`).join('\n')}\n]`
  const crumbs = (last: string, extra = '') => `[{ label: 'Home', to: '/' }${extra}, { label: '${last}' }]`

  if (kind === 'list') {
    const code = `<script setup lang="ts">
import { ref } from 'vue'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { ${fields.some((f) => f.kind === 'status') ? 'NuBadge, ' : ''}NuButton, NuCard, NuModal, NuPageHeader, NuTable, useToast, type NuTableColumn } from 'nusa-admin'

${iface}

const toast = useToast()
// TODO: load from your API
const rows = ref<${Entity}[]>(${rows})
const selected = ref<(string | number)[]>([])
const removing = ref<${Entity} | null>(null)

const columns: NuTableColumn<${Entity}>[] = [
${fields.map((f) => `  { key: '${f.key}', label: '${f.label}', sortable: true${f.kind === 'number' ? ", align: 'right'" : ''} },`).join('\n')}
  { key: 'actions', label: '', align: 'right', width: '90px' },
]

function remove(ids: (string | number)[]) {
  rows.value = rows.value.filter((r) => !ids.includes(r.id))
  selected.value = []
  removing.value = null
  toast.success(\`\${ids.length} ${entities.toLowerCase()} deleted.\`)
}
</script>

<template>
  <NuPageHeader title="${human(entities)}" :breadcrumb="${crumbs(human(entities))}">
    <NuButton :icon="Plus" to="${route}/new">New ${human(Entity).toLowerCase()}</NuButton>
  </NuPageHeader>

  <NuCard flush>
    <NuTable v-model:selected="selected" :columns="columns" :rows="rows" row-key="id" searchable selectable exportable="${kebab(entities)}.csv">
      <template #bulk="{ selected: ids }">
        <NuButton size="sm" variant="soft" color="danger" :icon="Trash2" @click="remove(ids)">Delete selected</NuButton>
      </template>
${fields.some((f) => f.kind === 'status') ? `      <template #cell-status="{ row }">
        <NuBadge :color="row.status === 'Active' ? 'success' : 'secondary'" dot>{{ row.status }}</NuBadge>
      </template>
` : ''}      <template #cell-actions="{ row }">
        <NuButton size="sm" variant="ghost" color="secondary" :icon="Pencil" square :aria-label="\`Edit \${row.${first.key}}\`" :to="\`${route}/\${row.id}/edit\`" />
        <NuButton size="sm" variant="ghost" color="danger" :icon="Trash2" square :aria-label="\`Delete \${row.${first.key}}\`" @click="removing = row as ${Entity}" />
      </template>
    </NuTable>
  </NuCard>

  <NuModal :model-value="!!removing" title="Delete ${human(Entity).toLowerCase()}?" size="sm" @update:model-value="!$event && (removing = null)">
    <p>{{ removing?.${first.key} }} will be removed.</p>
    <template #footer>
      <NuButton variant="ghost" color="secondary" @click="removing = null">Cancel</NuButton>
      <NuButton color="danger" @click="removing && remove([removing.id])">Delete</NuButton>
    </template>
  </NuModal>
</template>
`
    return { path: `src/pages/${entities}.vue`, code, notes: `Add a route { path: '${route.slice(1)}', component: () => import('./pages/${entities}.vue') } and a menu item { label: '${human(entities)}', to: '${route}' }.` }
  }

  if (kind === 'form') {
    const initial = fields.map((f) => `${f.key}: ${f.kind === 'number' ? "'' as number | ''" : f.kind === 'date' ? 'null as string | null' : f.kind === 'status' ? "'Active'" : "''"}`).join(', ')
    const schema = fields
      .map((f, i) => {
        const r = [i === 0 || f.kind === 'email' ? 'rules.required()' : '', f.kind === 'email' ? 'rules.email()' : '', f.kind === 'number' ? 'rules.min(0)' : ''].filter(Boolean)
        return r.length ? `    ${f.key}: [${r.join(', ')}],` : ''
      })
      .filter(Boolean)
      .join('\n')
    const input = (f: Field) =>
      f.kind === 'status'
        ? `<NuSelect v-bind="form.field('${f.key}')" label="${f.label}" :options="[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]" />`
        : f.kind === 'date'
          ? `<NuDatePicker v-bind="form.field('${f.key}')" label="${f.label}" />`
          : f.kind === 'textarea'
            ? `<NuTextarea v-bind="form.field('${f.key}')" label="${f.label}" :rows="4" />`
            : `<NuInput v-bind="form.field('${f.key}')" label="${f.label}"${f.kind === 'email' ? ' type="email" autocomplete="email"' : f.kind === 'number' ? ' type="number" min="0"' : ''} />`
    const used = ['NuButton', 'NuCard', 'NuPageHeader', ...new Set(fields.map((f) => (f.kind === 'status' ? 'NuSelect' : f.kind === 'date' ? 'NuDatePicker' : f.kind === 'textarea' ? 'NuTextarea' : 'NuInput')))].sort()
    const code = `<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ${used.join(', ')}, rules, useForm, useToast } from 'nusa-admin'

const router = useRouter()
const toast = useToast()
const form = useForm(
  { ${initial} },
  {
${schema}
  },
)

const save = form.handleSubmit(async (values) => {
  // TODO: send to your API
  await new Promise((r) => setTimeout(r, 300))
  toast.success(\`\${values.${first.key}} saved.\`)
  router.push('${route}')
})
</script>

<template>
  <NuPageHeader title="New ${human(Entity).toLowerCase()}" :breadcrumb="${crumbs('New', `, { label: '${human(entities)}', to: '${route}' }`)}" />

  <form novalidate @submit.prevent="save">
    <NuCard accent="primary">
      <div class="nu-row" style="--nu-gap: 12px">
${fields.map((f) => `        <div class="${f.kind === 'textarea' ? 'nu-col-12' : 'nu-col-md-6'}">${input(f)}</div>`).join('\n')}
      </div>
      <template #footer>
        <div class="nu-cluster">
          <NuButton type="submit" :loading="form.submitting.value">Save</NuButton>
          <NuButton variant="ghost" color="secondary" to="${route}">Cancel</NuButton>
        </div>
      </template>
    </NuCard>
  </form>
</template>
`
    return { path: `src/pages/${Entity}Form.vue`, code, notes: `Route it at '${route.slice(1)}/new' (and '${route.slice(1)}/:id/edit' if you load existing values with form.reset(existing)).` }
  }

  if (kind === 'detail') {
    const code = `<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Pencil } from 'lucide-vue-next'
import { NuButton, NuCard, NuDescriptions, NuEmpty, NuPageHeader, NuTimeline } from 'nusa-admin'

${iface}

const route = useRoute()
// TODO: load from your API
const all: ${Entity}[] = ${rows}
const item = computed(() => all.find((x) => String(x.id) === route.params.id))
</script>

<template>
  <template v-if="item">
    <NuPageHeader :title="String(item.${first.key})" :breadcrumb="[{ label: 'Home', to: '/' }, { label: '${human(entities)}', to: '${route}' }, { label: String(item.${first.key}) }]">
      <NuButton :icon="Pencil" :to="\`${route}/\${item.id}/edit\`">Edit</NuButton>
    </NuPageHeader>
    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="Details">
          <NuDescriptions
            :columns="2"
            :items="[
${fields.map((f) => `              { label: '${f.label}', value: item.${f.key} },`).join('\n')}
            ]"
          />
        </NuCard>
      </div>
      <div class="nu-col-lg-4">
        <NuCard title="Activity">
          <NuTimeline :items="[{ title: 'Created', time: 'just now', color: 'primary' }]" />
        </NuCard>
      </div>
    </div>
  </template>
  <NuCard v-else flush>
    <NuEmpty title="${human(Entity)} not found">
      <NuButton size="sm" to="${route}">Back to ${human(entities).toLowerCase()}</NuButton>
    </NuEmpty>
  </NuCard>
</template>
`
    return { path: `src/pages/${Entity}Detail.vue`, code, notes: `Route it at '${route.slice(1)}/:id'.` }
  }

  // dashboard
  const code = `<script setup lang="ts">
import { CircleDollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-vue-next'
import { NuCard, NuChart, NuDonut, NuPageHeader, NuSparkline, NuStatCard } from 'nusa-admin'

// TODO: replace with your metrics
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenue = [42, 46, 51, 50, 56, 62, 59, 66, 72, 70, 77, 85].map((v) => v * 1000)
const costs = [31, 33, 35, 37, 37, 40, 41, 43, 44, 46, 47, 50].map((v) => v * 1000)
const usdK = (v: number) => \`$\${Math.round(v / 1000)}K\`
</script>

<template>
  <NuPageHeader title="${human(Entity)} dashboard" />
  <div class="nu-stack">
    <div class="nu-row">
      <div class="nu-col-sm-6 nu-col-lg-3">
        <NuStatCard label="Revenue" value="$84,600" :icon="CircleDollarSign" :delta="9.4" delta-label="vs last month">
          <NuSparkline :data="revenue" label="Revenue, last 12 months" />
        </NuStatCard>
      </div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Orders" value="1,284" :icon="ShoppingCart" color="info" :delta="4.1" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Customers" value="9,312" :icon="Users" color="success" :delta="2.8" /></div>
      <div class="nu-col-sm-6 nu-col-lg-3"><NuStatCard label="Conversion" value="3.1%" :icon="TrendingUp" color="warning" :delta="-0.4" /></div>
    </div>
    <div class="nu-row">
      <div class="nu-col-lg-8">
        <NuCard title="Revenue vs costs" subtitle="Last 12 months">
          <NuChart type="area" :labels="months" :series="[{ name: 'Revenue', data: revenue }, { name: 'Costs', data: costs }]" :format="usdK" />
        </NuCard>
      </div>
      <div class="nu-col-lg-4">
        <NuCard title="By channel">
          <NuDonut :segments="[{ label: 'Organic', value: 4820 }, { label: 'Direct', value: 2960 }, { label: 'Social', value: 1740 }]" total-label="Sessions" />
        </NuCard>
      </div>
    </div>
  </div>
</template>
`
  return { path: `src/pages/${Entity}Dashboard.vue`, code, notes: 'Swap the sample arrays for your data; NuChart/NuDonut colors follow the theme tokens.' }
}
