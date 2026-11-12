import { useState } from 'react'
import { ArrowLeft, Send, UserRound } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ROLES } from '../../context/roles.js'
import { useAuth } from '../auth/useAuth.js'
import { useTickets } from './useTickets.js'
import { AGENT_TICKET_STATUSES } from './demoTickets.js'
import TicketStatusBadge from './TicketStatusBadge.jsx'
import PriorityBadge from './PriorityBadge.jsx'

function formatDateTime(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function TicketDetailPage() {
  const { ticketId } = useParams()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const role = user.role
  const { tickets, updateTicket, addComment } = useTickets()
  const ticket = tickets.find((item) => item.id === ticketId)
  const canViewTicket = ticket && (
    role === ROLES.ADMIN
    || (role === ROLES.MANAGER && ticket.department === user.department)
    || (role === ROLES.EMPLOYEE && ticket.requesterEmail === user.email)
    || (role === ROLES.AGENT && ticket.department === user.department && (!ticket.assignee || ticket.assignee === user.name))
  )
  const [comment, setComment] = useState('')

  const backPath = role === ROLES.EMPLOYEE
    ? '/employee/tickets'
    : role === ROLES.MANAGER
      ? '/manager/tickets'
      : role === ROLES.ADMIN
        ? '/admin/tickets'
      : pathname.includes('/queue/') ? '/agent/queue' : '/agent/tickets'

  if (!canViewTicket) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <Link className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900" to={backPath}>
          <ArrowLeft size={16} /> Back to tickets
        </Link>
        <h1 className="mt-8 text-2xl font-semibold text-neutral-900">Ticket not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This ticket is not available to your account.</p>
      </section>
    )
  }

  const canClaim = role === ROLES.AGENT && !ticket.assignee && ticket.status !== 'Closed'
  const canUpdate = role === ROLES.AGENT && ticket.assignee === user.name && ticket.status !== 'Closed'
  const canComment = ticket.status !== 'Closed' && (canUpdate || role === ROLES.EMPLOYEE)

  function handleComment(event) {
    event.preventDefault()
    if (!comment.trim()) return
    addComment(ticket.id, comment.trim(), user.name)
    setComment('')
  }

  function handleStatusChange(event) {
    if (event.target.value !== ticket.status) {
      toast.success(event.target.value === 'Resolved'
        ? 'Marked resolved. Employee acknowledgement is required before closing.'
        : `Ticket status changed to ${event.target.value}.`)
    }
    updateTicket(ticket.id, { status: event.target.value })
  }

  function handleAssign() {
    if (ticket.assignee !== user.name) {
      updateTicket(ticket.id, { assignee: user.name })
      toast.success('Ticket assigned to you.')
    }
  }

  function handleAcknowledgeResolution() {
    updateTicket(ticket.id, { status: 'Closed', acknowledgedBy: user.name })
    toast.success('Resolution acknowledged. Ticket closed.')
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
      <Link className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900" to={backPath}>
        <ArrowLeft size={16} /> Back to {role === ROLES.AGENT ? 'queue' : 'tickets'}
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-medium text-neutral-500">{ticket.id} · {ticket.department} · {ticket.category}</p>
          <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{ticket.title}</h1>
          <p className="mt-2 text-sm text-neutral-500">Created {formatDateTime(ticket.createdAt)}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <article className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-neutral-900">AI triage summary</h2>
              <span className="text-xs font-medium text-neutral-500">{ticket.department} · {ticket.category}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{ticket.summary}</p>
            <h2 className="mt-5 border-t border-neutral-100 pt-4 text-sm font-semibold text-neutral-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700">{ticket.description}</p>
          </article>

          <section className="rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-semibold text-neutral-900">Activity</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {ticket.activity.map((item, index) => (
                <article className="flex gap-3 px-5 py-4 sm:px-6" key={`${item.createdAt}-${index}`}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                    {item.author.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                      <p className="text-sm font-medium text-neutral-800">{item.author}</p>
                      <time className="text-xs text-neutral-400">{formatDateTime(item.createdAt)}</time>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-neutral-600">{item.message}</p>
                  </div>
                </article>
              ))}
            </div>
            {canComment && (
              <form className="border-t border-neutral-100 p-4 sm:p-5" onSubmit={handleComment}>
                <label className="sr-only" htmlFor="ticket-comment">Add a comment</label>
                <textarea
                  className="min-h-24 w-full resize-y rounded-xl border border-neutral-200 p-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
                  id="ticket-comment"
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Write a reply..."
                  value={comment}
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={!comment.trim()} type="submit">
                    <Send size={14} /> Add reply
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-neutral-900">Request details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-xs text-neutral-500">Requester</dt>
                <dd className="mt-1 font-medium text-neutral-800">{ticket.requester}</dd>
                <dd className="text-xs text-neutral-500">{ticket.requesterEmail}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Priority</dt>
                <dd className="mt-1"><PriorityBadge priority={ticket.priority} /></dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Assignee</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium text-neutral-800">
                  <UserRound size={14} /> {ticket.assignee || 'Unassigned'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Last updated</dt>
                <dd className="mt-1 font-medium text-neutral-800">{formatDateTime(ticket.updatedAt)}</dd>
              </div>
            </dl>
          </section>

          {(canClaim || canUpdate) && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-neutral-900">Agent actions</h2>
              {canClaim && (
                <button className="mt-4 h-9 w-full rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50" onClick={handleAssign} type="button">
                  Assign to me
                </button>
              )}
              {canUpdate && (
                <label className="mt-4 block space-y-2">
                  <span className="text-xs text-neutral-500">Update status</span>
                  <select className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400" onChange={handleStatusChange} value={ticket.status}>
                    {AGENT_TICKET_STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
              )}
            </section>
          )}

          {role === ROLES.EMPLOYEE && ticket.status === 'Resolved' && (
            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h2 className="text-sm font-semibold text-emerald-900">Please confirm the resolution</h2>
              <p className="mt-1 text-xs leading-5 text-emerald-800">Review the agent’s update. Acknowledging it will close this ticket.</p>
              <button className="mt-3 h-9 w-full rounded-lg bg-emerald-700 px-3 text-xs font-medium text-white hover:bg-emerald-800" onClick={handleAcknowledgeResolution} type="button">
                Acknowledge and close
              </button>
            </section>
          )}

          {(role === ROLES.MANAGER || role === ROLES.ADMIN) && (
            <div className="rounded-xl bg-[#f7f7f8] p-4 text-xs leading-5 text-neutral-600">
              Manager preview is read-only.
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default TicketDetailPage
