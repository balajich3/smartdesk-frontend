import { useContext } from 'react'
import { TicketContext } from './ticketStore.js'

export function useTickets() {
  const context = useContext(TicketContext)
  if (!context) throw new Error('useTickets must be used within a TicketProvider')
  return context
}
