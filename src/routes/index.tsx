import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { AuthGuard, RoleGuard, GuestGuard, PermissionGuard } from '@/routes/guards'

// Layouts / Estruturas de Telas
import { LandingLayout } from '@/layouts/LandingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Páginas — Landing Page (Apresentação)
import { LandingPage } from '@/pages/landing/LandingPage'

// Páginas — Autenticação
import { LoginPage } from '@/pages/auth/LoginPage'

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

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route element={<LandingLayout />}>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
        </Route>

        {/* autenticação */}
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
        </Route>

        {/* painel área cliente */}
        <Route
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['client_master', 'client_user']}>
                <ClientLayout />
              </RoleGuard>
            </AuthGuard>
          }
        >
          <Route path={ROUTES.APP} element={<Navigate to={ROUTES.TAXES} replace />} />
          <Route path={ROUTES.TAXES} element={<PermissionGuard module="strategic"><TaxesPage /></PermissionGuard>} />
          <Route path={ROUTES.TASKS} element={<PermissionGuard module="monitoring"><TasksPage /></PermissionGuard>} />
          <Route path={ROUTES.DRIVE} element={<PermissionGuard module="drive"><DrivePage /></PermissionGuard>} />
          <Route path={ROUTES.TICKETS} element={<PermissionGuard module="tickets"><TicketsPage /></PermissionGuard>} />
          <Route path={ROUTES.TEAM} element={<PermissionGuard module="team"><TeamPage /></PermissionGuard>} />
          <Route path={ROUTES.SETTINGS} element={<PermissionGuard module="settings"><SettingsPage /></PermissionGuard>} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path="/app/notificacoes" element={<Navigate to={ROUTES.NOTIFICATIONS} replace />} />
        </Route>

        {/* painel admin*/}
        <Route
          element={
            <AuthGuard>
              <RoleGuard allowedRoles={['admin', 'staff']}>
                <AdminLayout />
              </RoleGuard>
            </AuthGuard>
          }
        >
          <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_COMPANIES} element={<CompaniesPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersPage />} />
          <Route path={ROUTES.ADMIN_STAFF} element={<StaffPage />} />
          <Route path={ROUTES.ADMIN_TICKETS} element={<AdminTicketsPage />} />
          <Route path={ROUTES.ADMIN_AUDIT} element={<AuditPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.ADMIN_DRIVE} element={<AdminDrivePage />} />
          <Route path={ROUTES.ADMIN_MONTHLY} element={<AdminMonthlyPage />} />
          <Route path={ROUTES.ADMIN_TAXES} element={<AdminTaxesPage />} />
          <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<AdminNotificationsPage />} />
          <Route path="/admin/notificacoes" element={<Navigate to={ROUTES.ADMIN_NOTIFICATIONS} replace />} />
          <Route path="/admin/notification" element={<Navigate to={ROUTES.ADMIN_NOTIFICATIONS} replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
