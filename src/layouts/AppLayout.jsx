import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader.jsx'
import AppSidebar from '../components/layout/AppSidebar.jsx'

function AppLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-white text-neutral-900">
      <AppSidebar
        mobileOpen={mobileNavigationOpen}
        onNavigate={() => setMobileNavigationOpen(false)}
      />
      <div className="flex min-h-svh min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={() => setMobileNavigationOpen(true)} />
        <main className="flex-1 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
