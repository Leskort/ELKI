import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { TreePine, LogOut } from 'lucide-react'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen scary-bg">
      <header className="horror-border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin" className="horror-text text-2xl text-horror-glow flex items-center gap-2">
            <TreePine className="w-6 h-6" />
            АДМИН ПАНЕЛЬ
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-horror-glow transition-colors">
              На сайт
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

