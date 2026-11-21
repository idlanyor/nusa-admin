import { reactive } from 'vue'

export type TicketStatus = 'Open' | 'Pending' | 'Answered' | 'Closed'
export type TicketPriority = 'Low' | 'Normal' | 'High' | 'Urgent'
export interface TicketMessage { from: string; staff: boolean; at: string; body: string; attachments?: string[] }
export interface Ticket {
  id: number
  subject: string
  category: 'Technical' | 'Billing' | 'Sales' | 'Account'
  priority: TicketPriority
  status: TicketStatus
  customer: string
  assignee?: string
  updated: string
  messages: TicketMessage[]
}

export const statusColor = { Open: 'info', Pending: 'warning', Answered: 'success', Closed: 'secondary' } as const
export const priorityColor = { Low: 'secondary', Normal: 'info', High: 'warning', Urgent: 'danger' } as const

/** In-memory ticket store shared by the list and detail pages (demo only). */
export const tickets = reactive<Ticket[]>([
  {
    id: 1042, subject: 'Cannot export orders to CSV', category: 'Technical', priority: 'High', status: 'Open', customer: 'Citra Dewi', assignee: 'Budi Santoso', updated: '2026-11-21 09:12',
    messages: [
      { from: 'Citra Dewi', staff: false, at: '2026-11-21 08:40', body: 'The Export CSV button spins forever when I filter by last month. Smaller ranges work.', attachments: ['console-log.txt'] },
      { from: 'Budi Santoso', staff: true, at: '2026-11-21 09:12', body: 'Thanks Citra — reproduced it. Large exports time out at 30 s; we are moving them to a background job. I will update you today.' },
    ],
  },
  {
    id: 1041, subject: 'Invoice INV-2041 charged twice?', category: 'Billing', priority: 'Urgent', status: 'Pending', customer: 'Dimas Pratama', assignee: 'Ayu Lestari', updated: '2026-11-20 17:05',
    messages: [
      { from: 'Dimas Pratama', staff: false, at: '2026-11-20 16:30', body: 'My card statement shows two charges of $237 on 1 Nov.' },
      { from: 'Ayu Lestari', staff: true, at: '2026-11-20 17:05', body: 'One of them is a pre-authorisation that your bank releases within 5 days. Could you send a screenshot of the statement so we can confirm?' },
    ],
  },
  { id: 1040, subject: 'Request: SSO with Google Workspace', category: 'Sales', priority: 'Normal', status: 'Answered', customer: 'Gita Maharani', assignee: 'Hendra Wijaya', updated: '2026-11-19 11:20', messages: [{ from: 'Gita Maharani', staff: false, at: '2026-11-19 10:02', body: 'Is Google SSO available on the Team plan?' }, { from: 'Hendra Wijaya', staff: true, at: '2026-11-19 11:20', body: 'SSO is part of the Business plan. Happy to arrange a trial if you want to test it.' }] },
  { id: 1039, subject: 'Change account owner', category: 'Account', priority: 'Low', status: 'Closed', customer: 'Fajar Nugroho', assignee: 'Ayu Lestari', updated: '2026-11-15 14:44', messages: [{ from: 'Fajar Nugroho', staff: false, at: '2026-11-15 13:10', body: 'Please move ownership to eka@example.com.' }, { from: 'Ayu Lestari', staff: true, at: '2026-11-15 14:44', body: 'Done — Eka is now the owner. Closing this ticket.' }] },
  { id: 1038, subject: 'Dashboard is slow on Safari', category: 'Technical', priority: 'Normal', status: 'Open', customer: 'Eka Putri', updated: '2026-11-14 08:31', messages: [{ from: 'Eka Putri', staff: false, at: '2026-11-14 08:31', body: 'Charts take ~5 s to appear on Safari 18; Chrome is fine.' }] },
])
let seq = 1042
export function createTicket(t: Omit<Ticket, 'id' | 'status' | 'updated' | 'messages'> & { body: string; attachments?: string[] }) {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const ticket: Ticket = { id: ++seq, subject: t.subject, category: t.category, priority: t.priority, customer: t.customer, status: 'Open', updated: now, messages: [{ from: t.customer, staff: false, at: now, body: t.body, attachments: t.attachments }] }
  tickets.unshift(ticket)
  return ticket
}
