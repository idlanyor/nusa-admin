import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from './auth'

const layoutExamples: RouteRecordRaw[] = [
  { path: 'layout/top-nav', meta: { layout: 'top-nav', title: 'Top navigation', note: 'The menu moves into the navbar on desktop; on small screens it stays in the drawer.' } },
  { path: 'layout/boxed', meta: { boxed: true, title: 'Boxed layout', note: 'The page is centered with a max width; the sidebar scrolls with the content.' } },
  { path: 'layout/fixed-footer', meta: { fixedFooter: true, title: 'Fixed footer', note: 'The footer stays visible at the bottom of the window.' } },
  { path: 'layout/rtl', meta: { rtl: true, title: 'Right-to-left', note: 'Everything mirrors for Arabic, Hebrew, Persian or Urdu: sidebar, menus, drawers, toasts and form controls.' } },
  { path: 'layout/static', meta: { fixedNavbar: false, fixedSidebar: false, title: 'Scrolling navbar & sidebar', note: 'Navbar and sidebar scroll away with the page instead of staying fixed.' } },
].map((r) => ({ ...r, component: () => import('./pages/layout/Example.vue') }) as RouteRecordRaw)

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
  routes: [
    {
      path: '/',
      component: () => import('./layouts/AdminShell.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', component: () => import('./pages/Dashboard.vue') },
        { path: 'dashboard-2', component: () => import('./pages/Dashboard2.vue') },
        { path: 'dashboard-3', component: () => import('./pages/Dashboard3.vue') },
        { path: 'widgets', component: () => import('./pages/Widgets.vue') },

        { path: 'layout/options', component: () => import('./pages/layout/Options.vue') },
        ...layoutExamples,

        { path: 'apps/calendar', component: () => import('./pages/apps/Calendar.vue') },
        { path: 'apps/kanban', component: () => import('./pages/apps/Kanban.vue') },
        { path: 'apps/mailbox', component: () => import('./pages/apps/Mailbox.vue') },
        { path: 'apps/mailbox/compose', component: () => import('./pages/apps/Compose.vue') },
        { path: 'apps/chat', component: () => import('./pages/apps/Chat.vue') },
        { path: 'apps/gallery', component: () => import('./pages/apps/Gallery.vue') },

        { path: 'ui/general', component: () => import('./pages/ui/General.vue') },
        { path: 'ui/icons', component: () => import('./pages/ui/Icons.vue') },
        { path: 'ui/feedback', component: () => import('./pages/ui/Feedback.vue') },
        { path: 'ui/navigation', component: () => import('./pages/ui/Navigation.vue') },
        { path: 'ui/timeline', component: () => import('./pages/ui/Timeline.vue') },
        { path: 'ui/ribbons', component: () => import('./pages/ui/Ribbons.vue') },
        { path: 'ui/data-display', component: () => import('./pages/ui/DataDisplay.vue') },
        { path: 'ui/charts', component: () => import('./pages/ui/Charts.vue') },

        { path: 'forms/basic', component: () => import('./pages/forms/Basic.vue') },
        { path: 'forms/advanced', component: () => import('./pages/forms/Advanced.vue') },
        { path: 'forms/validation', component: () => import('./pages/forms/Validation.vue') },
        { path: 'forms/editors', component: () => import('./pages/forms/Editors.vue') },
        { path: 'forms/wizard', component: () => import('./pages/forms/Wizard.vue') },

        { path: 'tables', redirect: '/tables/data' },
        { path: 'tables/simple', component: () => import('./pages/tables/Simple.vue') },
        { path: 'tables/data', component: () => import('./pages/Tables.vue') },
        { path: 'tables/editable', component: () => import('./pages/tables/Editable.vue') },

        { path: 'users', component: () => import('./pages/Users.vue'), meta: { roles: ['admin'] } },
        { path: 'profile', component: () => import('./pages/Profile.vue') },
        { path: 'projects', component: () => import('./pages/projects/List.vue') },
        { path: 'projects/new', component: () => import('./pages/projects/Form.vue'), meta: { roles: ['admin', 'editor'] } },
        { path: 'projects/:id', component: () => import('./pages/projects/Detail.vue') },
        { path: 'projects/:id/edit', component: () => import('./pages/projects/Form.vue'), meta: { roles: ['admin', 'editor'] } },
        { path: 'contacts', component: () => import('./pages/Contacts.vue') },
        { path: 'ecommerce', component: () => import('./pages/Ecommerce.vue') },
        { path: 'billing', component: () => import('./pages/Billing.vue'), meta: { roles: ['admin'] } },
        { path: 'invoice', component: () => import('./pages/Invoice.vue') },
        { path: 'pricing', component: () => import('./pages/Pricing.vue') },
        { path: 'faq', component: () => import('./pages/Faq.vue') },
        { path: 'contact', component: () => import('./pages/ContactUs.vue') },
        { path: 'search', component: () => import('./pages/Search.vue') },
        { path: 'blank', component: () => import('./pages/Blank.vue') },
        { path: 'settings', component: () => import('./pages/Settings.vue'), meta: { roles: ['admin'] } },
      ],
    },
    { path: '/auth/login', component: () => import('./pages/auth/Login.vue') },
    { path: '/auth/login-2', component: () => import('./pages/auth/Login.vue'), props: { split: true } },
    { path: '/auth/register', component: () => import('./pages/auth/Register.vue') },
    { path: '/auth/register-2', component: () => import('./pages/auth/Register.vue'), props: { split: true } },
    { path: '/auth/forgot-password', component: () => import('./pages/auth/ForgotPassword.vue') },
    { path: '/auth/recover-password', component: () => import('./pages/auth/RecoverPassword.vue') },
    { path: '/auth/lock', component: () => import('./pages/auth/LockScreen.vue') },
    { path: '/login', redirect: '/auth/login' },
    { path: '/errors/403', component: () => import('./pages/errors/Forbidden.vue') },
    { path: '/errors/500', component: () => import('./pages/errors/ServerError.vue') },
    { path: '/errors/maintenance', component: () => import('./pages/errors/Maintenance.vue') },
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
