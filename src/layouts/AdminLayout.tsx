import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants'
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  MessageSquare,
  ScrollText,
  Settings,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  FolderOpen,
  Calendar,
  FileSpreadsheet,
  Bell,
} from 'lucide-react'

import logoPng from '@/assets/logo.png'

const adminSidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
  { label: 'Empresas', icon: Building2, path: ROUTES.ADMIN_COMPANIES },
  { label: 'Drive de Documentos', icon: FolderOpen, path: ROUTES.ADMIN_DRIVE },
  { label: 'Obrigações Mensais', icon: Calendar, path: ROUTES.ADMIN_MONTHLY },
  { label: 'Guias e Impostos', icon: FileSpreadsheet, path: ROUTES.ADMIN_TAXES },
  { label: 'Usuários', icon: Users, path: ROUTES.ADMIN_USERS },
  { label: 'Contadores', icon: UserCog, path: ROUTES.ADMIN_STAFF },
  { label: 'Chamados', icon: MessageSquare, path: ROUTES.ADMIN_TICKETS },
  { label: 'Notificações', icon: Bell, path: ROUTES.ADMIN_NOTIFICATIONS },
  { label: 'Auditoria', icon: ScrollText, path: ROUTES.ADMIN_AUDIT },
  { label: 'Configurações', icon: Settings, path: ROUTES.ADMIN_SETTINGS },
]

const adminPathLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  companies: 'Empresas',
  users: 'Usuários',
  staff: 'Contadores',
  tickets: 'Chamados',
  audit: 'Auditoria',
  settings: 'Configurações',
  drive: 'Drive de Documentos',
  monthly: 'Obrigações Mensais',
  taxes: 'Guias e Impostos',
  notifications: 'Enviar Notificações',
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return false
  })
  const { profile, signOut } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: adminPathLabels[segment] ?? segment,
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
    isLast: index === pathSegments.length - 1,
  }))

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      {/* Camada de sobreposição da barra lateral (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Barra lateral (Sidebar) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] transition-all duration-300 lg:static lg:translate-x-0 lg:z-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-[240px]'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[hsl(var(--sidebar-border))] px-6">
          <img src={logoPng} alt={APP_NAME} className="h-8 w-auto object-contain" />
          <div className="flex items-center gap-1 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-brand-500">
            Admin
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 hover:bg-[hsl(var(--sidebar-accent))] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Itens de navegação */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto py-4">
          {adminSidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 py-2.5 text-sm font-medium transition-all duration-200 ml-0 mr-4 pl-6 pr-4 rounded-r-full rounded-l-none',
                  isActive
                    ? 'bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-md'
                    : 'text-[hsl(var(--sidebar-foreground))] hover:bg-white/10 hover:text-[hsl(var(--sidebar-foreground))]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full shrink-0 transition-colors',
                      isActive
                        ? 'bg-[hsl(var(--sidebar-primary-foreground))]'
                        : 'bg-white'
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Seção do Usuário */}
        <div className="border-t border-[hsl(var(--sidebar-border))] px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
                {profile?.full_name ?? 'Admin'}
              </p>
              <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                Administrador
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-md p-1.5 text-[hsl(var(--muted-foreground))] hover:bg-white/10 hover:text-white"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Barra de navegação superior (Navbar) */}
        <header className="flex h-16 shrink-0 items-center gap-4 bg-transparent px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Trilha de navegação */}
          <nav className="hidden items-center gap-1 text-sm lg:flex">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.path} className="flex items-center gap-1">
                <span
                  className={cn(
                    crumb.isLast
                      ? 'font-medium text-[hsl(var(--foreground))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  )}
                >
                  {crumb.label}
                </span>
                {idx < breadcrumbs.length - 1 && (
                  <span className="text-[hsl(var(--muted-foreground))] mx-1">&gt;</span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Alternador de tema */}
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Perfil */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-bold text-white dark:bg-brand-900 dark:text-brand-300">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
