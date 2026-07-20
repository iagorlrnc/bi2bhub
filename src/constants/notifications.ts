import { Info, CheckCircle2, AlertTriangle, AlertCircle, FileText, MessageSquare, ShieldCheck, type LucideIcon } from 'lucide-react'
import type { NotificationType } from '@/types/database.types'

export interface NotificationTypeConfig {
  value: NotificationType
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  borderColor: string
  badgeBg: string
  badgeText: string
  badgeBorder: string
  cardBg: string
  activeRing: string
}

export const NOTIFICATION_TYPES: Record<NotificationType, NotificationTypeConfig> = {
  info: {
    value: 'info',
    label: 'Geral / Informativo (Azul)',
    shortLabel: 'Informativo',
    description: 'Comunicados gerais, atualizações e informações de rotina',
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-800/60',
    cardBg: 'hover:border-blue-300 dark:hover:border-blue-800',
    activeRing: 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30',
  },
  sucesso: {
    value: 'sucesso',
    label: 'Sucesso / Concluído (Verde)',
    shortLabel: 'Sucesso',
    description: 'Confirmações de tarefas concluídas, envios e processos finalizados',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-200 dark:border-emerald-900/40',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/60',
    cardBg: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30',
  },
  alerta: {
    value: 'alerta',
    label: 'Aviso / Alerta (Amarelo)',
    shortLabel: 'Aviso',
    description: 'Alertas de vencimento próximo, lembretes e atenção requerida',
    icon: AlertTriangle,
    iconColor: 'text-amber-500 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-200 dark:border-amber-900/40',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/60',
    cardBg: 'hover:border-amber-300 dark:hover:border-amber-800',
    activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/50 dark:bg-amber-950/30',
  },
  erro: {
    value: 'erro',
    label: 'Urgente / Erro (Vermelho)',
    shortLabel: 'Urgente',
    description: 'Notificações de urgência, prazos esgotados ou pendências graves',
    icon: AlertCircle,
    iconColor: 'text-rose-500 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    borderColor: 'border-rose-200 dark:border-rose-900/40',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/60',
    cardBg: 'hover:border-rose-300 dark:hover:border-rose-800',
    activeRing: 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/50 dark:bg-rose-950/30',
  },
  documento: {
    value: 'documento',
    label: 'Documento Novo (Índigo)',
    shortLabel: 'Documento',
    description: 'Avisos sobre novos documentos, guias de impostos ou relatórios anexados',
    icon: FileText,
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    borderColor: 'border-indigo-200 dark:border-indigo-900/40',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800/60',
    cardBg: 'hover:border-indigo-300 dark:hover:border-indigo-800',
    activeRing: 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30',
  },
  chamado: {
    value: 'chamado',
    label: 'Suporte / Chamados (Roxo)',
    shortLabel: 'Chamado',
    description: 'Respostas de solicitações de suporte, atualizações de chamados',
    icon: MessageSquare,
    iconColor: 'text-purple-500 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    borderColor: 'border-purple-200 dark:border-purple-900/40',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800/60',
    cardBg: 'hover:border-purple-300 dark:hover:border-purple-800',
    activeRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/50 dark:bg-purple-950/30',
  },
  sistema: {
    value: 'sistema',
    label: 'Sistema / Manutenção (Teal)',
    shortLabel: 'Sistema',
    description: 'Avisos sobre o sistema, manutenções programadas e atualizações',
    icon: ShieldCheck,
    iconColor: 'text-teal-500 dark:text-teal-400',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    borderColor: 'border-teal-200 dark:border-teal-900/40',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-800/60',
    cardBg: 'hover:border-teal-300 dark:hover:border-teal-800',
    activeRing: 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30',
  },
}

export function getNotificationConfig(type?: string | null): NotificationTypeConfig {
  if (!type) return NOTIFICATION_TYPES.info
  const normalized = type.trim().toLowerCase()
  
  if (Object.prototype.hasOwnProperty.call(NOTIFICATION_TYPES, normalized)) {
    return NOTIFICATION_TYPES[normalized as NotificationType]
  }

  // Fallback aliases for resilience
  if (normalized.includes('alerta') || normalized.includes('warning') || normalized.includes('aviso')) return NOTIFICATION_TYPES.alerta
  if (normalized.includes('sucesso') || normalized.includes('success') || normalized.includes('concluid')) return NOTIFICATION_TYPES.sucesso
  if (normalized.includes('erro') || normalized.includes('error') || normalized.includes('urgente') || normalized.includes('danger')) return NOTIFICATION_TYPES.erro
  if (normalized.includes('doc') || normalized.includes('file') || normalized.includes('drive')) return NOTIFICATION_TYPES.documento
  if (normalized.includes('chamad') || normalized.includes('ticket') || normalized.includes('suporte')) return NOTIFICATION_TYPES.chamado
  if (normalized.includes('sistem') || normalized.includes('system') || normalized.includes('manutenc')) return NOTIFICATION_TYPES.sistema

  return NOTIFICATION_TYPES.info
}
