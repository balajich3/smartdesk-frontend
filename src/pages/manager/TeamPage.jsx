import { ArrowRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROLES } from '../../context/roles.js'
import { DEMO_CREDENTIALS } from '../../features/auth/authService.js'
import { useTickets } from '../../features/tickets/useTickets.js'
import { useAuth } from '../../features/auth/useAuth.js'

function TeamPage() {
  const { tickets } = useTickets()
  const { user } = useAuth()
  const isAdmin = user.role === ROLES.ADMIN
  const team = DEMO_CREDENTIALS
    .filter((account) => [ROLES.AGENT, ROLES.MANAGER].includes(account.role))
    .filter((account) => isAdmin || account.department === user.department)
    .map((account) => ({
      ...account,
      activeTickets: tickets.filter((ticket) => ticket.assignee === account.name && ticket.status !== 'Closed').length,
    }))

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-9 sm:px-10 sm:py-11">
      <p className="text-sm font-medium text-neutral-500">{isAdmin ? 'Admin workspace' : `${user.department} manager workspace`}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">Team workload</h1>
      <p className="mt-2 text-sm text-neutral-500">Review assignment totals across support.</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Department staff</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">{team.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Unassigned active tickets</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
            {tickets.filter((ticket) => (isAdmin || ticket.department === user.department) && !ticket.assignee && ticket.status !== 'Closed').length}
          </p>
        </div>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-neutral-900">Department managers and agents</h2>
        </div>
        {team.map((member) => (
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6" key={member.name}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
                {member.name.split(' ').map((part) => part[0]).join('')}
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-900">{member.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{member.role === ROLES.MANAGER ? 'Manager' : 'Support Agent'} · {member.department}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="text-sm text-neutral-600">{member.activeTickets} active assigned</div>
              <Link className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900" to={isAdmin ? '/admin/tickets' : '/manager/tickets'}>
                View tickets <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-3 border-t border-neutral-100 bg-neutral-50 px-5 py-4 sm:px-6">
          <Users aria-hidden="true" className="mt-0.5 text-neutral-500" size={16} />
          <p className="text-xs leading-5 text-neutral-500">
            Team members shown here are grouped by department.
          </p>
        </div>
      </section>
    </section>
  )
}

export default TeamPage
