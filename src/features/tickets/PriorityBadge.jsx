const PRIORITY_STYLES = {
  Low: 'bg-neutral-100 text-neutral-600',
  Medium: 'bg-sky-50 text-sky-700',
  High: 'bg-orange-50 text-orange-700',
}

function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[priority] || 'bg-neutral-100 text-neutral-700'}`}>
      {priority}
    </span>
  )
}

export default PriorityBadge
