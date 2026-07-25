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
  PanelLeft,
  HelpCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

import logoPng from '@/assets/logo.png'

const clientSidebarCategories = [
  {
    title: 'Gestão & Impostos',
    items: [
      { label: 'Guias e Impostos', icon: FileSpreadsheet, path: ROUTES.TAXES, module: 'strategic' },
      { label: 'Tarefas', icon: CheckSquare, path: ROUTES.TASKS, module: 'monitoring' },
    ],
  },
  {
    title: 'Documentos & Atendimento',
    items: [
      { label: 'Drive', icon: FolderOpen, path: ROUTES.DRIVE, module: 'drive' },
      { label: 'Chamados', icon: MessageSquare, path: ROUTES.TICKETS, module: 'tickets' },
    ],
  },
  {
    title: 'Configurações',
    items: [
      { label: 'Equipe', icon: Users, path: ROUTES.TEAM, module: 'team' },
      { label: 'Configurações', icon: Settings, path: ROUTES.SETTINGS, module: 'settings' },
    ],
  },
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const handleSignOut = async () => {
    await signOut()
    navigate(ROUTES.LOGIN)
  }

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'
  const companyName = company?.trade_name ?? company?.name ?? 'Empresa'
  const companyInitial = companyName.charAt(0).toUpperCase()

  // Se o cliente não possuir empresa vinculada ativa
  if (!company) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-black/5 dark:border-slate-800 dark:bg-slate-950 animate-fade-in-up">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Shield className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            Sem Empresa Vinculada
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Sua conta de usuário (<span className="font-semibold">{profile?.email}</span>) não possui nenhuma empresa vinculada ou o vínculo está inativo.
          </p>
          <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-4">
            Por favor, entre em contato com a equipe de suporte ou com o administrador do escritório contábil para realizar a vinculação da sua conta.
          </p>
          <button
            onClick={handleSignOut}
            className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all animate-pulse"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-slate-900">
      {/* Overlay Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Fingu-style */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-[#f8f9fa] text-slate-800 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 lg:static lg:z-0',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]',
          mobileOpen ? 'w-[240px] translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header da Sidebar (Logo Fingu-style) */}
        {!isCollapsed ? (
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 px-4 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src={logoPng} alt={APP_NAME} className="h-8 w-auto shrink-0 object-contain" />
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-sm font-bold leading-tight text-slate-900 dark:text-white">
                  Bi2B
                </span>
                <span className="text-[10px] font-medium text-slate-500">
                  Gestão Contábil
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 lg:hidden"
              title="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-200/60 dark:border-slate-800/60">
            <img src={logoPng} alt={APP_NAME} className="h-7 w-auto object-contain" />
          </div>
        )}

        {/* Conteúdo da Sidebar */}
        <div className="flex flex-1 flex-col overflow-y-auto px-2 py-3 space-y-4">
          {/* Seção Empresas Fingu-style Dropdown */}
          {!isCollapsed ? (
            <div className="px-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Empresas
              </p>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center rounded-md bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400 shrink-0">
                    Ativa
                  </span>
                  <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {companyName}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              </div>
              {company.document && (
                <p className="mt-1 px-1 text-[10px] text-slate-400">
                  CNPJ: {company.document}
                </p>
              )}
            </div>
          ) : (
            <div className="group relative flex justify-center my-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-brand-600 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {companyInitial}
              </div>
              <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                {companyName}
              </div>
            </div>
          )}

          {/* Categorias Otimizadas por Funcionalidade */}
          {clientSidebarCategories.map((category, catIdx) => {
            const visibleItems = category.items.filter((item) =>
              hasModuleAccess(item.module)
            )

            if (visibleItems.length === 0) return null

            return (
              <div key={category.title} className="space-y-1">
                {!isCollapsed ? (
                  <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {category.title}
                  </p>
                ) : (
                  catIdx > 0 && (
                    <div className="my-2 h-[1px] bg-slate-200/60 dark:bg-slate-800/60" />
                  )
                )}

                <nav className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                            isActive
                              ? 'bg-slate-200/70 text-slate-900 font-semibold dark:bg-slate-800 dark:text-white'
                              : 'text-slate-600 hover:bg-slate-200/40 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100',
                            isCollapsed && 'justify-center px-0 py-2.5'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400')} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                            {isCollapsed && (
                              <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                                {item.label}
                              </div>
                            )}
                          </>
                        )}
                      </NavLink>
                    )
                  })}
                </nav>
              </div>
            )
          })}
        </div>

        {/* Rodapé da Sidebar Fingu-style */}
        {!isCollapsed ? (
          <div className="mt-auto border-t border-slate-200/60 p-3 space-y-3 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5 rounded-lg p-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.full_name ?? 'Usuário'}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {profile?.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate(ROUTES.SETTINGS)}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                <span>Ajuda</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto border-t border-slate-200/60 p-2 flex flex-col items-center gap-2 dark:border-slate-800/60">
            <div className="group relative flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                {profile?.full_name ?? 'Usuário'}
              </div>
            </div>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              <HelpCircle className="h-4 w-4" />
              <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                Ajuda
              </div>
            </button>
            <button
              onClick={handleSignOut}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              <LogOut className="h-4 w-4" />
              <div className="absolute left-full ml-2 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                Sair
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar / Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex lg:hidden items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="hidden items-center gap-1.5 text-xs sm:flex font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.path} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      crumb.isLast
                        ? 'font-semibold text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors'
                    )}
                  >
                    {crumb.label}
                  </span>
                  {idx < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Campo de Busca (Fingu style) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-48 lg:w-60 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-4 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 transition-all"
              />
              <Search className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Notificações */}
            <button
              onClick={handleNotificationsClick}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Alternador de Tema */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Avatar do Usuário */}
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-sm hover:ring-2 hover:ring-brand-500/40 transition-all"
              title="Meu Perfil"
            >
              {userInitial}
            </button>
          </div>
        </header>

        {/* Conteúdo das Páginas */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6 lg:p-8 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
