/** Every demo route. Keep in sync with apps/demo/src/router.ts (the smoke test fails on unknown pages anyway). */
export const routes = [
  '/', '/dashboard-2', '/dashboard-3', '/widgets',
  '/layout/options', '/layout/top-nav', '/layout/boxed', '/layout/fixed-footer', '/layout/static', '/layout/rtl',
  '/apps/calendar', '/apps/kanban', '/apps/mailbox', '/apps/mailbox/compose', '/apps/chat', '/apps/files', '/apps/gallery',
  '/ui/general', '/ui/more-inputs', '/ui/icons', '/ui/feedback', '/ui/navigation', '/ui/timeline', '/ui/ribbons', '/ui/data-display', '/ui/charts',
  '/forms/basic', '/forms/advanced', '/forms/validation', '/forms/editors', '/forms/wizard',
  '/tables/simple', '/tables/data', '/tables/editable',
  '/users', '/profile', '/projects', '/projects/new', '/projects/1', '/projects/1/edit', '/notifications', '/roles', '/audit-log', '/contacts', '/ecommerce',
  '/billing', '/invoice', '/pricing', '/faq', '/contact', '/search?q=project', '/blank', '/settings',
  '/auth/login', '/auth/login-2', '/auth/register', '/auth/register-2', '/auth/forgot-password', '/auth/recover-password', '/auth/two-factor', '/auth/lock',
  '/errors/403', '/errors/500', '/errors/maintenance', '/this-page-does-not-exist',
]
