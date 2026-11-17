/** Static sample data for the demo pages. */
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const revenue = [42100, 45800, 51200, 49700, 56300, 61800, 59400, 66200, 71500, 69800, 77300, 84600]
export const expenses = [31200, 32900, 35100, 36800, 37400, 39900, 41200, 42600, 44100, 45800, 47300, 49900]

export const visitsByDay = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  web: [1820, 2140, 2310, 2080, 2460, 1530, 1290],
  mobile: [1340, 1490, 1620, 1580, 1910, 2040, 1870],
}

export const channels = [
  { label: 'Organic search', value: 4820 },
  { label: 'Direct', value: 2960 },
  { label: 'Social', value: 1740 },
  { label: 'Referral', value: 980 },
]

export interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed'
  date: string
}

const customers = [
  'Ayu Lestari', 'Budi Santoso', 'Citra Dewi', 'Dimas Pratama', 'Eka Putri', 'Fajar Nugroho', 'Gita Maharani',
  'Hendra Wijaya', 'Indah Permata', 'Joko Susilo', 'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini', 'Nanda Saputra',
]
const products = ['Starter plan', 'Team plan', 'Business plan', 'Add-on: Storage', 'Add-on: Seats']
const statuses: Order['status'][] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Paid', 'Failed']
const prices = [19, 79, 249, 12, 35]

export const orders: Order[] = Array.from({ length: 42 }, (_, i) => {
  const customer = customers[i % customers.length]!
  const p = (i * 3) % products.length
  return {
    id: `#${4821 - i}`,
    customer,
    email: `${customer.split(' ')[0]!.toLowerCase()}@example.com`,
    product: products[p]!,
    amount: prices[p]! * (1 + (i % 3)),
    status: statuses[(i * 5) % statuses.length]!,
    date: new Date(2026, 10, 16 - Math.floor(i / 2)).toISOString().slice(0, 10),
  }
})

export const statusColor = { Paid: 'success', Pending: 'warning', Refunded: 'secondary', Failed: 'danger' } as const

export const usd = (v: number) => `$${v.toLocaleString()}`

export type ProjectStatus = 'In progress' | 'Done' | 'On hold' | 'Cancelled'
export interface Project {
  id: number
  name: string
  client: string
  description: string
  status: ProjectStatus
  progress: number
  budget: number
  spent: number
  start: string
  end: string
  lead: string
  team: string[]
}

export const projectStatusColor = { 'In progress': 'info', Done: 'success', 'On hold': 'warning', Cancelled: 'secondary' } as const

export const projects: Project[] = [
  { id: 1, name: 'Website redesign', client: 'PT Sinar Jaya', description: 'New marketing site with a CMS, localized in Indonesian and English.', status: 'In progress', progress: 62, budget: 12500, spent: 7400, start: '2026-09-01', end: '2026-12-15', lead: 'Ayu Lestari', team: ['Ayu Lestari', 'Budi Santoso', 'Citra Dewi'] },
  { id: 2, name: 'Mobile banking app', client: 'Bank Nusantara', description: 'iOS and Android app for retail customers: transfers, bills and statements.', status: 'In progress', progress: 35, budget: 48000, spent: 15100, start: '2026-08-10', end: '2027-03-31', lead: 'Dimas Pratama', team: ['Dimas Pratama', 'Eka Putri', 'Fajar Nugroho', 'Gita Maharani'] },
  { id: 3, name: 'Billing migration', client: 'Internal', description: 'Move subscriptions from the legacy billing system to the new provider.', status: 'Done', progress: 100, budget: 9200, spent: 8800, start: '2026-05-02', end: '2026-08-30', lead: 'Hendra Wijaya', team: ['Hendra Wijaya', 'Indah Permata'] },
  { id: 4, name: 'Analytics dashboard', client: 'Kopi Kenangan Senja', description: 'Sales and inventory dashboard across 40 outlets.', status: 'On hold', progress: 15, budget: 21000, spent: 3100, start: '2026-10-01', end: '2027-01-31', lead: 'Kartika Sari', team: ['Kartika Sari', 'Lukman Hakim'] },
  { id: 5, name: 'Help center', client: 'Internal', description: 'Searchable knowledge base with article feedback and analytics.', status: 'In progress', progress: 82, budget: 6400, spent: 5000, start: '2026-07-15', end: '2026-11-30', lead: 'Maya Anggraini', team: ['Maya Anggraini', 'Nanda Saputra', 'Ayu Lestari'] },
  { id: 6, name: 'Warehouse scanner', client: 'Logistik Prima', description: 'Barcode scanning app for receiving and picking.', status: 'Cancelled', progress: 20, budget: 15000, spent: 2900, start: '2026-04-01', end: '2026-06-30', lead: 'Joko Susilo', team: ['Joko Susilo'] },
]

