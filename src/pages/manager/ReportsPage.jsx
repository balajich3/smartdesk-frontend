import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTickets } from '../../features/tickets/useTickets.js'
import { useAuth } from '../../features/auth/useAuth.js'
import { ROLES } from '../../context/roles.js'

const CHART_COLORS = ['#404040', '#737373', '#a3a3a3', '#d4d4d4']

function ReportsPage() {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const visibleTickets = user.role === ROLES.MANAGER ? tickets.filter((ticket) => ticket.department === user.department) : tickets
  const statusData = useMemo(() => ['Open', 'In progress', 'Waiting on employee', 'Resolved', 'Closed'].map((status) => ({
    name: status,
    value: visibleTickets.filter((ticket) => ticket.status === status).length,
  })), [visibleTickets])
  const categoryData = useMemo(() => [...new Set(visibleTickets.map((ticket) => ticket.category))].map((category) => ({
    category,
    total: visibleTickets.filter((ticket) => ticket.category === category).length,
  })), [visibleTickets])

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-9 sm:px-10 sm:py-11">
      <p className="text-sm font-medium text-neutral-500">{user.role === ROLES.ADMIN ? 'Admin workspace' : `${user.department} manager workspace`}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Reports</h1>
      <p className="mt-2 text-sm text-neutral-500">Explore a summary of ticket status and request categories.</p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Tickets by category</h2>
          <p className="mt-1 text-xs text-neutral-500">Ticket count by category</p>
          <div className="mt-4 h-72" role="img" aria-label="Bar chart showing tickets by category">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid stroke="#eeeeee" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="category" tick={{ fill: '#737373', fontSize: 11 }} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tick={{ fill: '#a3a3a3', fontSize: 11 }} tickLine={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#525252" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Status distribution</h2>
          <p className="mt-1 text-xs text-neutral-500">Share of tickets by current status</p>
          <div className="mt-4 h-72" role="img" aria-label="Pie chart showing ticket status distribution">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {statusData.map((entry, index) => <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} key={entry.name} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {statusData.map((item, index) => (
              <div className="flex items-center gap-2 text-xs text-neutral-600" key={item.name}>
                <span className="size-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                {item.name} <span className="ml-auto font-medium text-neutral-800">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default ReportsPage
