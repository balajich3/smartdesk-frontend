import { ArrowRight, BarChart3, CheckCircle2, CircleAlert, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTickets } from '../../features/tickets/useTickets.js'
import TicketCard from '../../features/tickets/TicketCard.jsx'
import { useAuth } from '../../features/auth/useAuth.js'
import { ROLES } from '../../context/roles.js'

function ManagerDashboard() {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const basePath = user.role === ROLES.ADMIN ? '/admin' : '/manager'
  const visibleTickets = user.role === ROLES.MANAGER ? tickets.filter((ticket) => ticket.department === user.department) : tickets
  const activeTickets = visibleTickets.filter((ticket) => ticket.status !== 'Closed')
  const highPriorityTickets = activeTickets.filter((ticket) => ticket.priority === 'High')
  const resolvedTickets = visibleTickets.filter((ticket) => ticket.status === 'Closed')
  const statusData = ['Open', 'In progress', 'Waiting on employee', 'Resolved', 'Closed'].map((status) => ({
    status,
    count: visibleTickets.filter((ticket) => ticket.status === status).length,
  }))
  const recentTickets = [...visibleTickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4)

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-9 sm:px-10 sm:py-11">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">{user.role === ROLES.ADMIN ? 'Admin workspace' : `${user.department} manager workspace`}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Service overview</h1>
          <p className="mt-2 text-sm text-neutral-500">A snapshot of support activity across the team.</p>
        </div>
        <Link className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50 sm:self-auto" to={`${basePath}/reports`}>
          <BarChart3 size={16} /> View reports
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total tickets', value: visibleTickets.length, icon: Ticket },
          { label: 'Active tickets', value: activeTickets.length, icon: CircleAlert },
          { label: 'High priority', value: highPriorityTickets.length, icon: CircleAlert },
          { label: 'Closed', value: resolvedTickets.length, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <div className="rounded-2xl border border-neutral-200 bg-white p-5" key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{label}</p>
              <Icon aria-hidden="true" className="text-neutral-400" size={17} strokeWidth={1.8} />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Tickets by status</h2>
              <p className="mt-1 text-xs text-neutral-500">Current ticket distribution</p>
            </div>
            <Link className="text-xs font-medium text-neutral-600 hover:text-neutral-900" to={`${basePath}/reports`}>Details</Link>
          </div>
          <div className="mt-5 h-64 w-full" role="img" aria-label="Bar chart showing ticket totals by status">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 4, right: 10, left: -20, bottom: 4 }}>
                <CartesianGrid stroke="#eeeeee" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="status" tick={{ fill: '#737373', fontSize: 11 }} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tick={{ fill: '#a3a3a3', fontSize: 11 }} tickLine={false} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="count" fill="#525252" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Recent activity</h2>
              <p className="mt-1 text-xs text-neutral-500">Recently updated tickets</p>
            </div>
            <Link aria-label="View all tickets" className="text-neutral-500 hover:text-neutral-900" to={`${basePath}/tickets`}><ArrowRight size={16} /></Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentTickets.map((ticket) => (
              <TicketCard compact key={ticket.id} showRequester ticket={ticket} to={`${basePath}/tickets/${ticket.id}`} />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default ManagerDashboard
