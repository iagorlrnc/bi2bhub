// ===== Route Constants =====
export const ROUTES = {
  // Landing
  HOME: '/',

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ACCEPT_INVITE: '/auth/accept-invite',

  // Client Panel
  APP: '/app',
  TAXES: '/app/taxes',
  TASKS: '/app/tasks',
  DRIVE: '/app/drive',
  TICKETS: '/app/tickets',
  TICKET_DETAIL: '/app/tickets/:id',
  TEAM: '/app/team',
  PROFILE: '/app/profile',
  SETTINGS: '/app/settings',
  NOTIFICATIONS: '/app/notifications',

  // Admin Panel
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_COMPANY_DETAIL: '/admin/companies/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_TICKETS: '/admin/tickets',
  ADMIN_TICKET_DETAIL: '/admin/tickets/:id',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_DRIVE: '/admin/drive',
  ADMIN_MONTHLY: '/admin/monthly',
  ADMIN_TAXES: '/admin/taxes',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
} as const

export type RouteKey = keyof typeof ROUTES
