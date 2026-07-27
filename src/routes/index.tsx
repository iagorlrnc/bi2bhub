import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AuthGuard, RoleGuard, GuestGuard, PermissionGuard } from '@/routes/guards'
import { getSubdomain, getClientSubdomainUrl } from '@/utils/subdomain'
import { useAuth } from '@/contexts/AuthContext'

// Layouts / Estruturas de Telas
import { LandingLayout } from '@/layouts/LandingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Páginas — Landing Page (Apresentação)
import { LandingPage } from '@/pages/landing/LandingPage'

// Páginas — Autenticação
import { LoginPage } from '@/pages/auth/LoginPage'
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// Páginas — Área do Cliente
import { TaxesPage } from '@/pages/client/TaxesPage'
import { TasksPage } from '@/pages/client/TasksPage.tsx'
import { DrivePage } from '@/pages/client/DrivePage'
import { TicketsPage } from '@/pages/client/TicketsPage'
import { TeamPage } from '@/pages/client/TeamPage'
import { SettingsPage } from '@/pages/client/SettingsPage'
import { ProfilePage } from '@/pages/client/ProfilePage'
import { NotificationsPage } from '@/pages/client/NotificationsPage'

// Páginas — Área de Administração (Staff)
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { CompaniesPage } from '@/pages/admin/CompaniesPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { StaffPage } from '@/pages/admin/StaffPage'
import { AdminTicketsPage } from '@/pages/admin/AdminTicketsPage'
import { AuditPage } from '@/pages/admin/AuditPage'
import { AdminDrivePage } from '@/pages/admin/AdminDrivePage'
import { AdminMonthlyPage } from '@/pages/admin/AdminMonthlyPage'
import { AdminTaxesPage } from '@/pages/admin/AdminTaxesPage'
import { AdminNotificationsPage } from '@/pages/admin/AdminNotificationsPage.tsx'

// Componente para direcionar a raiz '/' conforme o subdomínio ativo
function RootDomainHandler() {
  const subdomain = getSubdomain()
  const { isAuthenticated, isAdmin, isStaff } = useAuth()

  if (subdomain === 'administrador') {
    if (isAuthenticated) {
      if (isAdmin || isStaff) {
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

        {/* Painel do Administrador (exclusivo para admin/staff) */}
        <Route
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['admin', 'staff']}>
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <SubdomainRoutes />
    </BrowserRouter>
  )
}
