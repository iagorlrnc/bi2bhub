import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants'
import { AutoRefreshButton } from '@/components/AutoRefreshButton'
import { toast } from 'sonner'
import {
  Shield,
  FolderOpen,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  CheckSquare,
  FileSpreadsheet,
  PanelLeft,
  ChevronRight,
  Building2,
  Copy,
  Check,
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
  impostos: 'Guias e Impostos',
  tasks: 'Tarefas',
  tarefas: 'Tarefas',
  drive: 'Drive',
  tickets: 'Chamados',
  chamados: 'Chamados',
  team: 'Equipe',
  equipe: 'Equipe',
  settings: 'Configurações',
  configuracoes: 'Configurações',
  profile: 'Perfil',
  perfil: 'Perfil',
  notifications: 'Notificações',
  notificacoes: 'Notificações',
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
      if (import.meta.env.DEV) console.error('Erro ao buscar notificações não lidas:', err)
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
        if (import.meta.env.DEV) console.error('Erro ao marcar notificações como lidas:', err)
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
    if (module === 'team') return isClientMaster
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
  const [copiedCompanyId, setCopiedCompanyId] = useState(false)

  const formatCnpj = (value?: string | null) => {
    if (!value) return ''
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
  }

  const handleCopyCompanyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    const idToCopy = company?.codigo_exclusivo || company?.id
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy)
      setCopiedCompanyId(true)
      toast.success('ID da Empresa copiado!')
      setTimeout(() => setCopiedCompanyId(false), 2000)
    }
  }

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
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#fafafa] dark:bg-slate-950">
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
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#0a4d6a]/40 bg-[#0d6084] text-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 lg:relative lg:z-30',
          isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]',
          mobileOpen ? 'w-[240px] translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header da Sidebar (Logo Fingu-style) */}
        {!isCollapsed ? (
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/15 px-4 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img src={logoPng} alt={APP_NAME} className="h-8 w-auto shrink-0 object-contain drop-shadow" />
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-sm font-bold leading-tight text-white dark:text-white">
                  Consultoria
                </span>
                <span className="text-[10px] font-medium text-sky-200 dark:text-slate-500">
                  Gestão Contábil
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1 text-sky-200 hover:bg-white/10 hover:text-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
              title="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex h-16 shrink-0 items-center justify-center border-b border-white/15 dark:border-slate-800/60">
            <img src={logoPng} alt={APP_NAME} className="h-7 w-auto object-contain drop-shadow" />
          </div>
        )}

        {/* Conteúdo da Sidebar */}
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">
          
          {!isCollapsed ? (
            <div className="px-2">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sky-200/80 dark:text-slate-400">
                  Empresa
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-3 transition-all hover:border-white/30 dark:border-slate-800/60 dark:bg-slate-800/90 dark:hover:border-brand-500/30">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white dark:bg-brand-500/10 dark:text-brand-400 font-bold text-xs">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-white dark:text-slate-100" title={companyName}>
                      {companyName}
                    </p>
                    {company.cnpj && (
                      <p className="truncate text-[10px] text-sky-200/80 dark:text-slate-400">
                        CNPJ: {formatCnpj(company.cnpj)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] dark:border-slate-800/60">
                  <span className="text-sky-200/70 font-medium dark:text-slate-400">ID da Empresa</span>
                  <button
                    type="button"
                    onClick={handleCopyCompanyId}
                    className="flex items-center gap-1 font-mono font-bold text-white hover:text-sky-200 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
                    title="Copiar ID da Empresa"
                  >
                    #{company.codigo_exclusivo || company.id.slice(0, 8)}
                    {copiedCompanyId ? <Check className="h-3 w-3 text-emerald-400 dark:text-emerald-500" /> : <Copy className="h-3 w-3 text-sky-200 dark:text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative flex justify-center my-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-bold text-white dark:border-slate-800 dark:bg-slate-950 dark:text-brand-600">
                {companyInitial}
              </div>
              <div className="pointer-events-none fixed left-[76px] z-[9999] hidden flex-col rounded-xl border border-slate-700/50 bg-slate-900 p-2.5 text-xs text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-900">
                <span className="font-bold text-white">{companyName}</span>
                {company.cnpj && <span className="text-[10px] text-slate-400">CNPJ: {formatCnpj(company.cnpj)}</span>}
                <span className="text-[10px] font-mono font-bold text-brand-400 mt-0.5">ID: #{company.codigo_exclusivo || company.id.slice(0, 8)}</span>
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
                  <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-sky-200/70 dark:text-slate-400">
                    {category.title}
                  </p>
                ) : (
                  catIdx > 0 && (
                    <div className="my-2 h-[1px] bg-white/15 dark:bg-slate-800/60" />
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
                              ? 'bg-white text-[#0d6084] font-bold dark:bg-slate-800 dark:text-white'
                              : 'text-sky-100/90 hover:bg-white/10 hover:text-white dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100',
                            isCollapsed && 'justify-center px-0 py-2.5'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#0d6084] dark:text-brand-400' : 'text-sky-200 group-hover:text-white dark:text-slate-400')} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                            {isCollapsed && (
                              <span className="pointer-events-none fixed left-[76px] z-[9999] hidden rounded-md border border-slate-700/50 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-100 dark:text-slate-900">
                                {item.label}
                              </span>
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
          <div className="mt-auto border-t border-white/15 p-3 space-y-3 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5 rounded-lg p-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0d6084] dark:bg-brand-600 dark:text-white">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white dark:text-slate-200">
                  {profile?.full_name ?? 'Usuário'}
                </p>
                <p className="truncate text-[10px] text-sky-200/80 dark:text-slate-400">
                  {profile?.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate(ROUTES.SETTINGS)}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5 text-sky-200 dark:text-slate-500" />
                <span>Ajustes</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 text-xs font-medium text-white hover:bg-white/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-sky-200 dark:text-slate-500" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto border-t border-white/15 p-2 flex flex-col items-center gap-2 dark:border-slate-800/60">
            <div className="group relative flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0d6084] dark:bg-brand-600 dark:text-white">
                {userInitial}
              </div>
              <span className="pointer-events-none fixed left-[76px] z-[9999] hidden rounded-md border border-slate-700/50 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-100 dark:text-slate-900">
                {profile?.full_name ?? 'Usuário'}
              </span>
            </div>
            <button
              onClick={() => navigate(ROUTES.SETTINGS)}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span className="pointer-events-none fixed left-[76px] z-[9999] hidden rounded-md border border-slate-700/50 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-100 dark:text-slate-900">
                Ajustes
              </span>
            </button>
            <button
              onClick={handleSignOut}
              className="group relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="pointer-events-none fixed left-[76px] z-[9999] hidden rounded-md border border-slate-700/50 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-100 dark:text-slate-900">
                Sair
              </span>
            </button>
          </div>
        )}
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar / Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
            >
              <PanelLeft className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }
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

            {/* Botão de Atualizar Auto (3s) */}
            <AutoRefreshButton />

            {/* Avatar do Usuário */}
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white hover:ring-2 hover:ring-brand-500/40 transition-all"
              title="Meu Perfil"
            >
              {userInitial}
            </button>
          </div>
        </header>

        {/* Conteúdo das Páginas */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-6 lg:p-8 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
