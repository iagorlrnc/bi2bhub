// ===== Route Constants (Rotas Traduzidas para Português) =====
export const ROUTES = {
  // Landing
  HOME: '/',

  // Autenticação (Rotas em Português)
  LOGIN: '/login',
  ADMIN_LOGIN: '/login',
  REGISTER: '/cadastrar',
  FORGOT_PASSWORD: '/recuperar-senha',
  RESET_PASSWORD: '/redefinir-senha',
  ACCEPT_INVITE: '/aceitar-convite',

  // Área do Cliente (Subdomínio app.* - Rotas internas em Português)
  APP: '/',
  FINANCIAL: '/financas',
  TAXES: '/impostos',
  TASKS: '/tarefas',
  DRIVE: '/drive',
  TICKETS: '/chamados',
  TICKET_DETAIL: '/chamados/:id',
  TEAM: '/equipe',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes',
  NOTIFICATIONS: '/notificacoes',

  // Área de Administração (Subdomínio administrador.* - Rotas internas em Português)
  ADMIN: '/',
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_FINANCIAL: '/financas',
  ADMIN_COMPANIES: '/empresas',
  ADMIN_COMPANY_DETAIL: '/empresas/:id',
  ADMIN_USERS: '/usuarios',
  ADMIN_STAFF: '/contadores',
  ADMIN_TICKETS: '/chamados',
  ADMIN_TICKET_DETAIL: '/chamados/:id',
  ADMIN_AUDIT: '/auditoria',
  ADMIN_SETTINGS: '/configuracoes',
  ADMIN_DRIVE: '/drive',
  ADMIN_MONTHLY: '/tarefas-mensais',
  ADMIN_TAXES: '/impostos',
  ADMIN_NOTIFICATIONS: '/notificacoes',
} as const

export type RouteKey = keyof typeof ROUTES
