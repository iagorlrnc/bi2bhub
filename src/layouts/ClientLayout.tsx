import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants'
import {
  Shield,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  CheckSquare,
  FileSpreadsheet,
} from 'lucide-react'

import logoPng from '@/assets/logo.png'

const sidebarItems = [
  { label: 'Guias e Impostos', icon: FileSpreadsheet, path: ROUTES.TAXES, module: 'strategic' },
  { label: 'Tarefas', icon: CheckSquare, path: ROUTES.TASKS, module: 'monitoring' },
  { label: 'Drive', icon: FolderOpen, path: ROUTES.DRIVE, module: 'drive' },
  { label: 'Chamados', icon: MessageSquare, path: ROUTES.TICKETS, module: 'tickets' },
  { label: 'Equipe', icon: Users, path: ROUTES.TEAM, module: 'team' },
  { label: 'Configurações', icon: Settings, path: ROUTES.SETTINGS, module: 'settings' },
]

// Rótulos da trilha de navegação (breadcrumb)
const pathLabels: Record<string, string> = {
  app: 'Início',
  strategic: 'Guias e Impostos',
  taxes: 'Guias e Impostos',
  tasks: 'Tarefas',
  drive: 'Drive',
  tickets: 'Chamados',
  team: 'Equipe',
  settings: 'Configurações',
  profile: 'Perfil',
  notifications: 'Notificações',
}

export function ClientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return false
  })
  const { user, profile, company, signOut, isClientMaster, companyUser } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    if (!user?.id) return
    try {
      const { count, error } = await supabase
        .from('notificacoes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .neq('deleted_by_client', true)
      if (!error) {
        setUnreadCount(count || 0)
      }
    } catch (err) {
      console.error('Erro ao buscar notificações não lidas:', err)
    }
  }

  const handleNotificationsClick = async () => {
    navigate(ROUTES.NOTIFICATIONS)
    if (unreadCount > 0 && user?.id) {
      setUnreadCount(0)
      try {
        await supabase
          .from('notificacoes')
          .update({ is_read: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
      } catch (err) {
        console.error('Erro ao marcar notificações como lidas:', err)
      }
    }
  }

  useEffect(() => {
    if (!user?.id) return

    fetchUnreadCount()

    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchUnreadCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  // Construir a trilha de navegação (breadcrumb)
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: pathLabels[segment] ?? segment,
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
    isLast: index === pathSegments.length - 1,
  }))

  // Verificar acesso ao módulo
  const hasModuleAccess = (module: string) => {
    if (isClientMaster) return true
    const permissions = companyUser?.permissions ?? []
    return Array.isArray(permissions) && permissions.includes(module)
  }

  const filteredSidebarItems = sidebarItems.filter((item) =>
    hasModuleAccess(item.module)
  )

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  // Se o cliente não possuir empresa vinculada ativa
  if (!company) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[hsl(var(--background))] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center shadow-xl shadow-black/5 animate-fade-in-up">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-[hsl(var(--foreground))]">
            Sem Empresa Vinculada
          </h2>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            Sua conta de usuário (<span className="font-semibold">{profile?.email}</span>) não possui nenhuma empresa vinculada ou o vínculo está inativo.
          </p>
          <p className="mt-4 text-xs text-[hsl(var(--muted-foreground))] leading-relaxed border-t border-[hsl(var(--border))] pt-4">
            Por favor, entre em contato com a equipe de suporte ou com o administrador do escritório contábil para realizar a vinculação da sua conta.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-6 w-full rounded-lg bg-[hsl(var(--destructive))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--destructive-foreground))] shadow-md hover:opacity-90 transition-all animate-pulse"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    )
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
        <div className="flex h-16 items-center border-b border-[hsl(var(--sidebar-border))] px-6">
          <img src={logoPng} alt={APP_NAME} className="h-8 w-auto object-contain" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 hover:bg-[hsl(var(--sidebar-accent))] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informações da Empresa */}
        {company && (
          <div className="border-b border-[hsl(var(--sidebar-border))] px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Empresa
            </p>
            <p className="mt-1 truncate text-base font-semibold text-[hsl(var(--sidebar-foreground))]">
              {company.trade_name ?? company.name}
            </p>
          </div>
        )}

        {/* Itens de navegação */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto py-4">
          {filteredSidebarItems.map((item) => (
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
                {profile?.full_name ?? 'Usuário'}
              </p>
              <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">
                {profile?.email}
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

          {/* Busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-48 sm:w-64 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-10 text-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
            />
            <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Alternador de tema (Tema) */}
          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            title={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notificações */}
          <button
            onClick={handleNotificationsClick}
            className="relative rounded-md p-2 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[hsl(var(--background))] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Perfil */}
          <button
            onClick={() => navigate(ROUTES.PROFILE)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-sm font-bold text-white hover:ring-2 hover:ring-brand-300 dark:bg-brand-900 dark:text-brand-300"
          >
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
          </button>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
