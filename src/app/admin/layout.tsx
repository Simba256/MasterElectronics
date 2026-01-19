import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  // Allow access to login page without authentication
  // The login page handles its own redirect if already authenticated

  return (
    <div className="flex h-screen bg-gray-100">
      {authenticated && <AdminSidebar />}
      <main className={authenticated ? 'flex-1 overflow-auto' : 'flex-1'}>
        {children}
      </main>
    </div>
  )
}
