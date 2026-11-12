import { ROLES } from '../../context/roles.js'

const SESSION_KEY = 'smartdesk-demo-session'
const ACCOUNT_KEY = 'smartdesk-demo-accounts'

export const DEPARTMENTS = ['IT', 'HR', 'Facilities', 'Java', 'Dotnet', 'AI']
const DEPARTMENT_ROLES = [ROLES.AGENT, ROLES.MANAGER]

export const DEMO_CREDENTIALS = [
  { role: ROLES.EMPLOYEE, email: 'employee@smartdesk.com', password: 'Employee@123', name: 'Maya Chen' },
  { role: ROLES.AGENT, department: 'IT', email: 'agent@smartdesk.com', password: 'Agent@123', name: 'Jordan Lee' },
  { role: ROLES.AGENT, department: 'HR', email: 'hr.agent@smartdesk.com', password: 'HrAgent@123', name: 'Priya Nair' },
  { role: ROLES.AGENT, department: 'Facilities', email: 'facilities.agent@smartdesk.com', password: 'Facilities@123', name: 'Taylor Morgan' },
  { role: ROLES.AGENT, department: 'Java', email: 'java.agent@smartdesk.com', password: 'JavaAgent@123', name: 'Alex Rivera' },
  { role: ROLES.AGENT, department: 'Dotnet', email: 'dotnet.agent@smartdesk.com', password: 'DotnetAgent@123', name: 'Sam Wilson' },
  { role: ROLES.AGENT, department: 'AI', email: 'ai.agent@smartdesk.com', password: 'AiAgent@123', name: 'Casey Nguyen' },
  { role: ROLES.MANAGER, department: 'IT', email: 'manager@smartdesk.com', password: 'Manager@123', name: 'Morgan Patel' },
  { role: ROLES.MANAGER, department: 'HR', email: 'hr.manager@smartdesk.com', password: 'HrManager@123', name: 'Robin Shah' },
  { role: ROLES.MANAGER, department: 'Facilities', email: 'facilities.manager@smartdesk.com', password: 'FacilitiesManager@123', name: 'Jamie Brooks' },
  { role: ROLES.MANAGER, department: 'Java', email: 'java.manager@smartdesk.com', password: 'JavaManager@123', name: 'Drew Kim' },
  { role: ROLES.MANAGER, department: 'Dotnet', email: 'dotnet.manager@smartdesk.com', password: 'DotnetManager@123', name: 'Avery Singh' },
  { role: ROLES.MANAGER, department: 'AI', email: 'ai.manager@smartdesk.com', password: 'AiManager@123', name: 'Riley Chen' },
  { role: ROLES.ADMIN, email: 'admin@smartdesk.com', password: 'Admin@123', name: 'SmartDesk Admin' },
]

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('Browser storage is unavailable. Enable local storage to use demo authentication.')
  }
}

export function getSession() {
  const session = readStorage(SESSION_KEY, null)
  if (!session || !session.email || !session.name || !Object.values(ROLES).includes(session.role)) return null
  if (DEPARTMENT_ROLES.includes(session.role) && !session.department) return { ...session, department: 'IT' }
  return session
}

export function getDemoCredentials(role, department = 'IT') {
  return DEMO_CREDENTIALS.find((account) => account.role === role && (role !== ROLES.AGENT || account.department === department)) || null
}

export function authenticate(email, password, expectedRole) {
  const normalizedEmail = email.trim().toLowerCase()
  const storedAccounts = readStorage(ACCOUNT_KEY, [])
  const demoAccount = DEMO_CREDENTIALS.find((account) => account.email === normalizedEmail)
  const customAccount = Array.isArray(storedAccounts)
    ? storedAccounts.find((account) => account.email === normalizedEmail)
    : null
  const account = demoAccount || customAccount

  if (!account || account.password !== password || account.role !== expectedRole) {
    throw new Error(`Those credentials do not match a ${expectedRole.toLowerCase()} account.`)
  }

  const department = account.department || (DEPARTMENT_ROLES.includes(account.role) ? 'IT' : undefined)
  const session = { name: account.name, email: account.email, role: account.role, ...(department ? { department } : {}) }
  writeStorage(SESSION_KEY, session)
  return session
}

export function createDemoAccount({ name, email, password, role, department = 'IT' }) {
  const normalizedEmail = email.trim().toLowerCase()
  const storedAccounts = readStorage(ACCOUNT_KEY, [])
  const accounts = Array.isArray(storedAccounts) ? storedAccounts : []
  const demoEmailExists = DEMO_CREDENTIALS.some((account) => account.email === normalizedEmail)

  if (!name.trim() || !normalizedEmail || !password || !Object.values(ROLES).includes(role)) {
    throw new Error('Enter your name, email, password, and a valid workspace.')
  }
  if (password.length < 8) throw new Error('Use a password with at least 8 characters.')
  if (DEPARTMENT_ROLES.includes(role) && !SIGNUP_DEPARTMENTS.includes(department)) {
    throw new Error('Choose a department for this account.')
  }
  if (demoEmailExists || accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account already exists with that email address.')
  }

  const account = {
    name: name.trim(),
    email: normalizedEmail,
    // Demo-only credentials are stored locally so this account can be used again in the same browser.
    password,
    role,
    ...(DEPARTMENT_ROLES.includes(role) ? { department } : {}),
  }
  writeStorage(ACCOUNT_KEY, [...accounts, account])
  const session = { name: account.name, email: account.email, role: account.role, ...(account.department ? { department: account.department } : {}) }
  writeStorage(SESSION_KEY, session)
  return session
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // The in-memory React session is still cleared if browser storage is unavailable.
  }
}
