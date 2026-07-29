import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AuthGuard, RoleGuard, GuestGuard, PermissionGuard } from '@/routes/guards'
import { getSubdomain, getClientSubdomainUrl, getAdminSubdomainUrl } from '@/utils/subdomain'
import { useAuth } from '@/contexts/AuthContext'

// Layouts / Estruturas de Telas
import { LandingLayout } from '@/layouts/LandingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Loading Fallback super leve
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#0d6084] border-t-transparent dark:border-cyan-400" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Carregando...</span>
      </div>
    </div>
  )
}

// Páginas — Landing Page (Apresentação) - Lazy Loading
const LandingPage = lazy(() => import('@/pages/landing/LandingPage').then(m => ({ default: m.LandingPage })))

// Páginas — Autenticação - Lazy Loading
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const AdminLoginPage = lazy(() => import('@/pages/auth/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))

// Páginas — Área do Cliente - Lazy Loading
const TaxesPage = lazy(() => import('@/pages/client/TaxesPage').then(m => ({ default: m.TaxesPage })))
const TasksPage = lazy(() => import('@/pages/client/TasksPage.tsx').then(m => ({ default: m.TasksPage })))
const DrivePage = lazy(() => import('@/pages/client/DrivePage').then(m => ({ default: m.DrivePage })))
const TicketsPage = lazy(() => import('@/pages/client/TicketsPage').then(m => ({ default: m.TicketsPage })))
const TeamPage = lazy(() => import('@/pages/client/TeamPage').then(m => ({ default: m.TeamPage })))
const SettingsPage = lazy(() => import('@/pages/client/SettingsPage').then(m => ({ default: m.SettingsPage })))
const ProfilePage = lazy(() => import('@/pages/client/ProfilePage').then(m => ({ default: m.ProfilePage })))
const NotificationsPage = lazy(() => import('@/pages/client/NotificationsPage').then(m => ({ default: m.NotificationsPage })))

// Páginas — Área de Administração - Lazy Loading
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const CompaniesPage = lazy(() => import('@/pages/admin/CompaniesPage').then(m => ({ default: m.CompaniesPage })))
const UsersPage = lazy(() => import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage })))
const StaffPage = lazy(() => import('@/pages/admin/StaffPage').then(m => ({ default: m.StaffPage })))
const AdminTicketsPage = lazy(() => import('@/pages/admin/AdminTicketsPage').then(m => ({ default: m.AdminTicketsPage })))
const AuditPage = lazy(() => import('@/pages/admin/AuditPage').then(m => ({ default: m.AuditPage })))
const AdminDrivePage = lazy(() => import('@/pages/admin/AdminDrivePage').then(m => ({ default: m.AdminDrivePage })))
const AdminMonthlyPage = lazy(() => import('@/pages/admin/AdminMonthlyPage').then(m => ({ default: m.AdminMonthlyPage })))
const AdminTaxesPage = lazy(() => import('@/pages/admin/AdminTaxesPage').then(m => ({ default: m.AdminTaxesPage })))
const AdminNotificationsPage = lazy(() => import('@/pages/admin/AdminNotificationsPage.tsx').then(m => ({ default: m.AdminNotificationsPage })))

// Componente para direcionar a raiz '/' conforme o subdomínio ativo
function RootDomainHandler() {
  const subdomain = getSubdomain()
  const { isAuthenticated, isAdmin } = useAuth()

  if (subdomain === 'administrador') {
    if (isAuthenticated) {
      if (isAdmin) {
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
      }
    }
    return (
      <AuthLayout>
        <GuestGuard>
          <AdminLoginPage />
        </GuestGuard>
      </AuthLayout>
    )
  }

  if (subdomain === 'app') {
    if (isAuthenticated) {
      return <Navigate to={ROUTES.TAXES} replace />
    }
    return (
      <AuthLayout>
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      </AuthLayout>
    )
  }

  return (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  )
}

