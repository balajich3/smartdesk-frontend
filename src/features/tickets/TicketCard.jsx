import { Link } from 'react-router-dom'
import PriorityBadge from './PriorityBadge.jsx'
import TicketStatusBadge from './TicketStatusBadge.jsx'

function TicketCard({ ticket, to, showRequester = false, compact = false }) {
  return (
    <Link
      className={`flex flex-col gap-3 px-5 py-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${compact ? '' : 'border-b border-neutral-100 last:border-b-0'}`}
      to={to}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900">{ticket.title}</p>
        <p className="mt-1 truncate text-xs text-neutral-500">
          {ticket.id} <span aria-hidden="true">·</span> {ticket.department} <span aria-hidden="true">·</span> {ticket.category}
          {showRequester && <> <span aria-hidden="true">·</span> {ticket.requester}</>}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <TicketStatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>
    </Link>
  )
}

export default TicketCard
