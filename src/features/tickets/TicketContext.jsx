import { useEffect, useState } from 'react'
import { TicketContext, TICKET_UPDATED_EVENT } from './ticketStore.js'
import { DEMO_TICKETS } from './demoTickets.js'
import { classifyTicket } from './classifyTicket.js'
import { useAuth } from '../auth/useAuth.js'
import { addMockNotification } from '../notifications/notificationStore.js'
import { TICKET_STATUSES, TICKET_PRIORITIES } from './demoTickets.js'

const TICKETS_STORAGE_KEY = 'smartdesk-demo-tickets'

function loadDemoTickets() {
  try {
    const storedTickets = window.localStorage.getItem(TICKETS_STORAGE_KEY)
    const parsedTickets = storedTickets ? JSON.parse(storedTickets) : null
    const source = Array.isArray(parsedTickets) ? parsedTickets : DEMO_TICKETS
    return source.map((ticket) => {
      const classification = classifyTicket(ticket)
      const normalizedPriority = ({ Normal: 'Medium', Urgent: 'High' })[ticket.priority] || ticket.priority
      const normalizedStatus = ticket.status === 'Waiting on customer' ? 'Waiting on employee' : ticket.status
      return {
        ...classification,
        ...ticket,
        department: ticket.department || classification.department,
        category: ticket.department ? ticket.category : classification.category,
        summary: ticket.summary || classification.summary,
        priority: TICKET_PRIORITIES.includes(normalizedPriority) ? normalizedPriority : classification.priority,
        status: TICKET_STATUSES.includes(normalizedStatus) ? normalizedStatus : 'Open',
      }
    })
  } catch {
    return DEMO_TICKETS
  }
}

function nextTicketId(tickets) {
  const highestNumber = tickets.reduce((highest, ticket) => {
    const value = Number(ticket.id.replace('SD-', ''))
    return Number.isNaN(value) ? highest : Math.max(highest, value)
  }, 1042)

  return `SD-${highestNumber + 1}`
}

export function TicketProvider({ children }) {
  const { user } = useAuth()
  const [tickets, setTickets] = useState(loadDemoTickets)

  useEffect(() => {
    try {
      window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
    } catch {
      // Demo ticket changes remain available in memory if local storage is unavailable.
    }
  }, [tickets])

  useEffect(() => {
    function syncTickets(event) {
      if (event.key !== TICKETS_STORAGE_KEY || !event.newValue) return
      try {
        const incoming = JSON.parse(event.newValue)
        if (Array.isArray(incoming)) setTickets(incoming)
      } catch {
        // Ignore incomplete storage writes and keep the current ticket state.
      }
    }
    window.addEventListener('storage', syncTickets)
    return () => window.removeEventListener('storage', syncTickets)
  }, [])

  useEffect(() => {
    function applyRealtimeTicket(event) {
      const incomingTicket = event.detail
      if (!incomingTicket?.id) return
      setTickets((current) => current.some((ticket) => ticket.id === incomingTicket.id)
        ? current.map((ticket) => ticket.id === incomingTicket.id ? incomingTicket : ticket)
        : [incomingTicket, ...current])
    }
    window.addEventListener(TICKET_UPDATED_EVENT, applyRealtimeTicket)
    return () => window.removeEventListener(TICKET_UPDATED_EVENT, applyRealtimeTicket)
  }, [])

  function createTicket(formValues) {
    const now = new Date().toISOString()
    const classification = classifyTicket(formValues)
    const ticket = {
      ...formValues,
      id: nextTicketId(tickets),
      ...classification,
      status: 'Open',
      requester: user.name,
      requesterEmail: user.email,
      assignee: null,
      createdAt: now,
      updatedAt: now,
      activity: [{ author: user.name, message: 'Submitted this request for AI triage.', createdAt: now, kind: 'created' }],
    }
    setTickets((current) => [ticket, ...current])
    return ticket
  }

  function updateTicket(ticketId, updates) {
    const now = new Date().toISOString()
    const existingTicket = tickets.find((ticket) => ticket.id === ticketId)

    if (existingTicket && updates.assignee && updates.assignee !== existingTicket.assignee) {
      addMockNotification({
        userEmail: existingTicket.requesterEmail,
        title: 'Your ticket was assigned',
        message: `${updates.assignee} picked up ${existingTicket.id} and will take a look.`,
      })
    }

    setTickets((current) => current.map((ticket) => {
      if (ticket.id !== ticketId) return ticket

      const statusActivity = updates.status === 'Resolved'
        ? 'Marked as resolved. Waiting for employee acknowledgement.'
        : updates.status === 'Closed'
          ? 'Acknowledged the resolution and closed the ticket.'
          : updates.status === 'Waiting on employee'
            ? 'Requested an update from the employee.'
            : `Status changed to ${updates.status}.`
      const activity = updates.status && updates.status !== ticket.status
        ? [{ author: user.name, message: statusActivity, createdAt: now, kind: 'status' }, ...ticket.activity]
        : updates.assignee && updates.assignee !== ticket.assignee
          ? [{ author: user.name, message: `Assigned to ${updates.assignee}.`, createdAt: now, kind: 'assignment' }, ...ticket.activity]
          : ticket.activity

      return {
        ...ticket,
        ...updates,
        ...(updates.status === 'Closed' ? { acknowledgedAt: now } : {}),
        activity,
        updatedAt: now,
      }
    }))
  }

  function addComment(ticketId, message, author) {
    const now = new Date().toISOString()
    setTickets((current) => current.map((ticket) => ticket.id === ticketId
      ? {
          ...ticket,
          updatedAt: now,
          activity: [{ author, message, createdAt: now, kind: 'comment' }, ...ticket.activity],
        }
      : ticket))
  }

  const value = {
    tickets,
    createTicket,
    updateTicket,
    addComment,
  }

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}
