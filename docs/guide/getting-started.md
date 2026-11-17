# Getting started

Nusa Admin is a Vue 3 admin template kit: one layout shell, 77 components, SVG charts, light/dark themes and design tokens — no CSS framework, no jQuery.

## Create a project

```bash
bun create nusa-admin my-admin        # or: npm create nusa-admin@latest my-admin
cd my-admin
bun install
bun run dev
```

The CLI asks for a template: **starter** (shell, dashboard, a CRUD page, sign-in, 404) or **full** (the complete demo with 65 routes). It also adds an AI skill and an MCP config so coding assistants know the kit.

## Add to an existing app

```bash
bun add nusa-admin vue-router
```

```ts
// main.ts
import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'

createApp(App)
  .use(router)
  .use(createNusaAdmin({ primary: '#0d9488', theme: 'auto' }))
  .mount('#app')
```

`createNusaAdmin()` registers every `Nu*` component globally. Pass `registerComponents: false` and import per file to tree-shake.

## The shell

```vue
<script setup lang="ts">
import { LayoutDashboard, Users } from 'lucide-vue-next'
import type { NuMenuItem } from 'nusa-admin'

const menu: NuMenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Management', header: true },
  { label: 'Users', icon: Users, to: '/users', badge: 12 },
]
</script>

<template>
  <NuLayout :menu="menu" brand="My App" sidebar-search>
    <RouterView />
  </NuLayout>
</template>
```

Slots: `brand`, `sidebar-top`, `sidebar-footer`, `navbar-start`, `navbar-end`, `navbar-user`, `footer`, default.

## A page

```vue
<template>
  <NuPageHeader title="Users" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Users' }]">
    <NuButton :icon="Plus">Add user</NuButton>
  </NuPageHeader>
  <NuCard flush>
    <NuTable :columns="columns" :rows="users" row-key="id" searchable />
  </NuCard>
</template>
```

Lay pages out with the grid utilities: `nu-row` + `nu-col-12 nu-col-md-6 nu-col-lg-3`, and `nu-stack` / `nu-cluster` for vertical and horizontal spacing.
