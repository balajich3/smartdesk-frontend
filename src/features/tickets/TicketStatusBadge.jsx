const STATUS_STYLES = {
  Open: 'bg-blue-50 text-blue-700 ring-blue-600/15',
  'In progress': 'bg-violet-50 text-violet-700 ring-violet-600/15',
  'Waiting on employee': 'bg-amber-50 text-amber-700 ring-amber-600/15',
  Resolved: 'bg-amber-50 text-amber-700 ring-amber-600/15',
  Closed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
}

function TicketStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-700 ring-neutral-600/10'}`}>
      {status}
    </span>
  )
}

export default TicketStatusBadge