// Roteador isolado por subdomínio para eliminar conflito de URLs idênticas (/drive, /impostos, /chamados, etc.)
function SubdomainRoutes() {
  const subdomain = getSubdomain()

  // 1. SUBDOMÍNIO ADMINISTRATIVO (administrador.*)
  if (subdomain === 'administrador') {
    return (
      <Routes>
        <Route path="/" element={<RootDomainHandler />} />

        {/* Autenticação Admin */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/cadastrar" element={<Navigate to="/" replace />} />
        </Route>

        {/* Painel do Administrador (exclusivo para admin) */}
        <Route
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['admin']}>
                <AdminLayout />
              </RoleGuard>
            </AuthGuard>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_COMPANIES} element={<CompaniesPage />} />
          <Route path={ROUTES.ADMIN_COMPANY_DETAIL} element={<CompaniesPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersPage />} />
          <Route path={ROUTES.ADMIN_STAFF} element={<StaffPage />} />
          <Route path={ROUTES.ADMIN_TICKETS} element={<AdminTicketsPage />} />
          <Route path={ROUTES.ADMIN_TICKET_DETAIL} element={<AdminTicketsPage />} />
          <Route path={ROUTES.ADMIN_AUDIT} element={<AuditPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.ADMIN_DRIVE} element={<AdminDrivePage />} />
          <Route path={ROUTES.ADMIN_MONTHLY} element={<AdminMonthlyPage />} />
          <Route path={ROUTES.ADMIN_TAXES} element={<AdminTaxesPage />} />
          <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<AdminNotificationsPage />} />

          {/* Redirecionamentos de compatibilidade de rotas em inglês */}
          <Route path="/companies" element={<Navigate to={ROUTES.ADMIN_COMPANIES} replace />} />
          <Route path="/users" element={<Navigate to={ROUTES.ADMIN_USERS} replace />} />
          <Route path="/staff" element={<Navigate to={ROUTES.ADMIN_STAFF} replace />} />
          <Route path="/audit" element={<Navigate to={ROUTES.ADMIN_AUDIT} replace />} />
          <Route path="/monthly" element={<Navigate to={ROUTES.ADMIN_MONTHLY} replace />} />
          <Route path="/admin/*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
      </Routes>
    )
  }

  // 2. SUBDOMÍNIO DO CLIENTE (app.*)
  if (subdomain === 'app') {
    return (
      <Routes>
        <Route path="/" element={<RootDomainHandler />} />

        {/* Autenticação Cliente */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
          <Route path="/cadastrar" element={<GuestGuard><RegisterPage /></GuestGuard>} />
          <Route path="/recuperar-senha" element={<GuestGuard><ForgotPasswordPage /></GuestGuard>} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        </Route>

        {/* Painel do Cliente (exclusivo para clientes) */}
        <Route
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['client_master', 'client_user']}>
                <ClientLayout />
              </RoleGuard>
            </AuthGuard>
          }
        >
          <Route path={ROUTES.TAXES} element={<PermissionGuard module="strategic"><TaxesPage /></PermissionGuard>} />
          <Route path={ROUTES.TASKS} element={<PermissionGuard module="monitoring"><TasksPage /></PermissionGuard>} />
          <Route path={ROUTES.DRIVE} element={<PermissionGuard module="drive"><DrivePage /></PermissionGuard>} />
          <Route path={ROUTES.TICKETS} element={<PermissionGuard module="tickets"><TicketsPage /></PermissionGuard>} />
          <Route path={ROUTES.TICKET_DETAIL} element={<PermissionGuard module="tickets"><TicketsPage /></PermissionGuard>} />
          <Route path={ROUTES.TEAM} element={<PermissionGuard module="team"><TeamPage /></PermissionGuard>} />
          <Route path={ROUTES.SETTINGS} element={<PermissionGuard module="settings"><SettingsPage /></PermissionGuard>} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

          {/* Redirecionamentos de compatibilidade de rotas em inglês */}
          <Route path="/taxes" element={<Navigate to={ROUTES.TAXES} replace />} />
          <Route path="/tasks" element={<Navigate to={ROUTES.TASKS} replace />} />
          <Route path="/tickets" element={<Navigate to={ROUTES.TICKETS} replace />} />
          <Route path="/team" element={<Navigate to={ROUTES.TEAM} replace />} />
          <Route path="/settings" element={<Navigate to={ROUTES.SETTINGS} replace />} />
          <Route path="/profile" element={<Navigate to={ROUTES.PROFILE} replace />} />
          <Route path="/notifications" element={<Navigate to={ROUTES.NOTIFICATIONS} replace />} />
          <Route path="/app/*" element={<Navigate to={ROUTES.TAXES} replace />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.TAXES} replace />} />
      </Routes>
    )
  }

  // 3. DOMÍNIO PRINCIPAL (Landing Page)
  return (
    <Routes>
      <Route path="/" element={<RootDomainHandler />} />
      <Route path="/login" element={<Navigate to={getClientSubdomainUrl('/')} replace />} />
      <Route path="/cadastrar" element={<Navigate to={getClientSubdomainUrl('/cadastrar')} replace />} />
      <Route path="/admin" element={<Navigate to={getAdminSubdomainUrl('/')} replace />} />
      <Route path="/administrador" element={<Navigate to={getAdminSubdomainUrl('/')} replace />} />
      <Route path="/app" element={<Navigate to={getClientSubdomainUrl('/')} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <SubdomainRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

