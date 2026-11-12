import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthContext.jsx'
import { useAuth } from '../features/auth/useAuth.js'
import { NotificationProvider } from '../features/notifications/NotificationContext.jsx'
import { ROLES } from '../context/roles.js'
import { TicketProvider } from '../features/tickets/TicketContext.jsx'
import TicketDetailPage from '../features/tickets/TicketDetailPage.jsx'
import TicketListPage from '../features/tickets/TicketListPage.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import AgentDashboard from '../pages/agent/AgentDashboard.jsx'
import AuthLandingPage from '../pages/auth/AuthLandingPage.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard.jsx'
import NewTicketPage from '../pages/employee/NewTicketPage.jsx'
import TeamPage from '../pages/manager/TeamPage.jsx'
import RequireRole from './RequireRole.jsx'
import { ROLE_NAVIGATION } from './navigation.js'

const ManagerDashboard = lazy(() => import('../pages/manager/ManagerDashboard.jsx'))
const ReportsPage = lazy(() => import('../pages/manager/ReportsPage.jsx'))

function PageLoading() {
  return <LoadingState label="Loading workspace..." />
}

function AuthHomePage() {
  const { user } = useAuth()
  return user ? <Navigate replace to={ROLE_NAVIGATION[user.role].homePath} /> : <AuthLandingPage initialMode="login" />
}

function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate replace to="/" />
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate replace to={ROLE_NAVIGATION[user.role].homePath} /> : children
}

function NotFoundPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-white px-6 text-center">
      <div>
        <p className="text-sm font-medium text-neutral-500">SmartDesk</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This page is not part of the current workspace.</p>
      </div>
    </main>
  )
}

function WorkspaceRoutes() {
  return (
    <Routes>
      <Route element={<AuthHomePage />} path="/" />
      <Route element={<GuestRoute><AuthLandingPage initialMode="login" /></GuestRoute>} path="/login/:role" />
      <Route element={<GuestRoute><AuthLandingPage initialMode="signup" /></GuestRoute>} path="/signup/:role" />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route element={<RequireRole allowedRole={ROLES.EMPLOYEE} />} path="employee">
            <Route element={<EmployeeDashboard />} index />
            <Route element={<TicketListPage description="Track updates on the requests you have submitted." mode="employee" title="My tickets" />} path="tickets" />
            <Route element={<TicketDetailPage />} path="tickets/:ticketId" />
            <Route element={<NewTicketPage />} path="new" />
          </Route>
          <Route element={<RequireRole allowedRole={ROLES.AGENT} />} path="agent">
            <Route element={<AgentDashboard />} index />
            <Route element={<TicketListPage description="Claim unassigned requests for your department." mode="queue" title="Ticket queue" />} path="queue" />
            <Route element={<TicketDetailPage />} path="queue/:ticketId" />
            <Route element={<TicketListPage description="Tickets currently assigned to you." mode="assigned" title="My assigned tickets" />} path="tickets" />
            <Route element={<TicketDetailPage />} path="tickets/:ticketId" />
          </Route>
          <Route element={<RequireRole allowedRole={ROLES.MANAGER} />} path="manager">
            <Route element={<Suspense fallback={<PageLoading />}><ManagerDashboard /></Suspense>} index />
            <Route element={<TeamPage />} path="team" />
            <Route element={<TicketListPage description="Review all requests across support." mode="all" title="All tickets" />} path="tickets" />
            <Route element={<TicketDetailPage />} path="tickets/:ticketId" />
            <Route element={<Suspense fallback={<PageLoading />}><ReportsPage /></Suspense>} path="reports" />
          </Route>
          <Route element={<RequireRole allowedRole={ROLES.ADMIN} />} path="admin">
            <Route element={<Suspense fallback={<PageLoading />}><ManagerDashboard /></Suspense>} index />
            <Route element={<TeamPage />} path="team" />
            <Route element={<TicketListPage description="Review requests across every department." mode="all" title="All tickets" />} path="tickets" />
            <Route element={<TicketDetailPage />} path="tickets/:ticketId" />
            <Route element={<Suspense fallback={<PageLoading />}><ReportsPage /></Suspense>} path="reports" />
          </Route>
        </Route>
      </Route>
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  )
}

function AppRoutes() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TicketProvider>
          <WorkspaceRoutes />
        </TicketProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default AppRoutes
