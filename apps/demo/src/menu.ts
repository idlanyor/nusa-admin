import {
  AppWindow, CalendarDays, CircleHelp, Contact, CreditCard, File, FileText, FolderKanban, Images, KanbanSquare,
  LayoutDashboard, LayoutGrid, LayoutTemplate, Layers, Lock, Mail, MessagesSquare, Puzzle, ReceiptText, Search,
  Settings, ShoppingBag, Table2, Tags, TriangleAlert, UserRound, Users,
} from 'lucide-vue-next'
import type { NuMenuItem } from 'nusa-admin'

/** The whole sidebar (and the top-nav menu) is this one array — edit it to add pages. */
export const menu: NuMenuItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Dashboard v1', to: '/' },
      { label: 'Dashboard v2', to: '/dashboard-2' },
      { label: 'Dashboard v3', to: '/dashboard-3' },
    ],
  },
  { label: 'Widgets', icon: LayoutGrid, to: '/widgets', badge: 'New', badgeColor: 'success' },
  {
    label: 'Layout options',
    icon: LayoutTemplate,
    badge: 5,
    badgeColor: 'info',
    children: [
      { label: 'All options', to: '/layout/options' },
      { label: 'Top navigation', to: '/layout/top-nav' },
      { label: 'Boxed', to: '/layout/boxed' },
      { label: 'Fixed footer', to: '/layout/fixed-footer' },
      { label: 'Scrolling navbar & sidebar', to: '/layout/static' },
    ],
  },

  { label: 'Apps', header: true },
  { label: 'Calendar', icon: CalendarDays, to: '/apps/calendar' },
  { label: 'Kanban', icon: KanbanSquare, to: '/apps/kanban' },
  {
    label: 'Mailbox',
    icon: Mail,
    badge: 2,
    children: [
      { label: 'Inbox', to: '/apps/mailbox' },
      { label: 'Compose', to: '/apps/mailbox/compose' },
    ],
  },
  { label: 'Chat', icon: MessagesSquare, to: '/apps/chat' },
  { label: 'Gallery', icon: Images, to: '/apps/gallery' },

  { label: 'Interface', header: true },
  {
    label: 'UI Elements',
    icon: Puzzle,
    children: [
      { label: 'General', to: '/ui/general' },
      { label: 'Icons', to: '/ui/icons' },
      { label: 'Feedback & modals', to: '/ui/feedback' },
      { label: 'Navigation & tabs', to: '/ui/navigation' },
      { label: 'Timeline', to: '/ui/timeline' },
      { label: 'Ribbons & callouts', to: '/ui/ribbons' },
      { label: 'Data display', to: '/ui/data-display' },
      { label: 'Charts', to: '/ui/charts' },
    ],
  },
  {
    label: 'Forms',
    icon: FileText,
    children: [
      { label: 'General elements', to: '/forms/basic' },
      { label: 'Advanced elements', to: '/forms/advanced' },
      { label: 'Validation', to: '/forms/validation' },
      { label: 'Editors', to: '/forms/editors' },
      { label: 'Wizard', to: '/forms/wizard' },
    ],
  },
  {
    label: 'Tables',
    icon: Table2,
    children: [
      { label: 'Simple tables', to: '/tables/simple' },
      { label: 'Data tables', to: '/tables/data' },
      { label: 'Editable grid', to: '/tables/editable' },
    ],
  },

  { label: 'Examples', header: true },
  { label: 'Projects', icon: FolderKanban, to: '/projects' },
  { label: 'Users', icon: Users, to: '/users' },
  { label: 'Contacts', icon: Contact, to: '/contacts' },
  { label: 'Profile', icon: UserRound, to: '/profile' },
  { label: 'E-commerce', icon: ShoppingBag, to: '/ecommerce' },
  { label: 'Billing', icon: CreditCard, to: '/billing' },
  { label: 'Invoice', icon: ReceiptText, to: '/invoice' },
  { label: 'Pricing', icon: Tags, to: '/pricing' },
  { label: 'Search results', icon: Search, to: '/search?q=project' },
  {
    label: 'Extras',
    icon: AppWindow,
    children: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact us', to: '/contact' },
      { label: 'Blank page', to: '/blank' },
    ],
  },
  {
    label: 'Authentication',
    icon: Lock,
    children: [
      { label: 'Sign in', to: '/auth/login' },
      { label: 'Sign in v2', to: '/auth/login-2' },
      { label: 'Register', to: '/auth/register' },
      { label: 'Register v2', to: '/auth/register-2' },
      { label: 'Forgot password', to: '/auth/forgot-password' },
      { label: 'Recover password', to: '/auth/recover-password' },
      { label: 'Lock screen', to: '/auth/lock' },
    ],
  },
  {
    label: 'Error pages',
    icon: TriangleAlert,
    children: [
      { label: '404', to: '/this-page-does-not-exist' },
      { label: '500', to: '/errors/500' },
      { label: 'Maintenance', to: '/errors/maintenance' },
    ],
  },

  { label: 'Misc', header: true },
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Documentation', icon: File, href: 'https://vuejs.org/guide/introduction.html', target: '_blank' },
  {
    label: 'Multi level',
    icon: Layers,
    children: [
      { label: 'Level 2', href: '#' },
      {
        label: 'Level 2 group',
        children: [
          { label: 'Level 3', href: '#' },
          { label: 'Level 3 group', children: [{ label: 'Level 4', href: '#' }, { label: 'Level 4', href: '#' }] },
        ],
      },
      { label: 'Level 2', href: '#' },
    ],
  },
  { label: 'FAQ', icon: CircleHelp, to: '/faq' },

  { label: 'Labels', header: true },
  { label: 'Important', color: 'danger', href: '#' },
  { label: 'Warning', color: 'warning', href: '#' },
  { label: 'Informational', color: 'info', href: '#' },
]