export interface Contact {
  name: string
  role: string
  company: string
  email: string
  phone: string
  city: string
  tags: string[]
}

export const contacts: Contact[] = [
  { name: 'Ayu Lestari', role: 'Product designer', company: 'Nusa Digital', email: 'ayu@example.com', phone: '+62 812 1000 2001', city: 'Bandung', tags: ['Design', 'UX'] },
  { name: 'Budi Santoso', role: 'Backend engineer', company: 'Nusa Digital', email: 'budi@example.com', phone: '+62 812 1000 2002', city: 'Jakarta', tags: ['Go', 'Postgres'] },
  { name: 'Citra Dewi', role: 'Customer success', company: 'Sinar Jaya', email: 'citra@example.com', phone: '+62 812 1000 2003', city: 'Surabaya', tags: ['Support'] },
  { name: 'Dimas Pratama', role: 'Frontend engineer', company: 'Bank Nusantara', email: 'dimas@example.com', phone: '+62 812 1000 2004', city: 'Yogyakarta', tags: ['Vue', 'TypeScript'] },
  { name: 'Eka Putri', role: 'QA lead', company: 'Bank Nusantara', email: 'eka@example.com', phone: '+62 812 1000 2005', city: 'Semarang', tags: ['Testing'] },
  { name: 'Fajar Nugroho', role: 'DevOps', company: 'Logistik Prima', email: 'fajar@example.com', phone: '+62 812 1000 2006', city: 'Medan', tags: ['Cloud', 'CI'] },
  { name: 'Gita Maharani', role: 'Data analyst', company: 'Kopi Kenangan Senja', email: 'gita@example.com', phone: '+62 812 1000 2007', city: 'Denpasar', tags: ['SQL', 'BI'] },
  { name: 'Hendra Wijaya', role: 'Engineering manager', company: 'Nusa Digital', email: 'hendra@example.com', phone: '+62 812 1000 2008', city: 'Makassar', tags: ['Leadership'] },
]

/** Deterministic placeholder artwork (no network requests). */
export function placeholderImage(seed: number, w = 640, h = 420, label = '') {
  const hues = [222, 262, 168, 28, 340, 196, 120, 8]
  const a = hues[seed % hues.length]!
  const b = (a + 40) % 360
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a} 70% 58%)"/><stop offset="1" stop-color="hsl(${b} 65% 38%)"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<circle cx="${(seed * 97) % w}" cy="${(seed * 53) % h}" r="${h / 2.4}" fill="#fff" fill-opacity=".09"/>
<circle cx="${w - ((seed * 61) % w)}" cy="${h - ((seed * 37) % h)}" r="${h / 3.2}" fill="#000" fill-opacity=".08"/>
${label ? `<text x="50%" y="52%" fill="#fff" fill-opacity=".85" font-family="system-ui,sans-serif" font-size="${Math.round(h / 9)}" font-weight="700" text-anchor="middle">${label}</text>` : ''}
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
