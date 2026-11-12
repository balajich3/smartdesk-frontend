import { BarChart3, Inbox, LayoutDashboard, Plus, Ticket, Users } from 'lucide-react'
import { ROLES } from '../context/roles.js'

export const ROLE_NAVIGATION = {
  [ROLES.EMPLOYEE]: {
    label: 'Employee',
    homePath: '/employee',
    links: [
      { label: 'Overview', path: '/employee', icon: LayoutDashboard },
      { label: 'My tickets', path: '/employee/tickets', icon: Ticket },
      { label: 'New request', path: '/employee/new', icon: Plus },
    ],
  },
  [ROLES.AGENT]: {
    label: 'Support Agent',
    homePath: '/agent',
    links: [
      { label: 'Overview', path: '/agent', icon: LayoutDashboard },
      { label: 'Ticket queue', path: '/agent/queue', icon: Inbox },
      { label: 'My assigned tickets', path: '/agent/tickets', icon: Ticket },
    ],
  },
  [ROLES.MANAGER]: {
    label: 'Manager',
    homePath: '/manager',
    links: [
      { label: 'Overview', path: '/manager', icon: LayoutDashboard },
      { label: 'Team workload', path: '/manager/team', icon: Users },
      { label: 'All tickets', path: '/manager/tickets', icon: Ticket },
      { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
    ],
  },
  [ROLES.ADMIN]: {
    label: 'Administrator',
    homePath: '/admin',
    links: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard },
      { label: 'Team workload', path: '/admin/team', icon: Users },
      { label: 'All tickets', path: '/admin/tickets', icon: Ticket },
      { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    ],
  },
}

