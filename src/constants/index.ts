// ===== Module permissions =====
export const MODULES = [
  'dashboard',
  'strategic',
  'monitoring',
  'xml',
  'drive',
  'tickets',
  'team',
  'settings',
] as const

export type ModuleKey = (typeof MODULES)[number]

// ===== Module Labels =====
export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: 'Dashboard',
  strategic: 'Visão Estratégica',
  monitoring: 'Monitoramento',
  xml: 'XML Fiscal',
  drive: 'Drive',
  tickets: 'Chamados',
  team: 'Equipe',
  settings: 'Configurações',
}

// ===== Ticket Status =====
export const TICKET_STATUS_LABELS: Record<string, string> = {
  aberto: 'Aberto',
  em_andamento: 'Em Atendimento',
  aguardando_cliente: 'Aguardando Cliente',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
}

export const TICKET_STATUS_COLORS: Record<string, string> = {
  aberto: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  em_andamento: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  aguardando_cliente: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  resolvido: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  fechado: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

// ===== Ticket Priority =====
export const TICKET_PRIORITY_LABELS: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const TICKET_PRIORITY_COLORS: Record<string, string> = {
  baixa: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  media: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  alta: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  urgente: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

// ===== Document Categories =====
export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  fiscal: 'Fiscal',
  contabil: 'Contábil',
  trabalhista: 'Trabalhista',
  societario: 'Societário',
  certidao: 'Certidão',
  contrato: 'Contrato',
  relatorio: 'Relatório',
  outros: 'Outros',
}

// ===== Monitoring Status =====
export const MONITORING_STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  regular: 'Regular',
  irregular: 'Irregular',
  expirado: 'Vencido',
  alerta: 'Atenção',
}

export const MONITORING_STATUS_COLORS: Record<string, string> = {
  regular: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pendente: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  alerta: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  irregular: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expirado: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400',
}

// ===== Severity =====
export const SEVERITY_LABELS: Record<string, string> = {
  info: 'Informativo',
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  critica: 'Crítica',
}

// ===== Plan labels =====
export const PLAN_LABELS: Record<string, string> = {
  'básico': 'Básico',
  'pró': 'Pró',
  'plus': 'Plus',
}

// ===== App Constants =====
export const APP_NAME = 'Bi2B Consultoria'
export const MAX_USERS_PER_COMPANY = 5
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const ALLOWED_FILE_TYPES = [
  '.pdf',
  '.docx',
  '.xlsx',
  '.xls',
  '.csv',
  '.zip',
  '.rar',
  '.7z',
  '.xml',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp'
]

// Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial
export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PASSWORD_REQUIREMENTS_MESSAGE = 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@$!%*?&).'

export const ITEMS_PER_PAGE = 20

// Re-export notifications constants & helpers
export * from './notifications'
