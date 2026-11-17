import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './auth'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  routes: [
    {
      path: '/',
      component: () => import('./layouts/AppShell.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', component: () => import('./pages/Dashboard.vue') },
        { path: 'users', component: () => import('./pages/Users.vue'), meta: { roles: ['admin'] } },
        { path: 'settings', component: () => import('./pages/Settings.vue'), meta: { roles: ['admin'] } },
      ],
    },
    { path: '/auth/login', component: () => import('./pages/auth/Login.vue') },
    { path: '/auth/register', component: () => import('./pages/auth/Register.vue') },
    { path: '/auth/forgot-password', component: () => import('./pages/auth/ForgotPassword.vue') },
    { path: '/auth/lock', component: () => import('./pages/auth/LockScreen.vue') },
    { path: '/errors/403', component: () => import('./pages/errors/Forbidden.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('./pages/errors/NotFound.vue') },
  ],
})

const auth = useAuth()
router.beforeEach((to) => {
  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated.value) {
    return { path: '/auth/login', query: to.fullPath === '/' ? {} : { redirect: to.fullPath } }
  }
  const roles = to.matched.flatMap((r) => (r.meta.roles as string[] | undefined) ?? [])
  if (roles.length && !auth.can(roles)) return { path: '/errors/403', query: { from: to.fullPath } }
})
