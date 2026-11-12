import { createContext } from 'react'

export const TicketContext = createContext(null)
export const TICKET_UPDATED_EVENT = 'smartdesk:ticket-updated'

export function emitTicketUpdated(ticket) {
  if (typeof window === 'undefined' || !ticket?.id) return
  window.dispatchEvent(new CustomEvent(TICKET_UPDATED_EVENT, { detail: ticket }))
}
