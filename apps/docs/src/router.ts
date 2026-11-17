import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash, top: 72 } : { top: 0 }),
  routes: [
    {
      path: '/',
      component: () => import('./Shell.vue'),
      children: [
        { path: '', component: () => import('./pages/Home.vue') },
        { path: 'guide/:slug', component: () => import('./pages/Guide.vue') },
        { path: 'components', component: () => import('./pages/Components.vue') },
        { path: 'components/:name', component: () => import('./pages/Component.vue') },
        { path: 'api', component: () => import('./pages/Api.vue') },
        { path: 'ai', redirect: '/guide/ai' },
        { path: ':pathMatch(.*)*', component: () => import('./pages/NotFound.vue') },
      ],
    },
  ],
})
