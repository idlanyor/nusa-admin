# Auth, roles and the menu

The kit has no opinion about authentication; the demo shows one complete pattern you can copy.

1. **Session** — `apps/demo/src/auth.ts` keeps `{ name, email, role }` in localStorage. Replace `login()` with your API call.
2. **Route guard** — routes under the shell have `meta: { requiresAuth: true }`; restricted ones add `meta: { roles: ['admin'] }`.

```ts
router.beforeEach((to) => {
  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated.value)
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  const roles = to.matched.flatMap((r) => r.meta.roles ?? [])
  if (roles.length && !auth.can(roles)) return '/errors/403'
})
```

3. **Menu** — tag items with `meta: { roles: ['admin'] }` and filter:

```ts
const menu = computed(() => filterMenu(fullMenu, (item) => auth.can(item.meta?.roles)))
```

`filterMenu` drops groups and section headers that end up empty.

4. **Pages** — `NuAuthLayout` (card or `variant="split"`) for sign-in/register/recover/lock screens, `NuErrorPage` for 403/404/500.
