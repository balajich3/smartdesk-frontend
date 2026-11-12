import { ArrowRight, Plus, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTickets } from '../../features/tickets/useTickets.js'
import { useAuth } from '../../features/auth/useAuth.js'
import TicketCard from '../../features/tickets/TicketCard.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

function EmployeeDashboard() {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const myTickets = tickets.filter((ticket) => ticket.requesterEmail === user.email)
  const latestTickets = [...myTickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)
  const summary = [
    { label: 'Open', count: myTickets.filter((ticket) => ticket.status === 'Open').length },
    { label: 'In progress', count: myTickets.filter((ticket) => ['In progress', 'Waiting on employee'].includes(ticket.status)).length },
    { label: 'Needs confirmation', count: myTickets.filter((ticket) => ticket.status === 'Resolved').length },
    { label: 'Closed', count: myTickets.filter((ticket) => ticket.status === 'Closed').length },
  ]

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-9 sm:px-10 sm:py-11">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">Employee workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            Your support overview
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Keep track of your requests and get help from your support team.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white transition hover:bg-neutral-700 sm:self-auto"
          to="/employee/new"
        >
          <Plus size={16} />
          New request
        </Link>
      </div>

      <div className="mt-8 max-w-2xl">
        <section aria-labelledby="ticket-summary-heading" className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700">
              <Ticket aria-hidden="true" size={19} strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900" id="ticket-summary-heading">
                Ticket summary
              </h2>
          <p className="mt-1 text-sm leading-5 text-neutral-500">
                A quick look at your current support requests.
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 divide-x divide-neutral-200 rounded-xl bg-neutral-50 py-4 sm:grid-cols-4">
            {summary.map(({ label, count }) => (
              <div className="px-3 text-center" key={label}>
                <p className="text-2xl font-semibold tracking-tight text-neutral-900">{count}</p>
                <p className="mt-1 text-xs text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <section aria-labelledby="recent-requests-heading" className="mt-8 rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900" id="recent-requests-heading">
              Recent requests
            </h2>
            <p className="mt-1 text-xs text-neutral-500">Your latest support activity</p>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            to="/employee/tickets"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {latestTickets.length ? (
          <div className="divide-y divide-neutral-100">
            {latestTickets.map((ticket) => (
              <TicketCard compact key={ticket.id} ticket={ticket} to={`/employee/tickets/${ticket.id}`} />
            ))}
          </div>
        ) : (
          <EmptyState description="Create a request and it will appear here." title="No requests yet" />
        )}
      </section>
    </section>
  )
}

export default EmployeeDashboard
