import { ArrowRight, Clock3, Inbox, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTickets } from '../../features/tickets/useTickets.js'
import { useAuth } from '../../features/auth/useAuth.js'
import TicketCard from '../../features/tickets/TicketCard.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

const QUEUE_STATS = [
  { label: 'Unassigned', icon: Inbox },
  { label: 'Assigned to me', icon: UserRound },
  { label: 'Waiting on employee', icon: Clock3 },
]

function AgentDashboard() {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const departmentTickets = tickets.filter((ticket) => ticket.department === user.department)
  const visibleTickets = departmentTickets.filter((ticket) => !ticket.assignee || ticket.assignee === user.name)
  const activeTickets = visibleTickets.filter((ticket) => ticket.status !== 'Closed')
  const attentionTickets = [...activeTickets]
    .sort((a, b) => ['High', 'Medium', 'Low'].indexOf(a.priority) - ['High', 'Medium', 'Low'].indexOf(b.priority))
    .slice(0, 3)

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-9 sm:px-10 sm:py-11">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">{user.department} support workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Triage overview</h1>
          <p className="mt-2 text-sm text-neutral-500">Review incoming requests and keep your assigned work moving.</p>
        </div>
        <Link className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 sm:self-auto" to="/agent/queue">
          <Inbox size={16} /> Open ticket queue
        </Link>
      </div>

      <section aria-labelledby="queue-overview-heading" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900" id="queue-overview-heading">Queue overview</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUEUE_STATS.map(({ label, icon: Icon }) => {
            const count = label === 'Unassigned'
              ? activeTickets.filter((ticket) => !ticket.assignee).length
              : label === 'Assigned to me'
                ? activeTickets.filter((ticket) => ticket.assignee === user.name).length
                : activeTickets.filter((ticket) => ticket.status === 'Waiting on employee').length

            return (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5" key={label}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">{label}</p>
                  <Icon aria-hidden="true" className="text-neutral-400" size={17} strokeWidth={1.8} />
                </div>
                <p className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">{count}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="priority-inbox-heading" className="mt-8 rounded-2xl border border-neutral-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900" id="priority-inbox-heading">Priority inbox</h2>
            <p className="mt-1 text-xs text-neutral-500">Active tickets ordered by priority</p>
          </div>
          <Link className="inline-flex items-center gap-1 self-start text-xs font-medium text-neutral-600 hover:text-neutral-900 sm:self-auto" to="/agent/queue">
            Go to queue <ArrowRight size={14} />
          </Link>
        </div>
        {attentionTickets.length ? (
          <div className="divide-y divide-neutral-100">
            {attentionTickets.map((ticket) => (
              <TicketCard compact key={ticket.id} showRequester ticket={ticket} to={`/agent/queue/${ticket.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState description="New requests will appear in the ticket queue." icon={Inbox} title="No active tickets" />
        )}
      </section>

    </section>
  )
}

export default AgentDashboard
