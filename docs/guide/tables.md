# Tables

```ts
const columns: NuTableColumn<Order>[] = [
  { key: 'id', label: 'Order', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right', format: (v) => `$${v}` },
  { key: 'status', label: 'Status' },
]
```

```vue
<NuTable :columns="columns" :rows="orders" row-key="id" searchable :page-size="10">
  <template #cell-status="{ row }"><NuBadge :color="statusColor[row.status]">{{ row.status }}</NuBadge></template>
</NuTable>
```

## Selection and bulk actions

```vue
<NuTable v-model:selected="selected" selectable exportable="orders.csv" ...>
  <template #bulk="{ selected, clear }">
    <NuButton size="sm" color="danger" @click="remove(selected); clear()">Delete</NuButton>
  </template>
</NuTable>
```

`exportable` adds an "Export CSV" button (filtered and sorted rows, columns' `format` applied, formula-safe).

## Server-side data

```vue
<NuTable
  manual
  v-model:page="page" v-model:search="search" v-model:sort="sort"
  :rows="rows" :total="total" :loading="loading" :page-size="20"
  :columns="columns" row-key="id" searchable
/>
```

In `manual` mode the table doesn't filter, sort or slice `rows`; watch `page`, `search` (debounce it) and `sort`, call your API, and pass back the page and `total`.

Plain HTML tables can use the demo's `.st` classes (bordered, striped, condensed, hover) — see Tables → Simple.
