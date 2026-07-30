import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants'
import { AutoRefreshButton } from '@/components/AutoRefreshButton'
import {
  LayoutDashboard,
  Building2,
  Users,
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
  PanelLeft,
  ChevronRight,
} from 'lucide-react'

import logoPng from '@/assets/logo.png'

const adminSidebarCategories = [
  {
    title: 'Visão Geral',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    ],
  },
  {
    title: 'Operações Contábeis',
    items: [
      { label: 'Empresas', icon: Building2, path: ROUTES.ADMIN_COMPANIES },
      { label: 'Drive de Documentos', icon: FolderOpen, path: ROUTES.ADMIN_DRIVE },
      { label: 'Tarefas Mensais', icon: Calendar, path: ROUTES.ADMIN_MONTHLY },
      { label: 'Guias e Impostos', icon: FileSpreadsheet, path: ROUTES.ADMIN_TAXES },
    ],
  },
  {
    title: 'Atendimento & Comunicação',
    items: [
      { label: 'Chamados', icon: MessageSquare, path: ROUTES.ADMIN_TICKETS },
      { label: 'Notificações', icon: Bell, path: ROUTES.ADMIN_NOTIFICATIONS },
    ],
  },
  {
    title: 'Configurações & Pessoas',
    items: [
      { label: 'Usuários', icon: Users, path: ROUTES.ADMIN_USERS },
      { label: 'Equipe', icon: Users, path: ROUTES.ADMIN_STAFF },
      { label: 'Configurações', icon: Settings, path: ROUTES.ADMIN_SETTINGS },
      { label: 'Auditoria', icon: ScrollText, path: ROUTES.ADMIN_AUDIT },
    ],
  },
]

const adminPathLabels: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  companies: 'Empresas',
  empresas: 'Empresas',
  users: 'Usuários',
  usuarios: 'Usuários',
  staff: 'Equipe',
  contadores: 'Equipe',
  tickets: 'Chamados',
  chamados: 'Chamados',
  audit: 'Auditoria',
  auditoria: 'Auditoria',
  settings: 'Configurações',
  configuracoes: 'Configurações',
  drive: 'Drive de Documentos',
  monthly: 'Tarefas Mensais',
  'tarefas-mensais': 'Tarefas Mensais',
  taxes: 'Guias e Impostos',
  impostos: 'Guias e Impostos',
  notifications: 'Enviar Notificações',
  notificacoes: 'Enviar Notificações',
}

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase() ?? 'A'

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
                <span className="text-[10px] font-semibold tracking-wide text-sky-200 dark:text-brand-400">
                  Painel Admin
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
          {/* Seção Administração / Dropdown */}
          {!isCollapsed ? (
            <div className="px-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-200/80 dark:text-slate-400">
                Escritório
              </p>
              <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm p-2.5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white dark:bg-brand-500/10 dark:text-brand-400 shrink-0">
                    Admin
                  </span>
                  <span className="truncate text-xs font-semibold text-white dark:text-slate-200">
                    Bi2B Consultoria
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="group relative flex justify-center my-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-bold text-white dark:border-slate-800 dark:bg-slate-950 dark:text-brand-600">
                A
              </div>
              <div className="pointer-events-none fixed left-[76px] z-[9999] hidden rounded-md border border-slate-700/50 bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap group-hover:flex dark:border-slate-300/50 dark:bg-slate-100 dark:text-slate-900">
                Painel Admin
              </div>
            </div>
          )}

          {/* Categorias Otimizadas por Funcionalidade */}
          {adminSidebarCategories.map((category, catIdx) => (
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
                {category.items.map((item) => {
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
          ))}
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
                  {profile?.full_name ?? 'Administrador'}
                </p>
                <p className="truncate text-[10px] text-sky-200/80 dark:text-slate-400">
                  {profile?.email ?? 'admin@bi2b.com.br'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate(ROUTES.ADMIN_SETTINGS)}
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
                {profile?.full_name ?? 'Admin'}
              </span>
            </div>
            <button
              onClick={() => navigate(ROUTES.ADMIN_SETTINGS)}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {userInitial}
            </div>
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
