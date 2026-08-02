import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/constants/routes'

export interface AdminNotificationPayload {
  userId: string
  companyId?: string | null
  companyName?: string | null
  title: string
  message: string
  type?: 'info' | 'sucesso' | 'alerta' | 'erro' | 'sistema'
  actionUrl?: string
}

export async function createAdminNotification(payload: AdminNotificationPayload) {
  try {
    const { error } = await supabase.from('notificacoes').insert({
      user_id: payload.userId,
      company_id: payload.companyId || null,
      company_name: payload.companyName || null,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'info',
      action_url: payload.actionUrl || ROUTES.ADMIN_NOTIFICATIONS,
      is_read: false,
    })

    if (error) {
      if (import.meta.env.DEV) console.warn('Aviso ao criar notificação para o admin:', error.message)
    }

    // Disparar evento para atualizar interfaces ativas
    window.dispatchEvent(new CustomEvent('bi2b:refresh-data'))
  } catch (err) {
    if (import.meta.env.DEV) console.error('Erro ao notificar admin:', err)
  }
}
