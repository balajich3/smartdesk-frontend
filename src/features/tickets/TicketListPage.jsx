import { useMemo, useState } from 'react'
import { Search, Ticket } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTickets } from './useTickets.js'
import { useAuth } from '../auth/useAuth.js'
import { ROLES } from '../../context/roles.js'
import { TICKET_STATUSES } from './demoTickets.js'
import TicketCard from './TicketCard.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'

function TicketListPage({ mode, title, description }) {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All statuses')

  const visibleTickets = useMemo(() => {
    const scopedTickets = tickets.filter((ticket) => {
      if (mode === 'employee') return ticket.requesterEmail === user.email
      if (mode === 'assigned') return ticket.assignee === user.name && ticket.department === user.department
      if (mode === 'queue') return !ticket.assignee && !['Resolved', 'Closed'].includes(ticket.status) && ticket.department === user.department
      if (mode === 'all' && user.role === ROLES.MANAGER) return ticket.department === user.department
      return true
    })

    return scopedTickets.filter((ticket) => {
      const searchText = `${ticket.id} ${ticket.title} ${ticket.requester} ${ticket.department} ${ticket.category} ${ticket.summary}`.toLowerCase()
      return searchText.includes(search.trim().toLowerCase()) && (status === 'All statuses' || ticket.status === status)
    })
  }, [mode, search, status, tickets, user.department, user.email, user.name, user.role])

  function detailPath(ticketId) {
    if (pathname.startsWith('/employee')) return `/employee/tickets/${ticketId}`
    if (pathname.startsWith('/manager')) return `/manager/tickets/${ticketId}`
    if (pathname.startsWith('/admin')) return `/admin/tickets/${ticketId}`
    return pathname.startsWith('/agent/queue')
      ? `/agent/queue/${ticketId}`
      : `/agent/tickets/${ticketId}`
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-9 sm:px-10 sm:py-11">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">Ticket workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          <p className="mt-2 text-sm text-neutral-500">{description}</p>
        </div>
        <div className="text-sm text-neutral-500">{visibleTickets.length} {visibleTickets.length === 1 ? 'ticket' : 'tickets'}</div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tickets"
            value={search}
          />
        </label>
        <select
          aria-label="Filter by ticket status"
          className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          <option>All statuses</option>
          {TICKET_STATUSES.map((ticketStatus) => <option key={ticketStatus}>{ticketStatus}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {visibleTickets.length ? (
          <div>
            {visibleTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                showRequester={!pathname.startsWith('/employee')}
                ticket={ticket}
                to={detailPath(ticket.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Try changing the search or status filter."
            icon={Ticket}
            title="No tickets match this view"
          />
        )}
      </div>
    </section>
  )
}

export default TicketListPage
